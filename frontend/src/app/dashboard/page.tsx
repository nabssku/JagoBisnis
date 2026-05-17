'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { businessService } from '@/services/business.service';
import { User } from '@/types/auth';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Store, 
  Globe, 
  Package, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  MessageCircle, 
  MapPin, 
  ShoppingBag,
  PlusSquare,
  FileText,
  User as UserIcon,
  MessageSquare,
  QrCode,
  Star,
  Edit,
  Share2
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [userData, businessData] = await Promise.all([
          authService.getMe(),
          businessService.getAll()
        ]);
        setUser(userData);
        setBusinesses(businessData);
        if (businessData.length === 0) {
          router.push('/onboarding');
          return;
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardShell user={null}>
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-3xl" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="col-span-2 h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  const mainBusiness = businesses[0];
  const businessId = mainBusiness?.id;

  const stats = [
    { label: 'Kunjungan Profil', value: '0', icon: Eye, color: 'text-gray-400' },
    { label: 'Klik WhatsApp', value: '0', icon: MessageCircle, color: 'text-green-500' },
    { label: 'Klik Lokasi', value: '0', icon: MapPin, color: 'text-amber-500' },
    { label: 'Produk Terjual', value: '0', icon: ShoppingBag, color: 'text-blue-500' },
  ];

  return (
    <DashboardShell businessId={businessId} user={user}>
      <div className="space-y-10 pb-10">
        {/* Top Cards Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative col-span-2 overflow-hidden rounded-[2.5rem] bg-[#1F2937] p-10 text-white shadow-2xl"
          >
            <div className="relative z-10 flex h-full flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md">
                  <Star className="h-3 w-3 fill-amber-400" />
                  Akun Dasar
                </div>
                <h1 className="text-5xl font-black tracking-tight">Halo, {mainBusiness?.name || user?.name}!</h1>
                <p className="max-w-md text-lg font-medium text-gray-400 leading-relaxed">
                  Lihat ringkasan aktivitas pelanggan dan kelola bisnis Anda dari satu tempat.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  asChild
                  className="h-12 rounded-xl bg-amber-400 px-6 font-black text-black hover:bg-amber-500 transition-all hover:scale-105"
                >
                  <Link href={businessId ? `/dashboard/business/${businessId}/products` : '#'}>
                    <PlusSquare className="mr-2 h-5 w-5" />
                    Tambah Produk
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border-white/10 bg-white/5 px-6 font-black text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                  <Link href={businessId ? `/dashboard/business/${businessId}/website` : '#'}>
                    <Plus className="mr-2 h-5 w-5" />
                    Tambah Konten
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border-white/10 bg-white/5 px-6 font-black text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                  <Link href={businessId ? `/dashboard/business/${businessId}/settings` : '#'}>
                    <Edit className="mr-2 h-5 w-5" />
                    Edit Profil
                  </Link>
                </Button>
              </div>
            </div>
            {/* Background Decorative Icon */}
            <Store className="absolute -right-16 -bottom-16 h-80 w-80 text-white/5 rotate-12" />
          </motion.div>

          {/* Integration Card (Xendit) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-between rounded-[2.5rem] bg-white dark:bg-zinc-900 p-10 border border-gray-100 dark:border-zinc-800 shadow-xl"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400 italic">xendit</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Mulai Berjualan Sekarang</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Integrasi dengan Xendit agar dapat menerima pembayaran penjualan.
                </p>
              </div>
            </div>
            <Button className="w-full h-12 rounded-xl bg-[#0066FF] font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-[1.02]">
              Hubungkan Xendit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Activity Summary Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-500 whitespace-nowrap">Ringkasan Aktivitas</h2>
            <div className="h-px w-full bg-gray-100 dark:bg-zinc-800" />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group rounded-[2rem] bg-white dark:bg-zinc-900 p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-6 transition-colors group-hover:bg-gray-100 dark:group-hover:bg-zinc-700">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-[2.5rem] bg-[#1F2937] p-10 text-white shadow-xl relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Paket Anda</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-black tracking-tight">Free</h3>
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <Star className="h-5 w-5 fill-amber-400" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 leading-relaxed">
                Dapatkan fitur analitik mendalam, materi promosi, dan domain kustom dengan berlangganan paket Premium.
              </p>
              <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 font-black text-white hover:bg-white/10 transition-all">
                Upgrade Sekarang
              </Button>
            </div>
          </motion.div>

          {/* Community Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 rounded-[2.5rem] bg-white dark:bg-zinc-900 p-10 border border-gray-100 dark:border-zinc-800 shadow-xl flex items-center gap-10"
          >
            <div className="h-24 w-24 rounded-3xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center shrink-0">
              <MessageSquare className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Komunitas WhatsApp JagoBisnis</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Gabung Sekarang</p>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed max-w-md">
                Terhubung dengan ribuan pelaku UMKM lain. Dapatkan tips, info promo, dan dukungan langsung.
              </p>
            </div>
            <div className="h-24 w-24 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 p-2 shrink-0 bg-white dark:bg-zinc-800">
              <QrCode className="h-full w-full text-gray-300 dark:text-zinc-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
