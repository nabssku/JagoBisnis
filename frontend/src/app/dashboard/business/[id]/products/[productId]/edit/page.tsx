'use client';

import React, { useEffect, useState } from 'react';
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

export default function EditProductPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  const productId = params.productId as string;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDto>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(businessId, productId);
        reset({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          price: data.price,
          stock: data.stock,
          category: data.category || '',
          imageUrl: data.imageUrl || '',
          isActive: data.isActive,
        });
      } catch {
        setError('Gagal memuat data produk.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [businessId, productId, reset]);

  const onSubmit = async (data: ProductDto) => {
    setIsSaving(true);
    setError(null);
    try {
      await productService.update(businessId, productId, data);
      router.push(`/dashboard/business/${businessId}/products`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal memperbarui produk.');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

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
          <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Edit Produk</CardTitle>
          <CardDescription className="text-sm font-medium text-gray-400 dark:text-zinc-500">
            Perbarui informasi produk Anda.
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
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Slug Produk"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Harga (Rp)"
                type="number"
                {...register('price')}
                error={errors.price?.message}
              />
              <Input
                label="Stok"
                type="number"
                {...register('stock')}
                error={errors.stock?.message}
              />
            </div>
            <Input
              label="Kategori"
              {...register('category')}
              error={errors.category?.message}
            />
            <Input
              label="URL Gambar"
              {...register('imageUrl')}
              error={errors.imageUrl?.message}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Deskripsi</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                {...register('description')}
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isActive" 
                {...register('isActive')} 
                className="h-4 w-4 rounded border-gray-300 dark:border-zinc-800 text-blue-600 focus:ring-blue-500 bg-white dark:bg-zinc-900"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-zinc-300">Produk Aktif</label>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-gray-900 dark:bg-zinc-100 font-black text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-lg transition-all" isLoading={isSaving}>
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
