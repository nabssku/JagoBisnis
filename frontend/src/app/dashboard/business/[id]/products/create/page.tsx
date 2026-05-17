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
        className="flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Kembali ke Daftar Produk
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Produk Baru</CardTitle>
          <CardDescription>
            Lengkapi data produk untuk ditambahkan ke katalog bisnis Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
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
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deskripsi singkat produk"
                {...register('description')}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Simpan Produk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
