import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBusinessDto) {
    const userBusinessesCount = await this.prisma.businessUser.count({
      where: { userId },
    });

    if (userBusinessesCount >= 1) {
      throw new ConflictException(
        'Maksimal 1 akun hanya boleh memiliki 1 profil bisnis.',
      );
    }

    const slug = dto.slug || this.generateSlug(dto.name);

    const existingBusiness = await this.prisma.business.findUnique({
      where: { slug },
    });

    if (existingBusiness) {
      throw new ConflictException('Slug already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          logoUrl: dto.logoUrl,
          category: dto.category,
          phone: dto.phone,
          address: dto.address,
        },
      });

      await tx.businessUser.create({
        data: {
          userId,
          businessId: business.id,
          role: Role.OWNER,
        },
      });

      return business;
    });
  }

  async findAll(userId: string) {
    return this.prisma.business.findMany({
      where: {
        BusinessUser: {
          some: { userId },
        },
      },
      include: {
        BusinessUser: {
          where: { userId },
          select: { role: true },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const business = await this.prisma.business.findFirst({
      where: {
        id,
        BusinessUser: {
          some: { userId },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found or access denied');
    }

    return business;
  }

  async update(userId: string, id: string, dto: UpdateBusinessDto) {
    await this.checkPermission(userId, id);

    if (dto.slug) {
      const existingBusiness = await this.prisma.business.findFirst({
        where: {
          slug: dto.slug,
          id: { not: id },
        },
      });
      if (existingBusiness) {
        throw new ConflictException('Slug already exists');
      }
    }

    return this.prisma.business.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.checkPermission(userId, id, true); // Only OWNER can delete? Or ADMIN too? User said OWNER/ADMIN.

    return this.prisma.$transaction(async (tx) => {
      await tx.businessUser.deleteMany({
        where: { businessId: id },
      });
      return tx.business.delete({
        where: { id },
      });
    });
  }

  private async checkPermission(
    userId: string,
    businessId: string,
    strict = false,
  ) {
    const businessUser = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    });

    if (!businessUser) {
      throw new NotFoundException('Business not found or access denied');
    }

    const allowedRoles: Role[] = strict
      ? [Role.OWNER]
      : [Role.OWNER, Role.ADMIN];

    if (!allowedRoles.includes(businessUser.role)) {
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
