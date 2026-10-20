import apiClient from './api-client';

export interface AnalyticsSummary {
  totalViews: number;
  totalUniqueVisitors: number;
  totalOrdersCount: number;
  conversionRate: number;
  totalGtv: number;
}

export interface ChartDataPoint {
  date: string;
  views: number;
  visitors: number;
  orders: number;
  revenue: number;
}

export interface ReferrerInfo {
  referrer: string;
  count: number;
}

export interface ProductViewInfo {
  id: string;
  name: string;
  views: number;
}

export interface AnalyticsStatsResponse {
  summary: AnalyticsSummary;
  chartData: ChartDataPoint[];
  topReferrers: ReferrerInfo[];
  topProducts: ProductViewInfo[];
}

// --- Referrer Detail ---

export interface ReferrerDetailSummary {
  totalViews: number;
  uniqueVisitors: number;
}

export interface ReferrerDayPoint {
  date: string;
  views: number;
  visitors: number;
}

export interface TopPage {
  path: string;
  count: number;
}

export interface EventBreakdown {
  event: string;
  count: number;
}

export interface RecentHit {
  id: string;
  event: string;
  path: string;
  createdAt: string;
  userAgent: string | null;
}

export interface ReferrerDetailResponse {
  referrer: string;
  rangeDays: number;
  summary: ReferrerDetailSummary;
  chartData: ReferrerDayPoint[];
  topPages: TopPage[];
  eventBreakdown: EventBreakdown[];
  recentHits: RecentHit[];
}

export const analyticsService = {
  logEvent: async (
    businessId: string,
    event: string,
    path: string,
    metadata?: any,
  ) => {
    try {
      const referrer = typeof document !== 'undefined' ? document.referrer : '';
      const response = await apiClient.post(`/analytics/${businessId}/log`, {
        event,
        path,
        referrer,
        metadata,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to log analytics event:', error);
      return null;
    }
  },

  getStats: async (businessId: string, rangeDays = 30): Promise<AnalyticsStatsResponse> => {
    const response = await apiClient.get<AnalyticsStatsResponse>(
      `/businesses/${businessId}/analytics/stats`,
      {
        params: { range: rangeDays },
      },
    );
    return response.data;
  },

  getReferrerDetail: async (
    businessId: string,
    referrer: string,
    rangeDays = 30,
  ): Promise<ReferrerDetailResponse> => {
    const response = await apiClient.get<ReferrerDetailResponse>(
      `/businesses/${businessId}/analytics/referrer-detail`,
      {
        params: { referrer, range: rangeDays },
      },
    );
    return response.data;
  },
};
