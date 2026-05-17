'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { authService } from '@/services/auth.service';
import { businessService } from '@/services/business.service';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DashboardShell } from '@/components/dashboard-shell';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  Image as ImageIcon,
  KeyRound, 
  Check, 
  ShieldCheck,
  ChevronRight,
  Store
} from 'lucide-react';

// Zod schemas for validation
const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal terdiri dari 2 karakter'),
  email: z.string().email('Alamat email tidak valid'),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Kata sandi lama minimal terdiri dari 6 karakter'),
  newPassword: z.string().min(6, 'Kata sandi baru minimal terdiri dari 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi kata sandi minimal terdiri dari 6 karakter'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const PRESET_AVATARS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', label: 'Creative' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', label: 'Developer' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', label: 'Executive' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', label: 'Casual' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', label: 'Expert' },
];

export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const router = useRouter();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      avatarUrl: '',
    }
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, businesses] = await Promise.all([
          authService.getMe(),
          businessService.getAll()
        ]);
        
        setUser(userData);
        if (businesses.length > 0) {
          setBusinessId(businesses[0].id);
        }

        profileForm.reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          avatarUrl: userData.avatarUrl || '',
        });
        
        setSelectedAvatar(userData.avatarUrl || '');
      } catch (err) {
        toast.error('Gagal memuat profil pengguna');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSavingProfile(true);
    try {
      const updatedUser = await authService.updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        avatarUrl: selectedAvatar || undefined,
      });
      setUser(updatedUser);
      toast.success('Profil akun berhasil diperbarui!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
      } else {
        toast.error('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsSavingPassword(true);
    try {
      await authService.updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Kata sandi berhasil diperbarui!');
      passwordForm.reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Gagal memperbarui kata sandi.');
      } else {
        toast.error('Kata sandi lama salah atau tidak sesuai.');
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell user={null}>
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
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Pengaturan Akun</h1>
          <p className="text-sm font-medium text-gray-400 dark:text-zinc-400">Kelola detail profil pribadi, kontak, dan opsi keamanan kata sandi Anda.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings Card */}
            <Card className="overflow-hidden border-gray-100 dark:border-zinc-800/80 shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                  <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Profil Pribadi</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium text-gray-400 dark:text-zinc-500">Sesuaikan informasi kontak dan nama tampilan Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                  {/* Foto Profil Selector */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> Foto Profil / Avatar
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Avatar preview */}
                      <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-inner flex items-center justify-center bg-gray-50 dark:bg-zinc-800 shrink-0">
                        {selectedAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={selectedAvatar} alt="Profile Preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-black font-black text-xl">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>

                      {/* Presets Row */}
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setSelectedAvatar(av.url)}
                            className={`relative h-10 w-10 rounded-full overflow-hidden border-2 transition-all ${
                              selectedAvatar === av.url 
                                ? 'border-amber-400 scale-105 shadow-md' 
                                : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={av.url} alt={av.label} className="h-full w-full object-cover" />
                            {selectedAvatar === av.url && (
                              <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                                <Check className="h-4 w-4 text-amber-500 stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        ))}
                        
                        {/* Clear/Initials Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedAvatar('')}
                          className={`h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center font-bold text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 ${
                            !selectedAvatar 
                              ? 'border-amber-400 text-amber-500 font-extrabold shadow-md' 
                              : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          Inisial
                        </button>
                      </div>
                    </div>
                    
                    {/* Custom URL Input */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Atau masukkan tautan URL gambar khusus..."
                        value={selectedAvatar}
                        onChange={(e) => setSelectedAvatar(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-xs text-gray-600 dark:text-zinc-400 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                      />
                    </div>
                  </div>

                  {/* Display Name & Email Address */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <UserIcon className="h-3 w-3" /> Nama Tampilan
                      </label>
                      <Input
                        placeholder="Contoh: Nabil Sahsada"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...profileForm.register('name')}
                        error={profileForm.formState.errors.name?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Mail className="h-3 w-3" /> Alamat Email
                      </label>
                      <Input
                        placeholder="nabil@example.com"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...profileForm.register('email')}
                        error={profileForm.formState.errors.email?.message}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                      <Phone className="h-3 w-3" /> Nomor Telepon
                    </label>
                    <Input
                      placeholder="Contoh: 081234567890"
                      className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                      {...profileForm.register('phone')}
                      error={profileForm.formState.errors.phone?.message}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="p-10 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80">
                <Button 
                  type="submit" 
                  form="profile-form"
                  className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-zinc-100 font-black text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-xl transition-all hover:scale-[1.02]" 
                  isLoading={isSavingProfile}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Simpan Perubahan Profil
                </Button>
              </CardFooter>
            </Card>

            {/* Password Update Card */}
            <Card className="overflow-hidden border-gray-100 dark:border-zinc-800/80 shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                  <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Ubah Kata Sandi</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium text-gray-400 dark:text-zinc-500">Perbarui kata sandi secara berkala untuk menjaga keamanan akun Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form id="password-form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                      <KeyRound className="h-3 w-3" /> Kata Sandi Lama
                    </label>
                    <Input
                      type="password"
                      placeholder="Masukkan kata sandi lama Anda"
                      className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                      {...passwordForm.register('oldPassword')}
                      error={passwordForm.formState.errors.oldPassword?.message}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Kata Sandi Baru
                      </label>
                      <Input
                        type="password"
                        placeholder="Kata sandi baru (min. 6 karakter)"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...passwordForm.register('newPassword')}
                        error={passwordForm.formState.errors.newPassword?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Konfirmasi Kata Sandi Baru
                      </label>
                      <Input
                        type="password"
                        placeholder="Ulangi kata sandi baru"
                        className="h-12 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-gray-900 dark:text-white"
                        {...passwordForm.register('confirmPassword')}
                        error={passwordForm.formState.errors.confirmPassword?.message}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="p-10 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80">
                <Button 
                  type="submit" 
                  form="password-form"
                  className="w-full h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 font-black text-black shadow-xl transition-all hover:scale-[1.02]" 
                  isLoading={isSavingPassword}
                >
                  <KeyRound className="mr-2 h-5 w-5" />
                  Perbarui Kata Sandi
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Sidebar Info Cards */}
          <div className="space-y-8">
            {/* Account Info Card */}
            <Card className="overflow-hidden border-gray-100 dark:border-zinc-800/80 shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-amber-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Status Keamanan</h3>
                  <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">Identitas digital dan kredensial akses Anda terlindungi secara penuh.</p>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 dark:text-zinc-500">ID Pengguna</span>
                    <span className="font-mono font-black text-gray-900 dark:text-white">{user?.id?.slice(0, 12) || '24_357_Jago'}...</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 dark:text-zinc-500">Terdaftar Sejak</span>
                    <span className="font-black text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 dark:text-zinc-500">Status Akun</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
                      Aktif
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Switch to Business Profile */}
            {businessId && (
              <Card className="overflow-hidden border-gray-100 dark:border-zinc-800/80 shadow-xl rounded-[2.5rem] bg-[#1F2937] text-white p-8 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                  <Store className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">Kelola Profil Usaha</h3>
                  <p className="text-xs font-medium text-gray-400 leading-relaxed">Ingin mengubah nama usaha, slug, kategori, atau logo untuk website Anda?</p>
                </div>
                <Button asChild variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 font-black text-white hover:bg-white/10 flex items-center justify-center gap-2">
                  <Link href={`/dashboard/business/${businessId}/settings`}>
                    Profil Usaha
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
