import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PakasirCheckoutProvider } from '../order/providers/pakasir-checkout.provider';
import { CryptoUtil } from '../utils/crypto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pakasirCheckout: PakasirCheckoutProvider,
  ) {}

  /**
   * Handles payment notifications from Pakasir payment gateway webhook
   */
  async handlePakasirWebhook(payload: {
    amount: number;
    order_id: string;
    project: string;
    status: string;
    payment_method: string;
    completed_at: string;
  }) {
    this.logger.log(`Received Pakasir Webhook: order_id=${payload.order_id}, status=${payload.status}`);

    const orderId = payload.order_id;

    // 1. Find the order by pakasirOrderId
    const order = await this.prisma.order.findUnique({
      where: { pakasirOrderId: orderId },
      include: {
        business: {
          include: {
            Integration: {
              where: { provider: 'PAKASIR' },
            },
          },
        },
      },
    });

    if (!order) {
      this.logger.warn(`Order not found for Pakasir Webhook: ${orderId}`);
      throw new NotFoundException(`Order with Pakasir Order ID ${orderId} not found.`);
    }

    // 2. Match transaction amount
    if (Number(payload.amount) !== Number(order.subtotal)) {
      this.logger.error(
        `Webhook amount mismatch for order ${order.id}. Webhook amount: ${payload.amount}, Order subtotal: ${order.subtotal}`,
      );
      throw new BadRequestException('Transaction amount mismatch.');
    }

    // 3. Match project slug
    const pakasirIntegration = order.business.Integration[0];
    if (!pakasirIntegration || !pakasirIntegration.config) {
      this.logger.error(`Pakasir integration not configured for business: ${order.businessId}`);
      throw new BadRequestException('Pakasir integration is not configured.');
    }

    const config = pakasirIntegration.config as { slug: string; apiKey: string };
    if (config.slug !== payload.project) {
      this.logger.error(
        `Project slug mismatch. Webhook: ${payload.project}, Configured: ${config.slug}`,
      );
      throw new BadRequestException('Project slug mismatch.');
    }

    // 4. Handle duplicates - if already paid, skip but log as info
    if (order.paymentStatus === PaymentStatus.PAID) {
      this.logger.log(`Duplicate webhook received. Order ${order.id} is already paid.`);
      return { success: true, message: 'Payment already processed and paid.' };
    }

    // 5. Verification check via GET Transaction Detail API for highest security
    const decryptedApiKey = CryptoUtil.decrypt(config.apiKey);
    const verifiedDetails = await this.pakasirCheckout.verifyTransaction(
      config.slug,
      order.subtotal,
      order.id,
      decryptedApiKey,
    );

    if (!verifiedDetails) {
      this.logger.warn(
        `Out-of-band transaction detail verification failed for order ${order.id}. Proceeding with payload status.`,
      );
    } else if (verifiedDetails.status !== 'completed' && payload.status === 'completed') {
      this.logger.error(
        `Pakasir transaction details API reports status "${verifiedDetails.status}" instead of "completed". Rejecting webhook.`,
      );
      throw new BadRequestException('Transaction verification reports incomplete status.');
    }

    // 6. Update order and payment state
    if (payload.status === 'completed') {
      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.CONFIRMED,
          pakasirPaymentMethod: payload.payment_method || order.pakasirPaymentMethod,
          metadata: {
            webhookPayload: payload,
            completedAt: payload.completed_at,
          },
        },
      });

      this.logger.log(`Successfully completed order ${updated.id} payment from Pakasir Webhook.`);
      return {
        success: true,
        message: 'Payment successfully processed.',
        orderId: updated.id,
      };
    }

    return {
      success: true,
      message: `Webhook processed with state: ${payload.status}`,
    };
  }
}
