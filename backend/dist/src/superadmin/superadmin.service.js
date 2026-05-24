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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SuperAdminService = class SuperAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlatformStats() {
        const [totalUsers, totalBusinesses, totalProducts, totalOrders] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.business.count(),
            this.prisma.product.count(),
            this.prisma.order.count(),
        ]);
        const completedOrders = await this.prisma.order.findMany({
            where: {
                paymentStatus: 'PAID',
            },
            select: {
                subtotal: true,
            },
        });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.subtotal, 0);
        const recentUsers = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const recentBusinesses = await this.prisma.business.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                slug: true,
                category: true,
                createdAt: true,
            },
        });
        const recentOrders = await this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                business: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return {
            totalUsers,
            totalBusinesses,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentUsers,
            recentBusinesses,
            recentOrders,
        };
    }
    async getUsersList() {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatarUrl: true,
                createdAt: true,
                BusinessUser: {
                    include: {
                        business: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async updateUserRole(userId, role) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Pengguna tidak ditemukan');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }
    async getBusinessesList() {
        const businesses = await this.prisma.business.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                BusinessUser: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        Product: true,
                        Order: true,
                    },
                },
            },
        });
        return businesses.map((b) => {
            const owner = b.BusinessUser.find((bu) => bu.role === 'OWNER')?.user || null;
            return {
                id: b.id,
                name: b.name,
                slug: b.slug,
                category: b.category,
                phone: b.phone,
                address: b.address,
                createdAt: b.createdAt,
                productsCount: b._count.Product,
                ordersCount: b._count.Order,
                owner,
            };
        });
    }
    async deleteBusiness(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Bisnis tidak ditemukan');
        }
        await this.prisma.$transaction([
            this.prisma.businessUser.deleteMany({ where: { businessId } }),
            this.prisma.product.deleteMany({ where: { businessId } }),
            this.prisma.order.deleteMany({ where: { businessId } }),
            this.prisma.post.deleteMany({ where: { businessId } }),
            this.prisma.integration.deleteMany({ where: { businessId } }),
            this.prisma.socialPost.deleteMany({ where: { businessId } }),
            this.prisma.media.deleteMany({ where: { businessId } }),
            this.prisma.site.deleteMany({ where: { businessId } }),
            this.prisma.business.delete({ where: { id: businessId } }),
        ]);
        return {
            success: true,
            message: 'Bisnis berhasil dihapus secara permanen',
        };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuperAdminService);
//# sourceMappingURL=superadmin.service.js.map