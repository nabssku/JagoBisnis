'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { businessService } from '@/services/business.service';
import { analyticsService, AnalyticsStatsResponse } from '@/services/analytics.service';
import { User } from '@/types/auth';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Store, 
  Eye, 
  ShoppingBag,
  PlusSquare,
  Plus,
  Edit,
  Star,
  LineChart
} from 'lucide-react';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<AnalyticsStatsResponse | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
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
        
        // If SuperAdmin, redirect to SuperAdmin workspace immediately
        if (userData.role === 'SUPERADMIN') {
          router.push('/dashboard/superadmin');
          return;
        }

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

  const mainBusiness = businesses[0];
  const businessId = mainBusiness?.id;

  // Fetch stats once business info is resolved
  useEffect(() => {
    const fetchStats = async () => {
      if (!businessId) return;
      setIsStatsLoading(true);
      try {
        const data = await analyticsService.getStats(businessId, 30);
        setStatsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics statistics', err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    if (businessId) {
      fetchStats();
    }
  }, [businessId]);

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

  const stats = [
    { 
      label: 'Kunjungan Profil', 
      value: statsData ? statsData.summary.totalViews.toLocaleString('id-ID') : '0', 
      icon: Eye, 
      color: 'text-amber-500' 
    },
    { 
      label: 'Pemesanan', 
      value: statsData ? statsData.summary.totalOrdersCount.toLocaleString('id-ID') : '0', 
      icon: ShoppingBag, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Persentase Konversi', 
      value: statsData ? `${statsData.summary.conversionRate}%` : '0%', 
      icon: LineChart, 
      color: 'text-purple-500' 
    },
    { 
      label: 'Total Penjualan (GTV)', 
      value: statsData ? `Rp${statsData.summary.totalGtv.toLocaleString('id-ID')}` : 'Rp0', 
      icon: Store, 
      color: 'text-emerald-500' 
    },
  ];

  return (
    <DashboardShell businessId={businessId} user={user}>
      <div className="space-y-10 pb-10">
        {/* Top Cards Section */}
        <div className="grid gap-6 lg:grid-cols-2">
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
                  <p className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
                    {isStatsLoading ? (
                      <span className="text-2xl font-bold animate-pulse text-gray-300 dark:text-zinc-700">...</span>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Analytics Charts & Details Section */}
        {statsData && !isStatsLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-500 whitespace-nowrap">Analitis Lanjutan</h2>
              <div className="h-px w-full bg-gray-100 dark:bg-zinc-800" />
            </div>
            <AnalyticsCharts 
              chartData={statsData.chartData} 
              topReferrers={statsData.topReferrers} 
              topProducts={statsData.topProducts} 
            />
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-[2.5rem] bg-[#1F2937] p-10 text-white shadow-xl relative overflow-hidden group col-span-3"
          >
            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Paket Anda</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-black tracking-tight">Free | Beta</h3>
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <Star className="h-5 w-5 fill-amber-400" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 leading-relaxed">
                Karena masih dalam tahap beta, kamu mendapatkan akses gratis selamanya.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
