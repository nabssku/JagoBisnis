'use client';

import React, { useEffect, useState } from 'react';
import { superAdminService, SuperAdminStats } from '@/services/superadmin.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Store, 
  Package, 
  Receipt, 
  CircleDollarSign, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SuperAdminPage() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await superAdminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load SuperAdmin stats', err);
        toast.error('Gagal mengambil data statistik platform.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-xl" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Pengguna',
      value: stats?.totalUsers || 0,
      description: 'Akun terdaftar aktif',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/15',
    },
    {
      title: 'Profil Bisnis',
      value: stats?.totalBusinesses || 0,
      description: 'UMKM di platform',
      icon: Store,
      color: 'bg-[#e8aa20]/10 text-[#e8aa20] border-[#e8aa20]/20',
    },
    {
      title: 'Total Produk',
      value: stats?.totalProducts || 0,
      description: 'Katalog terunggah',
      icon: Package,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15',
    },
    {
      title: 'Pesanan Sukses',
      value: stats?.totalOrders || 0,
      description: 'Transaksi terproses',
      icon: Receipt,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/15',
    },
    {
      title: 'Total GTV Platform',
      value: formatCurrency(stats?.totalRevenue || 0),
      description: 'Transaksi sukses',
      icon: CircleDollarSign,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Konsol Ringkasan
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Data analitik, manajemen pengguna, status operasional, dan pertumbuhan platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 shadow-sm text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <Clock className="h-4 w-4 text-[#e8aa20]" />
          <span>Waktu Sistem: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {metricCards.map((card, idx) => (
          <div 
            key={idx} 
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {card.title}
                </span>
                <h3 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>{card.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lists & Health Overview Container */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Recent Registrants */}
        <Card className="lg:col-span-6 rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#e8aa20]" />
                Registrasi Pengguna Terbaru
              </CardTitle>
              <Link 
                href="/dashboard/superadmin/users"
                className="flex items-center gap-1 text-xs font-bold text-[#e8aa20] hover:text-[#d4991c] transition-colors"
              >
                Lihat Semua
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500">
              Pengguna yang baru-baru ini mendaftar akun di JagoBisnis.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center py-4 first:pt-2 last:pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 font-extrabold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                        user.role === 'SUPERADMIN' 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-zinc-400">Belum ada pengguna terdaftar.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Recent Businesses */}
        <Card className="lg:col-span-6 rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <Store className="h-5 w-5 text-[#e8aa20]" />
                Profil Bisnis Terbaru
              </CardTitle>
              <Link 
                href="/dashboard/superadmin/businesses"
                className="flex items-center gap-1 text-xs font-bold text-[#e8aa20] hover:text-[#d4991c] transition-colors"
              >
                Kelola Semua
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500">
              Profil bisnis dan katalog UMKM yang baru didaftarkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {stats?.recentBusinesses && stats.recentBusinesses.length > 0 ? (
                stats.recentBusinesses.map((b) => (
                  <div key={b.id} className="flex justify-between items-center py-4 first:pt-2 last:pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-[#e8aa20] border border-[#e8aa20]/25 font-extrabold text-xs">
                        {b.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                          {b.name}
                        </span>
                        <span className="text-[10px] text-[#e8aa20] font-mono leading-none mt-1">
                          jago/{b.slug}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {b.category ? b.category.toUpperCase() : 'GENERAL'}
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                        {formatDate(b.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-zinc-400">Belum ada bisnis terdaftar.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Operational Stats Panel */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif & Normal
            </span>
            <h3 className="text-lg font-black text-zinc-950 dark:text-white mt-3">
              Performa Infrastruktur JagoBisnis
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Laporan status latensi, server database, dan endpoint API cloud.
            </p>
          </div>
          
          <Link 
            href="/dashboard/superadmin/system"
            className="rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-800 dark:text-white transition-all"
          >
            Buka Metrik Real-time
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Uptime Server</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-zinc-950 dark:text-white">99.98%</span>
              <span className="text-xs font-semibold text-zinc-400">Terpantau</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.98%' }} />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Latensi Endpoint API</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-zinc-950 dark:text-white">12 ms</span>
              <span className="text-xs font-semibold text-emerald-500">Sangat Cepat</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Beban Database</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-zinc-950 dark:text-white">3.4%</span>
              <span className="text-xs font-semibold text-zinc-400">Idle</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#e8aa20] rounded-full" style={{ width: '3.4%' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
