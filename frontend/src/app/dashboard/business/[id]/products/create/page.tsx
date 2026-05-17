'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { productSchema, ProductDto } from '@/types/product-dto';
import { productService } from '@/services/product.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export default function CreateProductPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductDto>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: ProductDto) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.create(businessId, data);
      router.push(`/dashboard/business/${businessId}/products`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal membuat produk.');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug, { shouldValidate: true });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href={`/dashboard/business/${businessId}/products`} 
        className="flex items-center text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Kembali ke Daftar Produk
      </Link>

      <Card className="overflow-hidden border-gray-100 dark:border-zinc-800 shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
        <CardHeader className="p-8 pb-0">
          <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Tambah Produk Baru</CardTitle>
          <CardDescription className="text-sm font-medium text-gray-400 dark:text-zinc-500">
            Lengkapi data produk untuk ditambahkan ke katalog bisnis Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}
            <Input
              label="Nama Produk"
              placeholder="Contoh: Kopi Susu Aren"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                handleNameChange(e);
              }}
              error={errors.name?.message}
            />
            <Input
              label="Slug Produk"
              placeholder="kopi-susu-aren"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Harga (Rp)"
                type="number"
                placeholder="15000"
                {...register('price')}
                error={errors.price?.message}
              />
              <Input
                label="Stok"
                type="number"
                placeholder="100"
                {...register('stock')}
                error={errors.stock?.message}
              />
            </div>
            <Input
              label="Kategori"
              placeholder="Contoh: Minuman"
              {...register('category')}
              error={errors.category?.message}
            />
            <Input
              label="URL Gambar"
              placeholder="https://..."
              {...register('imageUrl')}
              error={errors.imageUrl?.message}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Deskripsi</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="Deskripsi singkat produk"
                {...register('description')}
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-gray-900 dark:bg-zinc-100 font-black text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-lg transition-all" isLoading={isLoading}>
              Simpan Produk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
