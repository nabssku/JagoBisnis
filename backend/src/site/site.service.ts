import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Role } from '@prisma/client';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultTheme = {
    primaryColor: '#16a34a',
    font: 'Inter',
    backgroundColor: '#ffffff',
    textColor: '#111827',
  };

  private readonly defaultSections = [
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

  async getByBusinessId(businessId: string, userId: string) {
    await this.checkMembership(businessId, userId);

    let site = await this.prisma.site.findUnique({
      where: { businessId },
    });

    if (!site) {
      // Auto-create default site
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
      });

      if (!business) {
        throw new NotFoundException('Bisnis tidak ditemukan');
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

  async create(businessId: string, userId: string, dto: CreateSiteDto) {
    await this.checkPermission(businessId, userId);

    const existingSite = await this.prisma.site.findUnique({
      where: { businessId },
    });

    if (existingSite) {
      throw new ConflictException('Bisnis sudah memiliki website');
    }

    const slugExists = await this.prisma.site.findUnique({
      where: { slug: dto.slug },
    });

    if (slugExists) {
      throw new ConflictException('Slug website sudah digunakan');
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

  async update(businessId: string, userId: string, dto: UpdateSiteDto) {
    await this.checkPermission(businessId, userId);

    const site = await this.prisma.site.findUnique({
      where: { businessId },
    });

    if (!site) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    if (dto.slug && dto.slug !== site.slug) {
      const slugExists = await this.prisma.site.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException('Slug website sudah digunakan');
      }
    }

    return this.prisma.site.update({
      where: { businessId },
      data: dto,
    });
  }

  async updateTheme(businessId: string, userId: string, theme: any) {
    await this.checkPermission(businessId, userId);
    return this.prisma.site.update({
      where: { businessId },
      data: { theme },
    });
  }

  async updateSections(businessId: string, userId: string, sections: any[]) {
    await this.checkPermission(businessId, userId);

    // Validation: ensure sections have id, type, order, content
    sections.forEach((section, index) => {
      if (!section.id || !section.type || !section.order || !section.content) {
        throw new BadRequestException(`Section index ${index} tidak valid`);
      }
    });

    return this.prisma.site.update({
      where: { businessId },
      data: { sections },
    });
  }

  async publish(businessId: string, userId: string) {
    await this.checkPermission(businessId, userId);
    return this.prisma.site.update({
      where: { businessId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(businessId: string, userId: string) {
    await this.checkPermission(businessId, userId);
    return this.prisma.site.update({
      where: { businessId },
      data: {
        isPublished: false,
      },
    });
  }

  async getPublicSite(slug: string) {
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
      throw new NotFoundException(
        'Website tidak ditemukan atau belum dipublikasikan',
      );
    }

    // Fetch active integrations for the business
    const integrationsList = await this.prisma.integration.findMany({
      where: {
        businessId: site.businessId,
        status: 'CONNECTED',
      },
    });

    const isPakasirConnected = integrationsList.some(
      (integration) => integration.provider === 'PAKASIR',
    );

    const gaIntegration = integrationsList.find(
      (integration) => integration.provider === 'GOOGLE_ANALYTICS',
    );

    const measurementId =
      gaIntegration && gaIntegration.config
        ? (gaIntegration.config as any).measurementId
        : '';

    return {
      ...site,
      integrations: {
        pakasir: {
          connected: isPakasirConnected,
        },
        googleAnalytics: {
          measurementId: measurementId || '',
        },
      },
    };
  }

  private async checkMembership(businessId: string, userId: string) {
    const membership = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Anda tidak memiliki akses ke bisnis ini');
    }
    return membership;
  }

  private async checkPermission(businessId: string, userId: string) {
    const membership = await this.checkMembership(businessId, userId);

    if (membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Hanya OWNER atau ADMIN yang dapat mengubah website',
      );
    }
  }
}
