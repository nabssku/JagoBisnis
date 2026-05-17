import apiClient from './api-client';

export interface SocialPost {
  id: string;
  businessId: string;
  provider: 'INSTAGRAM' | 'THREADS';
  content: string;
  mediaType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  mediaUrls: string; // JSON string in DB
  status: 'DRAFT' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  providerPostId?: string;
  errorMessage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  integration?: {
    providerAccountId?: string;
    providerAccountName?: string;
  };
}

export interface CreateSocialPostDto {
  provider: 'INSTAGRAM' | 'THREADS';
  content: string;
  mediaType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  mediaUrls?: string[];
}

export const socialPublishingService = {
  async getAll(businessId: string): Promise<SocialPost[]> {
    const response = await apiClient.get<SocialPost[]>(`/businesses/${businessId}/social-posts`);
    return response.data;
  },

  async getById(businessId: string, postId: string): Promise<SocialPost> {
    const response = await apiClient.get<SocialPost>(`/businesses/${businessId}/social-posts/${postId}`);
    return response.data;
  },

  async create(businessId: string, data: CreateSocialPostDto): Promise<SocialPost> {
    const response = await apiClient.post<SocialPost>(`/businesses/${businessId}/social-posts`, data);
    return response.data;
  },

  async delete(businessId: string, postId: string): Promise<void> {
    await apiClient.delete(`/businesses/${businessId}/social-posts/${postId}`);
  },

  async publish(businessId: string, postId: string): Promise<SocialPost> {
    const response = await apiClient.post<SocialPost>(`/businesses/${businessId}/social-posts/${postId}/publish`);
    return response.data;
  },
};
