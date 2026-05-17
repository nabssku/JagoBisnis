import apiClient from './api-client';
import { Post } from '@/types/post';
import { CreatePostDto, UpdatePostDto } from '@/types/post-dto';

export const postService = {
  async create(businessId: string, data: CreatePostDto): Promise<Post> {
    const response = await apiClient.post<Post>(
      `/businesses/${businessId}/posts`,
      data,
    );
    return response.data;
  },

  async getAll(businessId: string): Promise<Post[]> {
    const response = await apiClient.get<Post[]>(
      `/businesses/${businessId}/posts`,
    );
    return response.data;
  },

  async getById(businessId: string, postId: string): Promise<Post> {
    const response = await apiClient.get<Post>(
      `/businesses/${businessId}/posts/${postId}`,
    );
    return response.data;
  },

  async update(
    businessId: string,
    postId: string,
    data: UpdatePostDto,
  ): Promise<Post> {
    const response = await apiClient.patch<Post>(
      `/businesses/${businessId}/posts/${postId}`,
      data,
    );
    return response.data;
  },

  async delete(businessId: string, postId: string): Promise<void> {
    await apiClient.delete(`/businesses/${businessId}/posts/${postId}`);
  },

  // --- Public Unauthenticated API requests ---

  async getPublicPosts(businessSlug: string): Promise<Post[]> {
    const response = await apiClient.get<Post[]>(
      `/public/sites/${businessSlug}/posts`,
    );
    return response.data;
  },

  async getPublicPostBySlug(businessSlug: string, postSlug: string): Promise<Post> {
    const response = await apiClient.get<Post>(
      `/public/sites/${businessSlug}/posts/${postSlug}`,
    );
    return response.data;
  },
};
