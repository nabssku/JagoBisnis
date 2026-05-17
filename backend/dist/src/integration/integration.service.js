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
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const crypto_1 = require("../utils/crypto");
const instagram_provider_1 = require("./providers/instagram.provider");
const threads_provider_1 = require("./providers/threads.provider");
const pakasir_integration_provider_1 = require("./providers/pakasir-integration.provider");
const google_analytics_provider_1 = require("./providers/google-analytics.provider");
const client_1 = require("@prisma/client");
let IntegrationService = class IntegrationService {
    prisma;
    instagramProvider;
    threadsProvider;
    pakasirProvider;
    gaProvider;
    constructor(prisma, instagramProvider, threadsProvider, pakasirProvider, gaProvider) {
        this.prisma = prisma;
        this.instagramProvider = instagramProvider;
        this.threadsProvider = threadsProvider;
        this.pakasirProvider = pakasirProvider;
        this.gaProvider = gaProvider;
    }
    async findAll(userId, businessId) {
        await this.checkAccess(userId, businessId);
        const integrations = await this.prisma.integration.findMany({
            where: { businessId },
        });
        return integrations.map((integration) => this.sanitizeIntegration(integration));
    }
    async findOne(userId, businessId, provider) {
        await this.checkAccess(userId, businessId);
        const integration = await this.prisma.integration.findFirst({
            where: { businessId, provider },
        });
        if (!integration) {
            throw new common_1.NotFoundException(`Integration with provider ${provider} not found`);
        }
        return this.sanitizeIntegration(integration);
    }
    async connectPakasir(userId, businessId, dto) {
        await this.checkPermission(userId, businessId);
        await this.pakasirProvider.testConnection(dto.slug, dto.apiKey);
        const encryptedApiKey = crypto_1.CryptoUtil.encrypt(dto.apiKey);
        const integration = await this.prisma.integration.upsert({
            where: {
                businessId_provider: {
                    businessId,
                    provider: client_1.IntegrationProvider.PAKASIR,
                },
            },
            update: {
                status: client_1.IntegrationStatus.CONNECTED,
                config: {
                    slug: dto.slug,
                    apiKey: encryptedApiKey,
                },
            },
            create: {
                businessId,
                provider: client_1.IntegrationProvider.PAKASIR,
                status: client_1.IntegrationStatus.CONNECTED,
                config: {
                    slug: dto.slug,
                    apiKey: encryptedApiKey,
                },
            },
        });
        return this.sanitizeIntegration(integration);
    }
    async testPakasir(userId, businessId, dto) {
        await this.checkAccess(userId, businessId);
        let keyToTest = dto.apiKey;
        if (dto.apiKey.startsWith('pk_****')) {
            const existing = await this.prisma.integration.findUnique({
                where: {
                    businessId_provider: {
                        businessId,
                        provider: client_1.IntegrationProvider.PAKASIR,
                    },
                },
            });
            if (!existing || !existing.config) {
                throw new common_1.BadRequestException('No existing configured API key found');
            }
            const config = existing.config;
            if (config.apiKey) {
                keyToTest = crypto_1.CryptoUtil.decrypt(config.apiKey);
            }
        }
        return {
            success: await this.pakasirProvider.testConnection(dto.slug, keyToTest),
            message: 'Koneksi ke Pakasir berhasil!',
        };
    }
    async connectGoogleAnalytics(userId, businessId, dto) {
        await this.checkPermission(userId, businessId);
        await this.gaProvider.testConnection(dto.measurementId, dto.apiSecret);
        const encryptedApiSecret = dto.apiSecret ? crypto_1.CryptoUtil.encrypt(dto.apiSecret) : undefined;
        const integration = await this.prisma.integration.upsert({
            where: {
                businessId_provider: {
                    businessId,
                    provider: client_1.IntegrationProvider.GOOGLE_ANALYTICS,
                },
            },
            update: {
                status: client_1.IntegrationStatus.CONNECTED,
                config: {
                    measurementId: dto.measurementId,
                    apiSecret: encryptedApiSecret,
                },
            },
            create: {
                businessId,
                provider: client_1.IntegrationProvider.GOOGLE_ANALYTICS,
                status: client_1.IntegrationStatus.CONNECTED,
                config: {
                    measurementId: dto.measurementId,
                    apiSecret: encryptedApiSecret,
                },
            },
        });
        return this.sanitizeIntegration(integration);
    }
    async testGoogleAnalytics(userId, businessId, dto) {
        await this.checkAccess(userId, businessId);
        let secretToTest = dto.apiSecret;
        if (dto.apiSecret && dto.apiSecret.startsWith('****')) {
            const existing = await this.prisma.integration.findUnique({
                where: {
                    businessId_provider: {
                        businessId,
                        provider: client_1.IntegrationProvider.GOOGLE_ANALYTICS,
                    },
                },
            });
            if (existing && existing.config) {
                const config = existing.config;
                if (config.apiSecret) {
                    secretToTest = crypto_1.CryptoUtil.decrypt(config.apiSecret);
                }
            }
        }
        return {
            success: await this.gaProvider.testConnection(dto.measurementId, secretToTest),
            message: 'Koneksi ke Google Analytics berhasil!',
        };
    }
    async disconnect(userId, businessId, provider) {
        await this.checkPermission(userId, businessId);
        const existing = await this.prisma.integration.findUnique({
            where: {
                businessId_provider: { businessId, provider },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Integration with provider ${provider} is not connected`);
        }
        await this.prisma.integration.delete({
            where: {
                businessId_provider: { businessId, provider },
            },
        });
        return {
            success: true,
            message: `Berhasil memutuskan hubungan integrasi ${provider}`,
        };
    }
    async getInstagramConnectUrl(userId, businessId) {
        await this.checkPermission(userId, businessId);
        const url = this.instagramProvider.getConnectUrl(businessId);
        return { url };
    }
    async handleInstagramCallback(code, state) {
        let businessId;
        try {
            const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
            businessId = decodedState.businessId;
        }
        catch (e) {
            throw new common_1.BadRequestException('State token is invalid or corrupted');
        }
        if (!businessId) {
            throw new common_1.BadRequestException('Business ID was not supplied in the state token');
        }
        const tokenData = await this.instagramProvider.exchangeCodeForToken(code);
        const accountInfo = await this.instagramProvider.getAccountInfo(tokenData.accessToken);
        const encryptedToken = crypto_1.CryptoUtil.encrypt(tokenData.accessToken);
        await this.prisma.integration.upsert({
            where: {
                businessId_provider: {
                    businessId,
                    provider: client_1.IntegrationProvider.INSTAGRAM,
                },
            },
            update: {
                status: client_1.IntegrationStatus.CONNECTED,
                accessToken: encryptedToken,
                providerAccountId: accountInfo.accountId,
                providerAccountName: accountInfo.accountName,
                tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
            },
            create: {
                businessId,
                provider: client_1.IntegrationProvider.INSTAGRAM,
                status: client_1.IntegrationStatus.CONNECTED,
                accessToken: encryptedToken,
                providerAccountId: accountInfo.accountId,
                providerAccountName: accountInfo.accountName,
                tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
            },
        });
        return { businessId };
    }
    async getThreadsConnectUrl(userId, businessId) {
        await this.checkPermission(userId, businessId);
        const url = this.threadsProvider.getConnectUrl(businessId);
        return { url };
    }
    async handleThreadsCallback(code, state) {
        let businessId;
        try {
            const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
            businessId = decodedState.businessId;
        }
        catch (e) {
            throw new common_1.BadRequestException('State token is invalid or corrupted');
        }
        if (!businessId) {
            throw new common_1.BadRequestException('Business ID was not supplied in the state token');
        }
        const tokenData = await this.threadsProvider.exchangeCodeForToken(code);
        const accountInfo = await this.threadsProvider.getAccountInfo(tokenData.accessToken);
        const encryptedToken = crypto_1.CryptoUtil.encrypt(tokenData.accessToken);
        await this.prisma.integration.upsert({
            where: {
                businessId_provider: {
                    businessId,
                    provider: client_1.IntegrationProvider.THREADS,
                },
            },
            update: {
                status: client_1.IntegrationStatus.CONNECTED,
                accessToken: encryptedToken,
                providerAccountId: accountInfo.accountId,
                providerAccountName: accountInfo.accountName,
                tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
            },
            create: {
                businessId,
                provider: client_1.IntegrationProvider.THREADS,
                status: client_1.IntegrationStatus.CONNECTED,
                accessToken: encryptedToken,
                providerAccountId: accountInfo.accountId,
                providerAccountName: accountInfo.accountName,
                tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
            },
        });
        return { businessId };
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
            throw new common_1.ForbiddenException('Hanya Owner atau Admin yang dapat mengatur integrasi bisnis');
        }
    }
    sanitizeIntegration(integration) {
        const sanitized = { ...integration };
        delete sanitized.accessToken;
        delete sanitized.refreshToken;
        if (sanitized.provider === client_1.IntegrationProvider.PAKASIR && sanitized.config) {
            const config = sanitized.config;
            sanitized.config = {
                slug: config.slug,
                apiKey: config.apiKey ? `pk_****${crypto_1.CryptoUtil.decrypt(config.apiKey).slice(-4)}` : '',
            };
        }
        if (sanitized.provider === client_1.IntegrationProvider.GOOGLE_ANALYTICS && sanitized.config) {
            const config = sanitized.config;
            sanitized.config = {
                measurementId: config.measurementId,
                hasApiSecret: !!config.apiSecret,
            };
        }
        return sanitized;
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        instagram_provider_1.InstagramProvider,
        threads_provider_1.ThreadsProvider,
        pakasir_integration_provider_1.PakasirIntegrationProvider,
        google_analytics_provider_1.GoogleAnalyticsProvider])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map