import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PakasirCheckoutProvider } from './providers/pakasir-checkout.provider';
import { CryptoUtil } from '../utils/crypto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pakasirCheckout: PakasirCheckoutProvider,
  ) {}

  /**
   * Creates a public order from the published shop website
   */
  async createPublicOrder(siteSlug: string, dto: CreatePublicOrderDto) {
    this.logger.log(
      `Creating public order for site: ${siteSlug}, product: ${dto.productId}`,
    );

    // 1. Find the published site
    const site = await this.prisma.site.findFirst({
      where: {
        slug: siteSlug,
        isPublished: true,
      },
      include: {
        business: true,
      },
    });

    if (!site) {
      throw new NotFoundException(
        `Toko dengan alamat "${siteSlug}" tidak ditemukan atau belum dipublikasikan.`,
      );
    }

    const businessId = site.businessId;

    // 2. Validate product exists and belongs to this business
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.productId,
        businessId: businessId,
        isActive: true,
      },
    });

    if (!product) {
      throw new BadRequestException(
        'Produk tidak ditemukan atau sedang tidak aktif.',
      );
    }

    // 3. Calculate financial totals
    const quantity = dto.quantity;
    if (quantity < 1) {
      throw new BadRequestException('Jumlah pembelian minimal harus 1 item.');
    }

    const subtotal = product.price * quantity;
    const orderId =
      'JB-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    const orderStatus: OrderStatus = OrderStatus.PENDING;
    let paymentStatus: PaymentStatus = PaymentStatus.UNPAID;
    let pakasirOrderId: string | null = null;
    let pakasirPaymentUrl: string | null = null;
    let pakasirPaymentMethod: string | null = null;

    // 4. Handle Payment Method Flow
    if (dto.paymentMethod === 'PAKASIR') {
      // Find Pakasir integration
      const integration = await this.prisma.integration.findFirst({
        where: {
          businessId,
          provider: 'PAKASIR',
          status: 'CONNECTED',
        },
      });

      if (!integration || !integration.config) {
        throw new BadRequestException(
          'Metode pembayaran online Pakasir saat ini belum aktif pada toko ini.',
        );
      }

      const config = integration.config as { slug: string; apiKey: string };
      const pakasirSlug = config.slug;

      paymentStatus = PaymentStatus.PENDING;
      pakasirOrderId = orderId;
      pakasirPaymentMethod = 'QRIS';

      // Generate Frontend redirect status page
      const rawFrontendUrl =
        process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = rawFrontendUrl
        .split(',')[0]
        .trim()
        .replace(/^['"]|['"]$/g, '');
      const redirectUrl = `${frontendUrl}/jago/${siteSlug}/orders/${orderId}`;

      // Call Pakasir Checkout provider to construct redirect URL
      pakasirPaymentUrl = this.pakasirCheckout.generateCheckoutUrl(
        pakasirSlug,
        subtotal,
        orderId,
        redirectUrl,
      );
    }

    // 5. Create Order in database
    const newOrder = await this.prisma.order.create({
      data: {
        id: orderId,
        businessId,
        productId: product.id,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        customerAddress: dto.customerAddress,
        quantity,
        productNameSnapshot: product.name,
        productPriceSnapshot: product.price,
        subtotal,
        paymentMethod: dto.paymentMethod,
        orderStatus,
        paymentStatus,
        pakasirOrderId,
        pakasirPaymentUrl,
        pakasirPaymentMethod,
        notes: dto.notes,
      },
      include: {
        product: true,
      },
    });

    this.logger.log(`Successfully created public order: ${newOrder.id}`);
    return newOrder;
  }

  /**
   * Retrieves public order status details
   */
  async getPublicOrderStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        business: {
          include: {
            Site: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan.');
    }

    return {
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      productName: order.productNameSnapshot,
      productPrice: order.productPriceSnapshot,
      quantity: order.quantity,
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      pakasirPaymentUrl: order.pakasirPaymentUrl,
      notes: order.notes,
      businessName: order.business.name,
      siteSlug: order.business.Site?.slug || '',
      createdAt: order.createdAt,
    };
  }

  /**
   * Retrieves all orders for a business
   */
  async getBusinessOrders(businessId: string, userId: string) {
    await this.verifyUserAccess(businessId, userId);

    return this.prisma.order.findMany({
      where: { businessId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retrieves specific order detail for a business
   */
  async getBusinessOrderDetail(
    businessId: string,
    orderId: string,
    userId: string,
  ) {
    await this.verifyUserAccess(businessId, userId);

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        businessId,
      },
      include: {
        product: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan.');
    }

    return order;
  }

  /**
   * Updates specific order status
   */
  async updateBusinessOrderStatus(
    businessId: string,
    orderId: string,
    userId: string,
    dto: UpdateOrderStatusDto,
  ) {
    await this.verifyUserAccess(businessId, userId, ['OWNER', 'ADMIN']);

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        businessId,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan.');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus:
          dto.orderStatus !== undefined ? dto.orderStatus : order.orderStatus,
        paymentStatus:
          dto.paymentStatus !== undefined
            ? dto.paymentStatus
            : order.paymentStatus,
      },
      include: {
        product: true,
      },
    });

    this.logger.log(`Updated status of order ${orderId} by user ${userId}`);
    return updated;
  }

  /**
   * Helper to verify user permissions
   */
  private async verifyUserAccess(
    businessId: string,
    userId: string,
    allowedRoles: ('OWNER' | 'ADMIN' | 'STAFF')[] = ['OWNER', 'ADMIN', 'STAFF'],
  ) {
    const businessUser = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (!businessUser || !allowedRoles.includes(businessUser.role)) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke data pesanan bisnis ini.',
      );
    }
  }
}
