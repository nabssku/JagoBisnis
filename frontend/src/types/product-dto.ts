import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  stock: z.coerce.number().min(0, 'Stok tidak boleh negatif'),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductDto = z.infer<typeof productSchema>;
