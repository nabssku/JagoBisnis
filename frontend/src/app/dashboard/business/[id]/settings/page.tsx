'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { businessSchema, BusinessDto } from '@/types/business-dto';
import { businessService } from '@/services/business.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { ChevronLeft, Trash2, Save, Info, MapPin, Phone, Tag, Type, FileText, Globe } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function BusinessSettingsPage() {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessDto>({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [businessData, userData] = await Promise.all([
          businessService.getById(businessId),
          authService.getMe()
        ]);
        setUser(userData);
        reset({
          name: businessData.name,
          slug: businessData.slug,
          description: businessData.description || '',
          category: businessData.category || '',
          phone: businessData.phone || '',
          address: businessData.address || '',
          logoUrl: businessData.logoUrl || '',
        });
      } catch (err) {
        setError('Gagal memuat data bisnis.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId, reset]);

  const onSubmit = async (data: BusinessDto) => {
    setIsSaving(true);
    setError(null);
    try {
      await businessService.update(businessId, data);
      toast.success('Profil bisnis berhasil diperbarui!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal memperbarui bisnis.');
        toast.error('Gagal memperbarui profil');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await businessService.delete(businessId);
      toast.success('Bisnis berhasil dihapus');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Gagal menghapus bisnis');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell businessId={businessId} user={null}>
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <div className="grid gap-8 lg:grid-cols-3">
            <Skeleton className="lg:col-span-2 h-[600px] rounded-[2rem]" />
            <Skeleton className="h-[300px] rounded-[2rem]" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell businessId={businessId} user={user}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Profil Usaha</h1>
          <p className="text-sm font-medium text-gray-400 dark:text-zinc-400">Atur informasi dasar bisnis Anda untuk ditampilkan di website.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden border-gray-100 dark:border-zinc-800/80 shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                  <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Informasi Dasar</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium text-gray-400 dark:text-zinc-500">Informasi ini akan muncul di bagian Hero dan About website Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <form id="settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 text-sm font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Type className="h-3 w-3" /> Nama Bisnis
                      </label>
                      <Input
                        placeholder="Contoh: Kedai Kopi Jago"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...register('name')}
                        error={errors.name?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Tag className="h-3 w-3" /> Slug Website
                      </label>
                      <Input
                        placeholder="kopi-jago"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-primary dark:text-amber-400"
                        {...register('slug')}
                        error={errors.slug?.message}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Tag className="h-3 w-3" /> Kategori
                      </label>
                      <Input
                        placeholder="Contoh: Kuliner"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...register('category')}
                        error={errors.category?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Phone className="h-3 w-3" /> No. Telepon (WhatsApp)
                      </label>
                      <Input
                        placeholder="08123456789"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...register('phone')}
                        error={errors.phone?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Alamat Fisik
                    </label>
                    <Input
                      placeholder="Alamat lengkap usaha Anda"
                      className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                      {...register('address')}
                      error={errors.address?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                      <FileText className="h-3 w-3" /> Deskripsi Singkat
                    </label>
                    <textarea
                      placeholder="Ceritakan sedikit tentang bisnis Anda..."
                      className="flex min-h-[120px] w-full rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 px-4 py-3 text-sm font-medium focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                      {...register('description')}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="p-10 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80">
                <Button 
                  type="submit" 
                  form="settings-form"
                  className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-zinc-100 font-black text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-xl transition-all hover:scale-[1.02]" 
                  isLoading={isSaving}
                >
                  <Save className="mr-2 h-5 w-5" />
                  Simpan Perubahan Profil
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Preview Hint Card */}
            <Card className="overflow-hidden border-gray-100 dark:border-zinc-800/80 shadow-xl rounded-[2.5rem] bg-[#1F2937] text-white">
              <CardContent className="p-8 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">Lihat Website</h3>
                  <p className="text-xs font-medium text-gray-400 leading-relaxed">Perubahan profil akan langsung terlihat pada website publik Anda.</p>
                </div>
                <Button asChild variant="outline" className="w-full h-10 rounded-xl border-white/10 bg-white/5 font-bold hover:bg-white/10">
                  <Link href={`/dashboard/business/${businessId}/website`}>Buka Builder</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="overflow-hidden border-red-100 dark:border-red-950/80 shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-lg font-black text-red-600 dark:text-red-500">Zona Bahaya</CardTitle>
                <CardDescription className="text-xs font-medium text-gray-400 dark:text-zinc-500">Tindakan ini tidak dapat dibatalkan.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Button 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold justify-start"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Bisnis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Hapus Bisnis?"
        description="Apakah Anda yakin ingin menghapus bisnis ini? Semua data, produk, dan website terkait akan dihapus secara permanen."
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" className="flex-1 h-12 rounded-xl font-black bg-red-600 text-white" onClick={handleDelete} isLoading={isDeleting}>
              Ya, Hapus
            </Button>
          </div>
        }
      />
    </DashboardShell>
  );
}
