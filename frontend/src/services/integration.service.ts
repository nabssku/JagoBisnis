import apiClient from './api-client';

export interface Integration {
  id: string;
  businessId: string;
  provider: 'INSTAGRAM' | 'THREADS' | 'PAKASIR' | 'GOOGLE_ANALYTICS';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  providerAccountId?: string;
  providerAccountName?: string;
  config?: any;
  tokenExpiresAt?: string;
}

export const integrationService = {
  async getAll(businessId: string): Promise<Integration[]> {
    const response = await apiClient.get<Integration[]>(`/businesses/${businessId}/integrations`);
    return response.data;
  },

  async disconnect(businessId: string, provider: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/businesses/${businessId}/integrations/${provider}`
    );
    return response.data;
  },

  async connectPakasir(
    businessId: string,
    data: { slug: string; apiKey: string }
  ): Promise<Integration> {
    const response = await apiClient.post<Integration>(
      `/businesses/${businessId}/integrations/pakasir`,
      data
    );
    return response.data;
  },

  async testPakasir(
    businessId: string,
    data: { slug: string; apiKey: string }
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/businesses/${businessId}/integrations/pakasir/test`,
      data
    );
    return response.data;
  },

  async connectGoogleAnalytics(
    businessId: string,
    data: { measurementId: string; apiSecret?: string }
  ): Promise<Integration> {
    const response = await apiClient.post<Integration>(
      `/businesses/${businessId}/integrations/google-analytics`,
      data
    );
    return response.data;
  },

  async testGoogleAnalytics(
    businessId: string,
    data: { measurementId: string; apiSecret?: string }
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/businesses/${businessId}/integrations/google-analytics/test`,
      data
    );
    return response.data;
  },

  async getInstagramConnectUrl(businessId: string): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>(
      `/businesses/${businessId}/integrations/instagram/connect`
    );
    return response.data;
  },

  async getThreadsConnectUrl(businessId: string): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>(
      `/businesses/${businessId}/integrations/threads/connect`
    );
    return response.data;
  },
};
