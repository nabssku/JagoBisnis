'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Globe,
  Eye,
  Users,
  TrendingUp,
  ExternalLink,
  Clock,
  FileText,
  Activity,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  analyticsService,
  ReferrerDetailResponse,
} from '@/services/analytics.service';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';

const RANGE_OPTIONS = [
  { label: '7 hari', value: 7 },
  { label: '30 hari', value: 30 },
  { label: '90 hari', value: 90 },
];

const EVENT_LABELS: Record<string, string> = {
  VIEW_SITE: 'Lihat Toko',
  VIEW_PRODUCT: 'Lihat Produk',
  CLICK_ORDER: 'Klik Pesan',
  CLICK_CONTACT: 'Klik Kontak',
  CLICK_WHATSAPP: 'Klik WhatsApp',
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Barusan';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

export default function ReferrerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const businessId = params.id as string;
  const referrerParam = searchParams.get('referrer') ?? 'direct';

  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<ReferrerDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState(30);
  const [activeTab, setActiveTab] = useState<'pages' | 'events' | 'recent'>('pages');

  const fetchData = async (rangeDays: number) => {
    setIsLoading(true);
    try {
      const result = await analyticsService.getReferrerDetail(
        businessId,
        referrerParam,
        rangeDays,
      );
      setData(result);
    } catch {
      toast.error('Gagal memuat data. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const u = await authService.getMe();
        setUser(u);
      } catch {
        router.push('/login');
        return;
      }
      await fetchData(range);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = (days: number) => {
    setRange(days);
    fetchData(days);
  };

  // --- SVG mini chart ---
  const chartW = 560;
  const chartH = 140;
  const padX = 30;
  const padY = 12;

  const chartData = data?.chartData ?? [];
  const maxViews = Math.max(...chartData.map((d) => d.views), 5);
  const maxVisitors = Math.max(...chartData.map((d) => d.visitors), 5);
  const maxVal = Math.max(maxViews, maxVisitors);

  const coords = (i: number, v: number) => ({
    x: padX + (i * (chartW - 2 * padX)) / Math.max(chartData.length - 1, 1),
    y: chartH - padY - (v * (chartH - 2 * padY)) / maxVal,
  });

  let viewsPath = '';
  let visitorsPath = '';
  if (chartData.length > 0) {
    const c0 = coords(0, chartData[0].views);
    viewsPath = `M ${c0.x} ${c0.y}`;
    const v0 = coords(0, chartData[0].visitors);
    visitorsPath = `M ${v0.x} ${v0.y}`;
    for (let i = 1; i < chartData.length; i++) {
      const cv = coords(i, chartData[i].views);
      viewsPath += ` L ${cv.x} ${cv.y}`;
      const vi = coords(i, chartData[i].visitors);
      visitorsPath += ` L ${vi.x} ${vi.y}`;
    }
  }

  const isDirect =
    referrerParam === 'direct' ||
    referrerParam === '' ||
    referrerParam === '(direct)';

  return (
    <DashboardShell businessId={businessId} user={user}>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard"
            className="mt-0.5 p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500 mb-1 font-semibold uppercase tracking-widest">
              <span>Sumber Rujukan</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-amber-600 dark:text-amber-500 truncate max-w-xs">
                {isDirect ? '(direct / langsung)' : referrerParam}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2 truncate">
              <Globe className="h-6 w-6 text-amber-500 shrink-0" />
              Detail Traffic
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
              {isDirect
                ? 'Pengunjung yang datang langsung (tanpa referrer).'
                : `Pengunjung yang datang dari: ${referrerParam}`}
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchData(range)}
            className="shrink-0 rounded-xl gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        {/* Range selector */}
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleRangeChange(opt.value)}
              className={cn(
                'px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all',
                range === opt.value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-amber-300',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-3xl" />
            <Skeleton className="h-24 rounded-3xl" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Eye,
                label: 'Total Views',
                value: data?.summary.totalViews.toLocaleString('id-ID') ?? '0',
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-950/20',
              },
              {
                icon: Users,
                label: 'Pengunjung Unik',
                value: data?.summary.uniqueVisitors.toLocaleString('id-ID') ?? '0',
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-950/20',
              },
              {
                icon: FileText,
                label: 'Halaman Dikunjungi',
                value: (data?.topPages.length ?? 0).toString(),
                color: 'text-purple-500',
                bg: 'bg-purple-50 dark:bg-purple-950/20',
              },
              {
                icon: Activity,
                label: 'Jenis Event',
                value: (data?.eventBreakdown.length ?? 0).toString(),
                color: 'text-green-500',
                bg: 'bg-green-50 dark:bg-green-950/20',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col gap-2"
              >
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', card.bg)}>
                  <card.icon className={cn('h-4 w-4', card.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">
                    {card.label}
                  </p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{card.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Chart */}
        {isLoading ? (
          <Skeleton className="h-48 rounded-3xl" />
        ) : chartData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                Tren Harian
              </h2>
              <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Views</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Unik</span>
              </div>
            </div>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
              <line x1={padX} y1={padY} x2={chartW - padX} y2={padY} stroke="#f3f4f6" strokeWidth="1" />
              <line x1={padX} y1={chartH - padY} x2={chartW - padX} y2={chartH - padY} stroke="#e5e7eb" strokeWidth="1" />
              <path d={viewsPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={visitorsPath} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
              {chartData.length > 0 && (
                <>
                  <text x={padX} y={chartH - 2} fill="#9ca3af" fontSize="8" fontFamily="sans-serif">{formatDate(chartData[0].date)}</text>
                  <text x={chartW - padX} y={chartH - 2} textAnchor="end" fill="#9ca3af" fontSize="8" fontFamily="sans-serif">{formatDate(chartData[chartData.length - 1].date)}</text>
                </>
              )}
            </svg>
          </motion.div>
        ) : null}

        {/* Tabs */}
        {isLoading ? (
          <Skeleton className="h-64 rounded-3xl" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex border-b border-gray-100 dark:border-zinc-800">
              {[
                { key: 'pages', label: 'Halaman Dikunjungi', icon: FileText },
                { key: 'events', label: 'Event Breakdown', icon: Activity },
                { key: 'recent', label: 'Riwayat Terbaru', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    'flex items-center gap-1.5 px-5 py-3.5 text-xs font-extrabold border-b-2 transition-all',
                    activeTab === tab.key
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-transparent text-gray-500 dark:text-zinc-500 hover:text-gray-700',
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'pages' && (
                  <motion.div
                    key="pages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    {data?.topPages.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Tidak ada data halaman.</p>
                    ) : (
                      data?.topPages.map((page, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 w-5 h-5 flex items-center justify-center rounded-lg shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 truncate max-w-xs font-mono">
                              {page.path}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg shrink-0">
                            {page.count}x
                          </span>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'events' && (
                  <motion.div
                    key="events"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {data?.eventBreakdown.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Tidak ada event tercatat.</p>
                    ) : (
                      data?.eventBreakdown.map((ev, i) => {
                        const total = data.eventBreakdown.reduce((s, e) => s + e.count, 0);
                        const pct = total > 0 ? Math.round((ev.count / total) * 100) : 0;
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                                {EVENT_LABELS[ev.event] ?? ev.event}
                              </span>
                              <span className="text-xs font-extrabold text-gray-600 dark:text-zinc-400">
                                {ev.count}x <span className="text-gray-400 font-semibold">({pct}%)</span>
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                                className="h-full bg-amber-400 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {activeTab === 'recent' && (
                  <motion.div
                    key="recent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    {data?.recentHits.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Belum ada hit terekam.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-[9px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest">
                              <th className="text-left pb-3 pr-4">Waktu</th>
                              <th className="text-left pb-3 pr-4">Event</th>
                              <th className="text-left pb-3 pr-4">Path</th>
                              <th className="text-left pb-3">User Agent</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {data?.recentHits.map((hit) => (
                              <tr
                                key={hit.id}
                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors"
                              >
                                <td className="py-2.5 pr-4 text-gray-500 dark:text-zinc-500 whitespace-nowrap">
                                  {formatRelativeTime(hit.createdAt)}
                                </td>
                                <td className="py-2.5 pr-4">
                                  <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-lg font-bold whitespace-nowrap">
                                    {EVENT_LABELS[hit.event] ?? hit.event}
                                  </span>
                                </td>
                                <td className="py-2.5 pr-4 font-mono text-gray-700 dark:text-zinc-300 truncate max-w-[200px]">
                                  {hit.path}
                                </td>
                                <td className="py-2.5 text-gray-400 dark:text-zinc-600 truncate max-w-[160px]">
                                  {hit.userAgent ? hit.userAgent.slice(0, 40) + '…' : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* External link (bukan direct) */}
        {!isDirect && (
          <div className="flex justify-end">
            <a
              href={referrerParam.startsWith('http') ? referrerParam : `https://${referrerParam}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Buka sumber rujukan
            </a>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
