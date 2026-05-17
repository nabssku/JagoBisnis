import apiClient from './api-client';
import { Business } from '@/types/business';
import { BusinessDto } from '@/types/business-dto';

export const businessService = {
  async create(data: BusinessDto): Promise<Business> {
    const response = await apiClient.post<Business>('/businesses', data);
    return response.data;
  },

  async getAll(): Promise<Business[]> {
    const response = await apiClient.get<Business[]>('/businesses');
    return response.data;
  },

  async getById(id: string): Promise<Business> {
    const response = await apiClient.get<Business>(`/businesses/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<BusinessDto>): Promise<Business> {
    const response = await apiClient.patch<Business>(`/businesses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/businesses/${id}`);
  },
};
