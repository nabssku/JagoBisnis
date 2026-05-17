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
exports.SiteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let SiteService = class SiteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    defaultTheme = {
        primaryColor: '#16a34a',
        font: 'Inter',
        backgroundColor: '#ffffff',
        textColor: '#111827',
    };
    defaultSections = [
        {
            id: 'hero-1',
            type: 'hero',
            order: 1,
            content: {
                headline: 'Bangun Bisnis Anda Lebih Mudah',
                subheadline: 'Website sederhana untuk memperkenalkan bisnis Anda.',
                buttonText: 'Hubungi Kami',
                buttonUrl: '#contact',
            },
        },
        {
            id: 'about-1',
            type: 'about',
            order: 2,
            content: {
                title: 'Tentang Kami',
                description: 'Ceritakan bisnis Anda di sini.',
            },
        },
        {
            id: 'products-1',
            type: 'products',
            order: 3,
            content: {
                title: 'Produk Kami',
                showProducts: true,
            },
        },
        {
            id: 'contact-1',
            type: 'contact',
            order: 4,
            content: {
                title: 'Hubungi Kami',
                phone: '',
                address: '',
                whatsappText: 'Halo, saya tertarik dengan produk Anda.',
            },
        },
    ];
    async getByBusinessId(businessId, userId) {
        await this.checkMembership(businessId, userId);
        let site = await this.prisma.site.findUnique({
            where: { businessId },
        });
        if (!site) {
            const business = await this.prisma.business.findUnique({
                where: { id: businessId },
            });
            if (!business) {
                throw new common_1.NotFoundException('Bisnis tidak ditemukan');
            }
            site = await this.prisma.site.create({
                data: {
                    businessId,
                    title: business.name,
                    slug: business.slug,
                    theme: this.defaultTheme,
                    sections: this.defaultSections,
                },
            });
        }
        return site;
    }
    async create(businessId, userId, dto) {
        await this.checkPermission(businessId, userId);
        const existingSite = await this.prisma.site.findUnique({
            where: { businessId },
        });
        if (existingSite) {
            throw new common_1.ConflictException('Bisnis sudah memiliki website');
        }
        const slugExists = await this.prisma.site.findUnique({
            where: { slug: dto.slug },
        });
        if (slugExists) {
            throw new common_1.ConflictException('Slug website sudah digunakan');
        }
        return this.prisma.site.create({
            data: {
                businessId,
                title: dto.title,
                slug: dto.slug,
                theme: dto.theme || this.defaultTheme,
                sections: dto.sections || this.defaultSections,
            },
        });
    }
    async update(businessId, userId, dto) {
        await this.checkPermission(businessId, userId);
        const site = await this.prisma.site.findUnique({
            where: { businessId },
        });
        if (!site) {
            throw new common_1.NotFoundException('Website tidak ditemukan');
        }
        if (dto.slug && dto.slug !== site.slug) {
            const slugExists = await this.prisma.site.findUnique({
                where: { slug: dto.slug },
            });
            if (slugExists) {
                throw new common_1.ConflictException('Slug website sudah digunakan');
            }
        }
        return this.prisma.site.update({
            where: { businessId },
            data: dto,
        });
    }
    async updateTheme(businessId, userId, theme) {
        await this.checkPermission(businessId, userId);
        return this.prisma.site.update({
            where: { businessId },
            data: { theme },
        });
    }
    async updateSections(businessId, userId, sections) {
        await this.checkPermission(businessId, userId);
        sections.forEach((section, index) => {
            if (!section.id || !section.type || !section.order || !section.content) {
                throw new common_1.BadRequestException(`Section index ${index} tidak valid`);
            }
        });
        return this.prisma.site.update({
            where: { businessId },
            data: { sections },
        });
    }
    async publish(businessId, userId) {
        await this.checkPermission(businessId, userId);
        return this.prisma.site.update({
            where: { businessId },
            data: {
                isPublished: true,
                publishedAt: new Date(),
            },
        });
    }
    async unpublish(businessId, userId) {
        await this.checkPermission(businessId, userId);
        return this.prisma.site.update({
            where: { businessId },
            data: {
                isPublished: false,
            },
        });
    }
    async getPublicSite(slug) {
        const site = await this.prisma.site.findUnique({
            where: { slug },
            include: {
                business: {
                    include: {
                        Product: {
                            where: { isActive: true },
                        },
                    },
                },
            },
        });
        if (!site || !site.isPublished) {
            throw new common_1.NotFoundException('Website tidak ditemukan atau belum dipublikasikan');
        }
        return site;
    }
    async checkMembership(businessId, userId) {
        const membership = await this.prisma.businessUser.findUnique({
            where: {
                userId_businessId: { userId, businessId },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke bisnis ini');
        }
        return membership;
    }
    async checkPermission(businessId, userId) {
        const membership = await this.checkMembership(businessId, userId);
        if (membership.role !== client_1.Role.OWNER && membership.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Hanya OWNER atau ADMIN yang dapat mengubah website');
        }
    }
};
exports.SiteService = SiteService;
exports.SiteService = SiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiteService);
//# sourceMappingURL=site.service.js.map