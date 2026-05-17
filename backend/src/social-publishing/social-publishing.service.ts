import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { CryptoUtil } from '../utils/crypto';
import { InstagramProvider } from '../integration/providers/instagram.provider';
import { ThreadsProvider } from '../integration/providers/threads.provider';
import {
  SocialPostProvider,
  SocialPostStatus,
  IntegrationProvider,
  IntegrationStatus,
  MediaType,
  Role,
} from '@prisma/client';

@Injectable()
export class SocialPublishingService {
  constructor(
    private prisma: PrismaService,
    private instagramProvider: InstagramProvider,
    private threadsProvider: ThreadsProvider,
  ) {}

  async create(userId: string, businessId: string, dto: CreateSocialPostDto) {
    await this.checkAccess(userId, businessId);

    // 1. Social platform specific validations
    this.validateSocialRules(dto);

    // 2. Verify there is an active connected integration for the selected provider
    const integrationProvider = this.mapToIntegrationProvider(dto.provider);
    const integration = await this.prisma.integration.findUnique({
      where: {
        businessId_provider: {
          businessId,
          provider: integrationProvider,
        },
      },
    });

    if (!integration || integration.status !== IntegrationStatus.CONNECTED) {
      throw new BadRequestException(
        `Integrasi untuk ${dto.provider} belum aktif. Harap hubungkan akun Anda terlebih dahulu di pengaturan Integrasi.`,
      );
    }

    // 3. Save post draft
    return this.prisma.socialPost.create({
      data: {
        businessId,
        provider: dto.provider,
        integrationId: integration.id,
        content: dto.content,
        mediaType: dto.mediaType || MediaType.TEXT,
        mediaUrls: dto.mediaUrls ? JSON.stringify(dto.mediaUrls) : '[]',
        status: SocialPostStatus.DRAFT,
      },
    });
  }

  async findAll(userId: string, businessId: string) {
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

  async findOne(userId: string, businessId: string, id: string) {
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
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    return post;
  }

  async remove(userId: string, businessId: string, id: string) {
    await this.checkPermission(userId, businessId);
    
    const post = await this.findOne(userId, businessId, id);
    if (post.status === SocialPostStatus.PUBLISHED || post.status === SocialPostStatus.PUBLISHING) {
      throw new BadRequestException('Postingan yang sedang dipublikasikan tidak dapat dihapus');
    }

    return this.prisma.socialPost.delete({
      where: { id },
    });
  }

  async publish(userId: string, businessId: string, id: string) {
    // Only OWNER or ADMIN are allowed to publish posts
    await this.checkPermission(userId, businessId);

    const post = await this.prisma.socialPost.findFirst({
      where: { id, businessId },
      include: { integration: true },
    });

    if (!post) {
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    if (post.status === SocialPostStatus.PUBLISHED) {
      throw new BadRequestException('Postingan ini sudah sukses terpublikasi');
    }

    const integration = post.integration;
    if (!integration || integration.status !== IntegrationStatus.CONNECTED || !integration.accessToken) {
      throw new BadRequestException(
        'Integrasi media sosial untuk postingan ini terputus atau tidak valid.',
      );
    }

    // 1. Set status to PUBLISHING in the database
    await this.prisma.socialPost.update({
      where: { id },
      data: { status: SocialPostStatus.PUBLISHING, errorMessage: null },
    });

    // 2. Decrypt the access token
    const accessToken = CryptoUtil.decrypt(integration.accessToken);
    const mediaUrlsList: string[] = JSON.parse((post.mediaUrls as string) || '[]');

    try {
      let providerPostId = '';

      if (post.provider === SocialPostProvider.INSTAGRAM) {
        if (!mediaUrlsList || mediaUrlsList.length === 0) {
          throw new Error('Instagram publishing requires a media URL');
        }
        // Call the Meta Content Publishing API
        providerPostId = await this.instagramProvider.publish(
          accessToken,
          integration.providerAccountId || '',
          post.content,
          mediaUrlsList[0],
        );
      } else if (post.provider === SocialPostProvider.THREADS) {
        // Threads supports text-only or image publishing
        const imageToPublish = mediaUrlsList.length > 0 ? mediaUrlsList[0] : undefined;
        providerPostId = await this.threadsProvider.publish(
          accessToken,
          integration.providerAccountId || '',
          post.content,
          imageToPublish,
        );
      }

      // 3. Mark as successfully published
      return this.prisma.socialPost.update({
        where: { id },
        data: {
          status: SocialPostStatus.PUBLISHED,
          providerPostId,
          publishedAt: new Date(),
        },
      });
    } catch (error) {
      // 4. Mark as FAILED and record error message
      return this.prisma.socialPost.update({
        where: { id },
        data: {
          status: SocialPostStatus.FAILED,
          errorMessage: error.message || 'Penerbitan postingan sosial gagal.',
        },
      });
    }
  }

  // --- Helper Validation and Permission Checks ---

  private validateSocialRules(dto: CreateSocialPostDto) {
    if (dto.provider === SocialPostProvider.INSTAGRAM) {
      if (dto.mediaType === MediaType.TEXT) {
        throw new BadRequestException(
          'Instagram tidak mendukung postingan berupa teks saja. Harap sertakan media gambar/video.',
        );
      }
      if (!dto.mediaUrls || dto.mediaUrls.length === 0) {
        throw new BadRequestException(
          'Instagram mewajibkan minimal satu media gambar atau video untuk dipublikasikan.',
        );
      }
    }
  }

  private mapToIntegrationProvider(provider: SocialPostProvider): IntegrationProvider {
    if (provider === SocialPostProvider.INSTAGRAM) return IntegrationProvider.INSTAGRAM;
    if (provider === SocialPostProvider.THREADS) return IntegrationProvider.THREADS;
    throw new BadRequestException('Platform sosial tidak dikenali');
  }

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
        'Hanya Owner atau Admin yang memiliki izin untuk mempublikasikan postingan',
      );
    }
  }
}
