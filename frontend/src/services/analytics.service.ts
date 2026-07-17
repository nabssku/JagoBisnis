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
};
