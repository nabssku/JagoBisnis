import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConnectPakasirDto } from './dto/connect-pakasir.dto';
import { ConnectGoogleAnalyticsDto } from './dto/connect-google-analytics.dto';
import { CryptoUtil } from '../utils/crypto';
import { InstagramProvider } from './providers/instagram.provider';
import { ThreadsProvider } from './providers/threads.provider';
import { PakasirIntegrationProvider } from './providers/pakasir-integration.provider';
import { GoogleAnalyticsProvider } from './providers/google-analytics.provider';
import { IntegrationProvider, IntegrationStatus, Role } from '@prisma/client';

@Injectable()
export class IntegrationService {
  constructor(
    private prisma: PrismaService,
    private instagramProvider: InstagramProvider,
    private threadsProvider: ThreadsProvider,
    private pakasirProvider: PakasirIntegrationProvider,
    private gaProvider: GoogleAnalyticsProvider,
  ) {}

  async findAll(userId: string, businessId: string) {
    await this.checkAccess(userId, businessId);

    const integrations = await this.prisma.integration.findMany({
      where: { businessId },
    });

    // Strip sensitive fields (like plain keys, tokens, secrets) before sending response
    return integrations.map((integration) => this.sanitizeIntegration(integration));
  }

  async findOne(userId: string, businessId: string, provider: IntegrationProvider) {
    await this.checkAccess(userId, businessId);

    const integration = await this.prisma.integration.findFirst({
      where: { businessId, provider },
    });

    if (!integration) {
      throw new NotFoundException(`Integration with provider ${provider} not found`);
    }

    return this.sanitizeIntegration(integration);
  }

  async connectPakasir(userId: string, businessId: string, dto: ConnectPakasirDto) {
    await this.checkPermission(userId, businessId);

    // 1. Test the connection first
    await this.pakasirProvider.testConnection(dto.slug, dto.apiKey);

    // 2. Encrypt sensitive apiKey
    const encryptedApiKey = CryptoUtil.encrypt(dto.apiKey);

    // 3. Save or update database record
    const integration = await this.prisma.integration.upsert({
      where: {
        businessId_provider: {
          businessId,
          provider: IntegrationProvider.PAKASIR,
        },
      },
      update: {
        status: IntegrationStatus.CONNECTED,
        config: {
          slug: dto.slug,
          apiKey: encryptedApiKey,
        },
      },
      create: {
        businessId,
        provider: IntegrationProvider.PAKASIR,
        status: IntegrationStatus.CONNECTED,
        config: {
          slug: dto.slug,
          apiKey: encryptedApiKey,
        },
      },
    });

    return this.sanitizeIntegration(integration);
  }

  async testPakasir(userId: string, businessId: string, dto: ConnectPakasirDto) {
    await this.checkAccess(userId, businessId);
    
    let keyToTest = dto.apiKey;
    // If the input is masked, try to read the existing configured key
    if (dto.apiKey.startsWith('pk_****')) {
      const existing = await this.prisma.integration.findUnique({
        where: {
          businessId_provider: {
            businessId,
            provider: IntegrationProvider.PAKASIR,
          },
        },
      });
      if (!existing || !existing.config) {
        throw new BadRequestException('No existing configured API key found');
      }
      const config = existing.config as any;
      if (config.apiKey) {
        keyToTest = CryptoUtil.decrypt(config.apiKey);
      }
    }

    return {
      success: await this.pakasirProvider.testConnection(dto.slug, keyToTest),
      message: 'Koneksi ke Pakasir berhasil!',
    };
  }

  async connectGoogleAnalytics(userId: string, businessId: string, dto: ConnectGoogleAnalyticsDto) {
    await this.checkPermission(userId, businessId);

    // 1. Validate configuration format
    await this.gaProvider.testConnection(dto.measurementId, dto.apiSecret);

    // 2. Encrypt apiSecret if provided
    const encryptedApiSecret = dto.apiSecret ? CryptoUtil.encrypt(dto.apiSecret) : undefined;

    // 3. Save/Update record
    const integration = await this.prisma.integration.upsert({
      where: {
        businessId_provider: {
          businessId,
          provider: IntegrationProvider.GOOGLE_ANALYTICS,
        },
      },
      update: {
        status: IntegrationStatus.CONNECTED,
        config: {
          measurementId: dto.measurementId,
          apiSecret: encryptedApiSecret,
        },
      },
      create: {
        businessId,
        provider: IntegrationProvider.GOOGLE_ANALYTICS,
        status: IntegrationStatus.CONNECTED,
        config: {
          measurementId: dto.measurementId,
          apiSecret: encryptedApiSecret,
        },
      },
    });

    return this.sanitizeIntegration(integration);
  }

  async testGoogleAnalytics(userId: string, businessId: string, dto: ConnectGoogleAnalyticsDto) {
    await this.checkAccess(userId, businessId);
    
    let secretToTest = dto.apiSecret;
    if (dto.apiSecret && dto.apiSecret.startsWith('****')) {
      const existing = await this.prisma.integration.findUnique({
        where: {
          businessId_provider: {
            businessId,
            provider: IntegrationProvider.GOOGLE_ANALYTICS,
          },
        },
      });
      if (existing && existing.config) {
        const config = existing.config as any;
        if (config.apiSecret) {
          secretToTest = CryptoUtil.decrypt(config.apiSecret);
        }
      }
    }

    return {
      success: await this.gaProvider.testConnection(dto.measurementId, secretToTest),
      message: 'Koneksi ke Google Analytics berhasil!',
    };
  }

  async disconnect(userId: string, businessId: string, provider: IntegrationProvider) {
    await this.checkPermission(userId, businessId);

    const existing = await this.prisma.integration.findUnique({
      where: {
        businessId_provider: { businessId, provider },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Integration with provider ${provider} is not connected`);
    }

    // Completely remove the credentials/tokens from the database for highest security
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

  // --- Instagram OAuth handlers ---

  async getInstagramConnectUrl(userId: string, businessId: string): Promise<{ url: string }> {
    await this.checkPermission(userId, businessId);
    const url = this.instagramProvider.getConnectUrl(businessId);
    return { url };
  }

  async handleInstagramCallback(code: string, state: string) {
    let businessId: string;
    try {
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      businessId = decodedState.businessId;
    } catch (e) {
      throw new BadRequestException('State token is invalid or corrupted');
    }

    if (!businessId) {
      throw new BadRequestException('Business ID was not supplied in the state token');
    }

    // 1. Exchange OAuth code for Meta Access Token
    const tokenData = await this.instagramProvider.exchangeCodeForToken(code);

    // 2. Fetch professional account details
    const accountInfo = await this.instagramProvider.getAccountInfo(tokenData.accessToken);

    // 3. Encrypt access token
    const encryptedToken = CryptoUtil.encrypt(tokenData.accessToken);

    // 4. Save/Update integration record
    await this.prisma.integration.upsert({
      where: {
        businessId_provider: {
          businessId,
          provider: IntegrationProvider.INSTAGRAM,
        },
      },
      update: {
        status: IntegrationStatus.CONNECTED,
        accessToken: encryptedToken,
        providerAccountId: accountInfo.accountId,
        providerAccountName: accountInfo.accountName,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
      },
      create: {
        businessId,
        provider: IntegrationProvider.INSTAGRAM,
        status: IntegrationStatus.CONNECTED,
        accessToken: encryptedToken,
        providerAccountId: accountInfo.accountId,
        providerAccountName: accountInfo.accountName,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
      },
    });

    return { businessId };
  }

  // --- Threads OAuth handlers ---

  async getThreadsConnectUrl(userId: string, businessId: string): Promise<{ url: string }> {
    await this.checkPermission(userId, businessId);
    const url = this.threadsProvider.getConnectUrl(businessId);
    return { url };
  }

  async handleThreadsCallback(code: string, state: string) {
    let businessId: string;
    try {
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      businessId = decodedState.businessId;
    } catch (e) {
      throw new BadRequestException('State token is invalid or corrupted');
    }

    if (!businessId) {
      throw new BadRequestException('Business ID was not supplied in the state token');
    }

    // 1. Exchange code
    const tokenData = await this.threadsProvider.exchangeCodeForToken(code);

    // 2. Get account profile details
    const accountInfo = await this.threadsProvider.getAccountInfo(tokenData.accessToken);

    // 3. Encrypt token
    const encryptedToken = CryptoUtil.encrypt(tokenData.accessToken);

    // 4. Save record
    await this.prisma.integration.upsert({
      where: {
        businessId_provider: {
          businessId,
          provider: IntegrationProvider.THREADS,
        },
      },
      update: {
        status: IntegrationStatus.CONNECTED,
        accessToken: encryptedToken,
        providerAccountId: accountInfo.accountId,
        providerAccountName: accountInfo.accountName,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
      },
      create: {
        businessId,
        provider: IntegrationProvider.THREADS,
        status: IntegrationStatus.CONNECTED,
        accessToken: encryptedToken,
        providerAccountId: accountInfo.accountId,
        providerAccountName: accountInfo.accountName,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
      },
    });

    return { businessId };
  }

  // --- Helper Methods ---

  private async checkAccess(userId: string, businessId: string) {
    const businessUser = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    });

    if (!businessUser) {
      throw new ForbiddenException('Anda tidak memiliki akses ke bisnis ini');
    }

    return businessUser;
  }

  private async checkPermission(userId: string, businessId: string) {
    const businessUser = await this.checkAccess(userId, businessId);

    if (businessUser.role !== Role.OWNER && businessUser.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Hanya Owner atau Admin yang dapat mengatur integrasi bisnis',
      );
    }
  }

  private sanitizeIntegration(integration: any) {
    const sanitized = { ...integration };

    // Strip high-level encrypted keys/tokens completely from response payload
    delete sanitized.accessToken;
    delete sanitized.refreshToken;

    if (sanitized.provider === IntegrationProvider.PAKASIR && sanitized.config) {
      const config = sanitized.config as any;
      sanitized.config = {
        slug: config.slug,
        // Expose only masked API key
        apiKey: config.apiKey ? `pk_****${CryptoUtil.decrypt(config.apiKey).slice(-4)}` : '',
      };
    }

    if (sanitized.provider === IntegrationProvider.GOOGLE_ANALYTICS && sanitized.config) {
      const config = sanitized.config as any;
      sanitized.config = {
        measurementId: config.measurementId,
        // Inform frontend if secret exists but do not expose it
        hasApiSecret: !!config.apiSecret,
      };
    }

    return sanitized;
  }
}
