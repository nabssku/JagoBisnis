import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, businessId: string, dto: CreateProductDto) {
    await this.checkPermission(userId, businessId);

    const slug = dto.slug || this.generateSlug(dto.name);

    const existingProduct = await this.prisma.product.findUnique({
      where: {
        businessId_slug: { businessId, slug },
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product slug already exists in this business');
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        slug,
        businessId,
      },
    });
  }

  async findAll(userId: string, businessId: string) {
    await this.checkAccess(userId, businessId);

    return this.prisma.product.findMany({
      where: {
        businessId,
        isActive: true, // Typically we only list active products by default
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, businessId: string, id: string) {
    await this.checkAccess(userId, businessId);

    const product = await this.prisma.product.findFirst({
      where: { id, businessId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    userId: string,
    businessId: string,
    id: string,
    dto: UpdateProductDto,
  ) {
    await this.checkPermission(userId, businessId);

    const product = await this.findOne(userId, businessId, id);

    if (dto.slug && dto.slug !== product.slug) {
      const existingProduct = await this.prisma.product.findUnique({
        where: {
          businessId_slug: { businessId, slug: dto.slug },
        },
      });
      if (existingProduct) {
        throw new ConflictException('Product slug already exists in this business');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, businessId: string, id: string) {
    await this.checkPermission(userId, businessId);
    await this.findOne(userId, businessId, id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async checkAccess(userId: string, businessId: string) {
    const businessUser = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    });

    if (!businessUser) {
      throw new ForbiddenException('You do not have access to this business');
    }

    return businessUser;
  }

  private async checkPermission(userId: string, businessId: string) {
    const businessUser = await this.checkAccess(userId, businessId);

    if (businessUser.role === Role.STAFF) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
