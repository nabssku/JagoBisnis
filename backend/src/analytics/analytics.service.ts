import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LogEventDto } from './dto/log-event.dto';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateIpHash(ip: string): string {
    const salt = 'jago_bisnis_analytics_salt_2026';
    return crypto
      .createHash('sha256')
      .update((ip || 'unknown_ip') + salt)
      .digest('hex');
  }

  async logEvent(
    businessId: string,
    ip: string,
    userAgent: string,
    dto: LogEventDto,
  ) {
    // Verify business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const ipHash = this.generateIpHash(ip);

    return this.prisma.analyticsLog.create({
      data: {
        businessId,
        event: dto.event,
        path: dto.path,
        referrer: dto.referrer || null,
        userAgent: userAgent || null,
        ipHash,
        metadata: dto.metadata || {},
      },
    });
  }

  async getStats(businessId: string, rangeDays = 30) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays);
    startDate.setHours(0, 0, 0, 0);

    // 1. Fetch all analytics logs in the range
    const logs = await this.prisma.analyticsLog.findMany({
      where: {
        businessId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // 2. Fetch all orders in the range
    const orders = await this.prisma.order.findMany({
      where: {
        businessId,
        createdAt: { gte: startDate },
      },
    });

    // 3. Process logs in memory
    const totalViews = logs.length;
    
    // Unique visitors (set of unique ipHash)
    const uniqueVisitorHashes = new Set(logs.map(log => log.ipHash));
    const totalUniqueVisitors = uniqueVisitorHashes.size;

    // Direct conversions
    const totalOrdersCount = orders.length;
    const conversionRate = totalUniqueVisitors > 0 
      ? parseFloat(((totalOrdersCount / totalUniqueVisitors) * 100).toFixed(2))
      : 0;

    // Gross Transaction Value (GTV) aggregation
    const totalGtv = orders.reduce((sum, order) => sum + order.subtotal, 0);

    // 4. Generate daily chart data
    const dailyDataMap = new Map<string, { views: number; visitors: Set<string>; orders: number; revenue: number }>();
    
    // Initialize last N days map to ensure no empty gaps
    for (let i = 0; i <= rangeDays; i++) {
      const d = new Date();
      d.setDate(d.getDate() - rangeDays + i);
      const dateStr = d.toISOString().split('T')[0];
      dailyDataMap.set(dateStr, { views: 0, visitors: new Set(), orders: 0, revenue: 0 });
    }

    // Populate daily views/visitors
    for (const log of logs) {
      const dateStr = log.createdAt.toISOString().split('T')[0];
      if (dailyDataMap.has(dateStr)) {
        const entry = dailyDataMap.get(dateStr)!;
        entry.views += 1;
        if (log.ipHash) entry.visitors.add(log.ipHash);
      }
    }

    // Populate daily orders/revenue
    for (const order of orders) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dailyDataMap.has(dateStr)) {
        const entry = dailyDataMap.get(dateStr)!;
        entry.orders += 1;
        entry.revenue += order.subtotal;
      }
    }

    const chartData = Array.from(dailyDataMap.entries()).map(([date, val]) => ({
      date,
      views: val.views,
      visitors: val.visitors.size,
      orders: val.orders,
      revenue: val.revenue,
    }));

    // 5. Top referral sources
    const referrerCounts: Record<string, number> = {};
    for (const log of logs) {
      if (log.referrer) {
        let domain = log.referrer;
        try {
          // clean up to domain name if it is url
          if (domain.startsWith('http://') || domain.startsWith('https://')) {
            domain = new URL(domain).hostname;
          }
        } catch (_) {}
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
      } else {
        referrerCounts['Langsung / Sosial'] = (referrerCounts['Langsung / Sosial'] || 0) + 1;
      }
    }
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6. Top viewed products
    const productViews: Record<string, { name: string; views: number }> = {};
    for (const log of logs) {
      if (log.event === 'VIEW_PRODUCT' && log.metadata) {
        const meta = log.metadata as any;
        const productId = meta.productId;
        const productName = meta.productName || 'Produk Tidak Dikenal';
        if (productId) {
          if (!productViews[productId]) {
            productViews[productId] = { name: productName, views: 0 };
          }
          productViews[productId].views += 1;
        }
      }
    }
    const topProducts = Object.entries(productViews)
      .map(([id, val]) => ({ id, name: val.name, views: val.views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      summary: {
        totalViews,
        totalUniqueVisitors,
        totalOrdersCount,
        conversionRate,
        totalGtv,
      },
      chartData,
      topReferrers,
      topProducts,
    };
  }
}
