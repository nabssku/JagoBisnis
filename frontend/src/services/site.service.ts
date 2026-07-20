import apiClient from './api-client';
import { Site, SiteTheme, Section } from '@/types/site';

export const siteService = {
  async getSite(businessId: string): Promise<Site> {
    const response = await apiClient.get(`/businesses/${businessId}/site`);
    return response.data;
  },

  async updateSite(businessId: string, data: Partial<Site>): Promise<Site> {
    const response = await apiClient.patch(`/businesses/${businessId}/site`, data);
    return response.data;
  },

  async updateTheme(businessId: string, theme: SiteTheme): Promise<Site> {
    const response = await apiClient.patch(`/businesses/${businessId}/site/theme`, { theme });
    return response.data;
  },

  async updateSections(businessId: string, sections: Section[]): Promise<Site> {
    const response = await apiClient.patch(`/businesses/${businessId}/site/sections`, { sections });
    return response.data;
  },

  async publish(businessId: string): Promise<Site> {
    const response = await apiClient.post(`/businesses/${businessId}/site/publish`);
    return response.data;
  },

  async unpublish(businessId: string): Promise<Site> {
    const response = await apiClient.post(`/businesses/${businessId}/site/unpublish`);
    return response.data;
  },

  async getPublicSite(slug: string): Promise<any> {
    const response = await apiClient.get(`/public/sites/${slug}`);
    return response.data;
  },

  async generateAiSite(businessId: string, data: {
    refinedPrompt: string;
  }): Promise<{ sections: Section[]; theme: SiteTheme }> {
    const response = await apiClient.post(`/businesses/${businessId}/site/ai-generate`, data);
    return response.data;
  },

  async refineAiPrompt(businessId: string, description: string): Promise<{ refinedPrompt: string }> {
    const response = await apiClient.post(`/businesses/${businessId}/site/ai-refine-prompt`, { description });
    return response.data;
  },
};
