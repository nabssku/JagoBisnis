export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
