import apiClient from './api-client';
import { AuthResponse, User } from '@/types/auth';
import { RegisterDto, LoginDto } from '@/types/auth-dto';

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
  }
};
