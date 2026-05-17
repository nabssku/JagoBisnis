import apiClient from './api-client';
import { Product } from '@/types/product';
import { ProductDto } from '@/types/product-dto';

export const productService = {
  async create(businessId: string, data: ProductDto): Promise<Product> {
    const response = await apiClient.post<Product>(
      `/businesses/${businessId}/products`,
      data,
    );
    return response.data;
  },

  async getAll(businessId: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `/businesses/${businessId}/products`,
    );
    return response.data;
  },

  async getById(businessId: string, productId: string): Promise<Product> {
    const response = await apiClient.get<Product>(
      `/businesses/${businessId}/products/${productId}`,
    );
    return response.data;
  },

  async update(
    businessId: string,
    productId: string,
    data: Partial<ProductDto>,
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `/businesses/${businessId}/products/${productId}`,
      data,
    );
    return response.data;
  },

  async delete(businessId: string, productId: string): Promise<void> {
    await apiClient.delete(`/businesses/${businessId}/products/${productId}`);
  },

  async uploadImage(businessId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ url: string }>(
      `/businesses/${businessId}/products/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async getMedia(businessId: string): Promise<{ name: string; url: string }[]> {
    const response = await apiClient.get<any[]>(
      `/businesses/${businessId}/media`,
    );
    return response.data.map((item) => ({
      name: item.name,
      url: item.url,
    }));
  },
};
