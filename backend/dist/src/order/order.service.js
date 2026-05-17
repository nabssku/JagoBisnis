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
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const pakasir_checkout_provider_1 = require("./providers/pakasir-checkout.provider");
const client_1 = require("@prisma/client");
let OrderService = OrderService_1 = class OrderService {
    prisma;
    pakasirCheckout;
    logger = new common_1.Logger(OrderService_1.name);
    constructor(prisma, pakasirCheckout) {
        this.prisma = prisma;
        this.pakasirCheckout = pakasirCheckout;
    }
    async createPublicOrder(siteSlug, dto) {
        this.logger.log(`Creating public order for site: ${siteSlug}, product: ${dto.productId}`);
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
            throw new common_1.NotFoundException(`Toko dengan alamat "${siteSlug}" tidak ditemukan atau belum dipublikasikan.`);
        }
        const businessId = site.businessId;
        const product = await this.prisma.product.findFirst({
            where: {
                id: dto.productId,
                businessId: businessId,
                isActive: true,
            },
        });
        if (!product) {
            throw new common_1.BadRequestException('Produk tidak ditemukan atau sedang tidak aktif.');
        }
        const quantity = dto.quantity;
        if (quantity < 1) {
            throw new common_1.BadRequestException('Jumlah pembelian minimal harus 1 item.');
        }
        const subtotal = product.price * quantity;
        const orderId = 'JB-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
        let orderStatus = client_1.OrderStatus.PENDING;
        let paymentStatus = client_1.PaymentStatus.UNPAID;
        let pakasirOrderId = null;
        let pakasirPaymentUrl = null;
        let pakasirPaymentMethod = null;
        if (dto.paymentMethod === 'PAKASIR') {
            const integration = await this.prisma.integration.findFirst({
                where: {
                    businessId,
                    provider: 'PAKASIR',
                    status: 'CONNECTED',
                },
            });
            if (!integration || !integration.config) {
                throw new common_1.BadRequestException('Metode pembayaran online Pakasir saat ini belum aktif pada toko ini.');
            }
            const config = integration.config;
            const pakasirSlug = config.slug;
            paymentStatus = client_1.PaymentStatus.PENDING;
            pakasirOrderId = orderId;
            pakasirPaymentMethod = 'QRIS';
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const redirectUrl = `${frontendUrl}/jago/${siteSlug}/orders/${orderId}`;
            pakasirPaymentUrl = this.pakasirCheckout.generateCheckoutUrl(pakasirSlug, subtotal, orderId, redirectUrl);
        }
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
    async getPublicOrderStatus(orderId) {
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
            throw new common_1.NotFoundException('Pesanan tidak ditemukan.');
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
    async getBusinessOrders(businessId, userId) {
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
    async getBusinessOrderDetail(businessId, orderId, userId) {
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
            throw new common_1.NotFoundException('Pesanan tidak ditemukan.');
        }
        return order;
    }
    async updateBusinessOrderStatus(businessId, orderId, userId, dto) {
        await this.verifyUserAccess(businessId, userId, ['OWNER', 'ADMIN']);
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                businessId,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan.');
        }
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                orderStatus: dto.orderStatus !== undefined ? dto.orderStatus : order.orderStatus,
                paymentStatus: dto.paymentStatus !== undefined ? dto.paymentStatus : order.paymentStatus,
            },
            include: {
                product: true,
            },
        });
        this.logger.log(`Updated status of order ${orderId} by user ${userId}`);
        return updated;
    }
    async verifyUserAccess(businessId, userId, allowedRoles = ['OWNER', 'ADMIN', 'STAFF']) {
        const businessUser = await this.prisma.businessUser.findUnique({
            where: {
                userId_businessId: {
                    userId,
                    businessId,
                },
            },
        });
        if (!businessUser || !allowedRoles.includes(businessUser.role)) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke data pesanan bisnis ini.');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pakasir_checkout_provider_1.PakasirCheckoutProvider])
], OrderService);
//# sourceMappingURL=order.service.js.map