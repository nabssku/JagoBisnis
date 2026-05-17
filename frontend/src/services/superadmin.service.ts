import apiClient from './api-client';

export interface SuperAdminStats {
  totalUsers: number;
  totalBusinesses: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  recentBusinesses: Array<{
    id: string;
    name: string;
    slug: string;
    category: string;
    createdAt: string;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    subtotal: number;
    paymentStatus: string;
    createdAt: string;
    business: {
      name: string;
      slug: string;
    };
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  BusinessUser: Array<{
    business: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface AdminBusiness {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  productsCount: number;
  ordersCount: number;
  owner: {
    name: string;
    email: string;
  } | null;
}

export const superAdminService = {
  async getStats(): Promise<SuperAdminStats> {
    const response = await apiClient.get<SuperAdminStats>('/superadmin/stats');
    return response.data;
  },

  async getUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminUser[]>('/superadmin/users');
    return response.data;
  },

  async updateUserRole(userId: string, role: string): Promise<any> {
    const response = await apiClient.put(`/superadmin/users/${userId}/role`, { role });
    return response.data;
  },

  async getBusinesses(): Promise<AdminBusiness[]> {
    const response = await apiClient.get<AdminBusiness[]>('/superadmin/businesses');
    return response.data;
  },

  async deleteBusiness(businessId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/superadmin/businesses/${businessId}`);
    return response.data;
  },
};
