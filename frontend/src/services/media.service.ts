import apiClient from './api-client';

export interface MediaAsset {
  id: string;
  businessId: string;
  uploadedById: string;
  url: string;
  filename: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
  uploadedBy?: {
    id: string;
    name: string;
    email?: string;
  };
}

export const mediaService = {
  /**
   * Fetch all media items for a business
   */
  async getAll(businessId: string): Promise<MediaAsset[]> {
    const response = await apiClient.get<MediaAsset[]>(
      `/businesses/${businessId}/media`,
    );
    return response.data;
  },

  /**
   * Upload a new media item (image or video, max 50MB)
   */
  async upload(businessId: string, file: File): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<MediaAsset>(
      `/businesses/${businessId}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  /**
   * Delete a media item by ID
   */
  async delete(businessId: string, mediaId: string): Promise<void> {
    await apiClient.delete(`/businesses/${businessId}/media/${mediaId}`);
  },
};
export default mediaService;
