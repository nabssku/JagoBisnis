import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const [totalUsers, totalBusinesses, totalProducts, totalOrders] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.business.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
      ]);

    // Calculate total GTV (Gross Transaction Value) from orders
    const completedOrders = await this.prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
      },
      select: {
        subtotal: true,
      },
    });

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.subtotal,
      0,
    );

    // Fetch lists for quick overview cards
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

  async updateUserRole(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
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
      const owner =
        b.BusinessUser.find((bu) => bu.role === 'OWNER')?.user || null;
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

  async deleteBusiness(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Bisnis tidak ditemukan');
    }

    // Safely delete relations using a transaction
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
}
