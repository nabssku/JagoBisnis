import { z } from 'zod';

export const businessSchema = z.object({
  name: z.string().min(1, 'Nama bisnis wajib diisi'),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  category: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type BusinessDto = z.infer<typeof businessSchema>;
