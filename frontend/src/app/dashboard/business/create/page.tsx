'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { businessSchema, BusinessDto } from '@/types/business-dto';
import { businessService } from '@/services/business.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export default function CreateBusinessPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BusinessDto>({
    resolver: zodResolver(businessSchema),
  });

  const onSubmit = async (data: BusinessDto) => {
    setIsLoading(true);
    setError(null);
    try {
      await businessService.create(data);
      router.push('/dashboard/business');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal membuat bisnis.');
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
        href="/dashboard/business" 
        className="flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Kembali ke Daftar
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Buat Bisnis Baru</CardTitle>
          <CardDescription>
            Lengkapi data di bawah ini untuk mendaftarkan bisnis Anda.
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
              label="Nama Bisnis"
              placeholder="Contoh: Kopi Senja"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                handleNameChange(e);
              }}
              error={errors.name?.message}
            />
            <Input
              label="Slug Website"
              placeholder="contoh-kopi-senja"
              {...register('slug')}
              error={errors.slug?.message}
              description="Ini akan digunakan sebagai alamat website Anda: jagobisnis.id/jagobisnis/slug"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Kategori"
                placeholder="Contoh: Kuliner"
                {...register('category')}
                error={errors.category?.message}
              />
              <Input
                label="No. Telepon"
                placeholder="0812..."
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
            <Input
              label="Alamat"
              placeholder="Alamat lengkap bisnis"
              {...register('address')}
              error={errors.address?.message}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ceritakan sedikit tentang bisnis Anda"
                {...register('description')}
              />
              {errors.description?.message && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Simpan Bisnis
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
