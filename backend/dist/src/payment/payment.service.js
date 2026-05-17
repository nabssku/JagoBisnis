"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const pakasir_checkout_provider_1 = require("../order/providers/pakasir-checkout.provider");
const crypto_1 = require("../utils/crypto");
const client_1 = require("@prisma/client");
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    pakasirCheckout;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(prisma, pakasirCheckout) {
        this.prisma = prisma;
        this.pakasirCheckout = pakasirCheckout;
    }
    async handlePakasirWebhook(payload) {
        this.logger.log(`Received Pakasir Webhook: order_id=${payload.order_id}, status=${payload.status}`);
        const orderId = payload.order_id;
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
            throw new common_1.NotFoundException(`Order with Pakasir Order ID ${orderId} not found.`);
        }
        if (Number(payload.amount) !== Number(order.subtotal)) {
            this.logger.error(`Webhook amount mismatch for order ${order.id}. Webhook amount: ${payload.amount}, Order subtotal: ${order.subtotal}`);
            throw new common_1.BadRequestException('Transaction amount mismatch.');
        }
        const pakasirIntegration = order.business.Integration[0];
        if (!pakasirIntegration || !pakasirIntegration.config) {
            this.logger.error(`Pakasir integration not configured for business: ${order.businessId}`);
            throw new common_1.BadRequestException('Pakasir integration is not configured.');
        }
        const config = pakasirIntegration.config;
        if (config.slug !== payload.project) {
            this.logger.error(`Project slug mismatch. Webhook: ${payload.project}, Configured: ${config.slug}`);
            throw new common_1.BadRequestException('Project slug mismatch.');
        }
        if (order.paymentStatus === client_1.PaymentStatus.PAID) {
            this.logger.log(`Duplicate webhook received. Order ${order.id} is already paid.`);
            return { success: true, message: 'Payment already processed and paid.' };
        }
        const decryptedApiKey = crypto_1.CryptoUtil.decrypt(config.apiKey);
        const verifiedDetails = await this.pakasirCheckout.verifyTransaction(config.slug, order.subtotal, order.id, decryptedApiKey);
        if (!verifiedDetails) {
            this.logger.warn(`Out-of-band transaction detail verification failed for order ${order.id}. Proceeding with payload status.`);
        }
        else if (verifiedDetails.status !== 'completed' && payload.status === 'completed') {
            this.logger.error(`Pakasir transaction details API reports status "${verifiedDetails.status}" instead of "completed". Rejecting webhook.`);
            throw new common_1.BadRequestException('Transaction verification reports incomplete status.');
        }
        if (payload.status === 'completed') {
            const updated = await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                    orderStatus: client_1.OrderStatus.CONFIRMED,
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pakasir_checkout_provider_1.PakasirCheckoutProvider])
], PaymentService);
//# sourceMappingURL=payment.service.js.map