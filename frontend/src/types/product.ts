export interface Product {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  images: string[];
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
