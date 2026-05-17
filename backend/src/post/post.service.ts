import { 
  ConflictException, 
  ForbiddenException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, businessId: string, dto: CreatePostDto) {
    await this.checkPermission(userId, businessId);

    const slug = dto.slug || this.generateSlug(dto.title);

    const existingPost = await this.prisma.post.findUnique({
      where: {
        businessId_slug: { businessId, slug },
      },
    });

    if (existingPost) {
      throw new ConflictException('Post slug already exists in this business');
    }

    return this.prisma.post.create({
      data: {
        ...dto,
        slug,
        businessId,
      },
    });
  }

  async findAll(userId: string, businessId: string) {
    await this.checkAccess(userId, businessId);

    return this.prisma.post.findMany({
      where: {
        businessId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, businessId: string, id: string) {
    await this.checkAccess(userId, businessId);

    const post = await this.prisma.post.findFirst({
      where: { id, businessId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    userId: string,
    businessId: string,
    id: string,
    dto: UpdatePostDto,
  ) {
    await this.checkPermission(userId, businessId);

    const post = await this.findOne(userId, businessId, id);

    if (dto.slug && dto.slug !== post.slug) {
      const existingPost = await this.prisma.post.findUnique({
        where: {
          businessId_slug: { businessId, slug: dto.slug },
        },
      });
      if (existingPost) {
        throw new ConflictException('Post slug already exists in this business');
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, businessId: string, id: string) {
    await this.checkPermission(userId, businessId);
    await this.findOne(userId, businessId, id);

    return this.prisma.post.delete({
      where: { id },
    });
  }

  // --- Public Access Methods ---

  async findPublicPosts(businessSlug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug: businessSlug },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.post.findMany({
      where: {
        businessId: business.id,
        status: 'Publik',
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
    });
  }

  async findPublicPostBySlug(businessSlug: string, postSlug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug: businessSlug },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const post = await this.prisma.post.findFirst({
      where: {
        businessId: business.id,
        slug: postSlug,
        status: 'Publik',
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment views count atomically
    return this.prisma.post.update({
      where: { id: post.id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  // --- Helper Methods ---

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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
