import apiClient from './api-client';

export interface CreateOrderDto {
  productId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  paymentMethod: 'MANUAL' | 'PAKASIR';
  paymentChannel?: string;
}

export const orderService = {
  async createOrder(slug: string, dto: CreateOrderDto): Promise<any> {
    const response = await apiClient.post(`/public/sites/${slug}/orders`, dto);
    return response.data;
  },

  async getOrder(slug: string, orderId: string): Promise<any> {
    const response = await apiClient.get(`/public/orders/${orderId}/status`);
    return response.data;
  },

  async getMerchantOrders(businessId: string): Promise<any> {
    const response = await apiClient.get(`/businesses/${businessId}/orders`);
    return response.data;
  },

  async updateOrderStatus(
    businessId: string,
    orderId: string,
    status: { orderStatus?: string; paymentStatus?: string }
  ): Promise<any> {
    const response = await apiClient.patch(`/businesses/${businessId}/orders/${orderId}/status`, status);
    return response.data;
  },
};
