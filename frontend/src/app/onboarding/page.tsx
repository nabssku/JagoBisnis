'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { businessService } from '@/services/business.service';
import { businessSchema, BusinessDto } from '@/types/business-dto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Store, Globe, ArrowRight, Phone, MapPin, Tag, FileText, Compass, Star } from 'lucide-react';

const CATEGORIES = [
  { value: 'fnb', label: 'Kuliner (Makanan & Minuman)' },
  { value: 'fashion', label: 'Fashion & Pakaian' },
  { value: 'retail', label: 'Toko Kelontong / Retail' },
  { value: 'electronics', label: 'Elektronik & Gadget' },
  { value: 'services', label: 'Jasa & Layanan Profesional' },
  { value: 'health', label: 'Kesehatan & Kecantikan' },
  { value: 'automotive', label: 'Otomotif & Bengkel' },
  { value: 'other', label: 'Lainnya' },
];

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugPreview, setSlugPreview] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessDto>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      category: 'fnb',
    }
  });

  const businessName = watch('name');

  // Verify auth session and existing business limit on mount
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [me, businesses] = await Promise.all([
          authService.getMe(),
          businessService.getAll(),
        ]);
        
        setUser(me);
        
        // If user already has a business profile, redirect to dashboard immediately (Strict 1 Business Profile limit)
        if (businesses.length > 0) {
          toast.info('Anda sudah memiliki profil bisnis aktif.');
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Failed to load user or business info', err);
        localStorage.removeItem('accessToken');
        router.push('/login');
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkUserSession();
  }, [router]);

  // Automatic Slug generator
  useEffect(() => {
    if (businessName) {
      const generated = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', generated, { shouldValidate: true });
      setSlugPreview(generated);
    } else {
      setSlugPreview('');
    }
  }, [businessName, setValue]);

  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = rawValue
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/(^-|-$)/g, '');
    setValue('slug', formatted, { shouldValidate: true });
    setSlugPreview(formatted);
  };

  const onSubmit = async (data: BusinessDto) => {
    setIsSubmitting(true);
    try {
      const created = await businessService.create(data);
      toast.success('Profil Bisnis Anda berhasil dibuat!');
      
      // Successfully created first business. Redirect directly to dashboard.
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Gagal membuat profil bisnis. Silakan coba lagi.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-[#e8aa20]" />
          <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Menyiapkan langkah berikutnya...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8aa20]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e8aa20]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden z-10">
        <div className="p-8 md:p-12 space-y-8">
          
          {/* Header */}
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#e8aa20] dark:bg-[#e8aa20]/20">
              <Star className="h-3.5 w-3.5 fill-[#e8aa20]" />
              Langkah 1 dari 1: Buat Profil Bisnis
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Halo {user?.name}! Mari bangun toko Anda.
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
              Maksimal 1 Akun 1 Profil Bisnis. Isi formulir singkat di bawah untuk membuat profil bisnis pertama Anda. 
              Ini akan otomatis membuat link katalog toko Anda yang siap dibagikan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Input Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                Nama Bisnis / Toko
              </label>
              <div className="relative">
                <Store className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Contoh: Kopi Sedap Rasa, Butik Cantik"
                  className="rounded-xl h-12 pl-12 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/20 transition-all placeholder:text-gray-400"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>
            </div>

            {/* Input Slug & Live Preview */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                Link Unik Toko (Slug)
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="namabisnismu"
                  className="rounded-xl h-12 pl-12 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/20 transition-all placeholder:text-gray-400 font-mono text-sm"
                  {...register('slug')}
                  onChange={onSlugChange}
                  error={errors.slug?.message}
                />
              </div>

              {/* Dynamic Showcase Link */}
              <div className="rounded-xl bg-[#e8aa20]/5 dark:bg-[#e8aa20]/10 border border-[#e8aa20]/15 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500">Link Publik Anda:</span>
                  <span className="text-[11px] font-black text-[#e8aa20] font-mono break-all">
                    https://www.jago-bisnis.my.id/jago/{slugPreview || '...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Category & WhatsApp in one grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                  Kategori Bisnis
                </label>
                <div className="relative">
                  <Compass className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    className="flex w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 h-12 pl-12 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/20 outline-none transition-all appearance-none cursor-pointer"
                    {...register('category')}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} className="dark:bg-zinc-900 text-gray-900 dark:text-white">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                  Nomor WhatsApp Toko
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Contoh: 08123456789"
                    className="rounded-xl h-12 pl-12 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/20 transition-all placeholder:text-gray-400"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                Deskripsi Toko (Opsional)
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <textarea
                  placeholder="Jelaskan secara singkat apa saja yang Anda tawarkan..."
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/20 outline-none transition-all placeholder:text-gray-400"
                  {...register('description')}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                Alamat Fisik / Lokasi Toko (Opsional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <textarea
                  placeholder="Contoh: Jl. Merdeka No. 45, Jakarta Selatan"
                  rows={2}
                  className="flex w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/20 outline-none transition-all placeholder:text-gray-400"
                  {...register('address')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#e8aa20] font-black text-black hover:bg-[#d4991c] hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 dark:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Mendirikan Toko Anda...
                </>
              ) : (
                <>
                  Mulai Toko JagoBisnis Saya
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
