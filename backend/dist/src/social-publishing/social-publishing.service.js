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
exports.SocialPublishingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const crypto_1 = require("../utils/crypto");
const instagram_provider_1 = require("../integration/providers/instagram.provider");
const threads_provider_1 = require("../integration/providers/threads.provider");
const client_1 = require("@prisma/client");
let SocialPublishingService = class SocialPublishingService {
    prisma;
    instagramProvider;
    threadsProvider;
    constructor(prisma, instagramProvider, threadsProvider) {
        this.prisma = prisma;
        this.instagramProvider = instagramProvider;
        this.threadsProvider = threadsProvider;
    }
    async create(userId, businessId, dto) {
        await this.checkAccess(userId, businessId);
        this.validateSocialRules(dto);
        const integrationProvider = this.mapToIntegrationProvider(dto.provider);
        const integration = await this.prisma.integration.findUnique({
            where: {
                businessId_provider: {
                    businessId,
                    provider: integrationProvider,
                },
            },
        });
        if (!integration || integration.status !== client_1.IntegrationStatus.CONNECTED) {
            throw new common_1.BadRequestException(`Integrasi untuk ${dto.provider} belum aktif. Harap hubungkan akun Anda terlebih dahulu di pengaturan Integrasi.`);
        }
        return this.prisma.socialPost.create({
            data: {
                businessId,
                provider: dto.provider,
                integrationId: integration.id,
                content: dto.content,
                mediaType: dto.mediaType || client_1.MediaType.TEXT,
                mediaUrls: dto.mediaUrls ? JSON.stringify(dto.mediaUrls) : '[]',
                status: client_1.SocialPostStatus.DRAFT,
            },
        });
    }
    async findAll(userId, businessId) {
        await this.checkAccess(userId, businessId);
        return this.prisma.socialPost.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
            include: {
                integration: {
                    select: {
                        providerAccountId: true,
                        providerAccountName: true,
                    },
                },
            },
        });
    }
    async findOne(userId, businessId, id) {
        await this.checkAccess(userId, businessId);
        const post = await this.prisma.socialPost.findFirst({
            where: { id, businessId },
            include: {
                integration: {
                    select: {
                        providerAccountId: true,
                        providerAccountName: true,
                    },
                },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Postingan tidak ditemukan');
        }
        return post;
    }
    async remove(userId, businessId, id) {
        await this.checkPermission(userId, businessId);
        const post = await this.findOne(userId, businessId, id);
        if (post.status === client_1.SocialPostStatus.PUBLISHED ||
            post.status === client_1.SocialPostStatus.PUBLISHING) {
            throw new common_1.BadRequestException('Postingan yang sedang dipublikasikan tidak dapat dihapus');
        }
        return this.prisma.socialPost.delete({
            where: { id },
        });
    }
    async publish(userId, businessId, id) {
        await this.checkPermission(userId, businessId);
        const post = await this.prisma.socialPost.findFirst({
            where: { id, businessId },
            include: { integration: true },
        });
        if (!post) {
            throw new common_1.NotFoundException('Postingan tidak ditemukan');
        }
        if (post.status === client_1.SocialPostStatus.PUBLISHED) {
            throw new common_1.BadRequestException('Postingan ini sudah sukses terpublikasi');
        }
        const integration = post.integration;
        if (!integration ||
            integration.status !== client_1.IntegrationStatus.CONNECTED ||
            !integration.accessToken) {
            throw new common_1.BadRequestException('Integrasi media sosial untuk postingan ini terputus atau tidak valid.');
        }
        await this.prisma.socialPost.update({
            where: { id },
            data: { status: client_1.SocialPostStatus.PUBLISHING, errorMessage: null },
        });
        const accessToken = crypto_1.CryptoUtil.decrypt(integration.accessToken);
        const mediaUrlsList = JSON.parse(post.mediaUrls || '[]');
        try {
            let providerPostId = '';
            if (post.provider === client_1.SocialPostProvider.INSTAGRAM) {
                if (!mediaUrlsList || mediaUrlsList.length === 0) {
                    throw new Error('Instagram publishing requires a media URL');
                }
                providerPostId = await this.instagramProvider.publish(accessToken, integration.providerAccountId || '', post.content, mediaUrlsList[0]);
            }
            else if (post.provider === client_1.SocialPostProvider.THREADS) {
                const imageToPublish = mediaUrlsList.length > 0 ? mediaUrlsList[0] : undefined;
                providerPostId = await this.threadsProvider.publish(accessToken, integration.providerAccountId || '', post.content, imageToPublish);
            }
            return this.prisma.socialPost.update({
                where: { id },
                data: {
                    status: client_1.SocialPostStatus.PUBLISHED,
                    providerPostId,
                    publishedAt: new Date(),
                },
            });
        }
        catch (error) {
            return this.prisma.socialPost.update({
                where: { id },
                data: {
                    status: client_1.SocialPostStatus.FAILED,
                    errorMessage: error.message || 'Penerbitan postingan sosial gagal.',
                },
            });
        }
    }
    validateSocialRules(dto) {
        if (dto.provider === client_1.SocialPostProvider.INSTAGRAM) {
            if (dto.mediaType === client_1.MediaType.TEXT) {
                throw new common_1.BadRequestException('Instagram tidak mendukung postingan berupa teks saja. Harap sertakan media gambar/video.');
            }
            if (!dto.mediaUrls || dto.mediaUrls.length === 0) {
                throw new common_1.BadRequestException('Instagram mewajibkan minimal satu media gambar atau video untuk dipublikasikan.');
            }
        }
    }
    mapToIntegrationProvider(provider) {
        if (provider === client_1.SocialPostProvider.INSTAGRAM)
            return client_1.IntegrationProvider.INSTAGRAM;
        if (provider === client_1.SocialPostProvider.THREADS)
            return client_1.IntegrationProvider.THREADS;
        throw new common_1.BadRequestException('Platform sosial tidak dikenali');
    }
    async checkAccess(userId, businessId) {
        const businessUser = await this.prisma.businessUser.findUnique({
            where: {
                userId_businessId: { userId, businessId },
            },
        });
        if (!businessUser) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke bisnis ini');
        }
        return businessUser;
    }
    async checkPermission(userId, businessId) {
        const businessUser = await this.checkAccess(userId, businessId);
        if (businessUser.role !== client_1.Role.OWNER && businessUser.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Hanya Owner atau Admin yang memiliki izin untuk mempublikasikan postingan');
        }
    }
};
exports.SocialPublishingService = SocialPublishingService;
exports.SocialPublishingService = SocialPublishingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        instagram_provider_1.InstagramProvider,
        threads_provider_1.ThreadsProvider])
], SocialPublishingService);
//# sourceMappingURL=social-publishing.service.js.map