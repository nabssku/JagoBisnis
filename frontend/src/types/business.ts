export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  category?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  BusinessUser?: { role: Role }[];
}
