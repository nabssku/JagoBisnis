'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  ChevronLeft,
  Share2
} from 'lucide-react';
import Link from 'next/link';

// Custom Instagram Inline SVG Icon
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import { DashboardShell } from '@/components/dashboard-shell';
import { socialPublishingService, SocialPost } from '@/services/social-publishing.service';
import { integrationService } from '@/services/integration.service';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

export default function SocialPublishingDashboard() {
  const params = useParams();
  const router = useRouter();
  
  const businessId = params.id as string;
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState<'ALL' | 'INSTAGRAM' | 'THREADS'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED'>('ALL');
  
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSocialEnabled, setIsSocialEnabled] = useState(false);

  const fetchData = async () => {
    try {
      const [postsData, integrationsData, userData] = await Promise.all([
        socialPublishingService.getAll(businessId),
        integrationService.getAll(businessId),
        authService.getMe().catch(() => null)
      ]);
      setPosts(postsData);
      setUser(userData);
      
      // Determine if at least Instagram or Threads is active
      const hasSocial = integrationsData.some(
        (i) => (i.provider === 'INSTAGRAM' || i.provider === 'THREADS') && i.status === 'CONNECTED'
      );
      setIsSocialEnabled(hasSocial);
    } catch (error) {
      toast.error('Gagal memuat data postingan sosial.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const handlePublish = async (postId: string) => {
    setPublishingId(postId);
    try {
      const updated = await socialPublishingService.publish(businessId, postId);
      if (updated.status === 'PUBLISHED') {
        toast.success('Postingan berhasil dipublikasikan!');
      } else if (updated.status === 'FAILED') {
        toast.error(`Publikasi gagal: ${updated.errorMessage || 'Unknown Error'}`);
      }
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mempublikasikan postingan.');
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus draf postingan ini?')) {
      return;
    }
    setDeletingId(postId);
    try {
      await socialPublishingService.delete(businessId, postId);
      toast.success('Draf postingan berhasil dihapus.');
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus postingan.');
    } finally {
      setDeletingId(null);
    }
  };

  // Dynamic status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> Published
          </span>
        );
      case 'PUBLISHING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/10 px-2 py-0.5 rounded-full animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" /> Publishing...
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900/50 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Draft
          </span>
        );
    }
  };

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = filterProvider === 'ALL' || post.provider === filterProvider;
    const matchesStatus = filterStatus === 'ALL' || post.status === filterStatus;
    return matchesSearch && matchesProvider && matchesStatus;
  });

  return (
    <DashboardShell businessId={businessId} user={user}>
      <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              <Link href="/dashboard" className="hover:text-amber-500 transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-zinc-300">Sosial Media</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Postingan Sosial</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Publikasikan pembaruan produk, katalog, atau event penting secara instan ke Instagram dan Threads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchData}
              variant="outline"
              className="rounded-xl flex items-center justify-center p-3 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Link href={isSocialEnabled ? `/dashboard/business/${businessId}/social-posts/create` : '#'}>
              <Button
                disabled={!isSocialEnabled}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black flex items-center gap-2 px-5 py-3 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
                Buat Postingan Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Warning Callout when no integration is connected */}
        {!isSocialEnabled && !isLoading && (
          <div className="rounded-3xl border border-amber-100 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/10 p-5 flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-amber-900 dark:text-amber-400">Koneksi Sosial Media Belum Terhubung!</h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-500/80 leading-relaxed">
                Anda perlu menghubungkan akun Instagram Business atau Threads Anda terlebih dahulu di halaman{' '}
                <Link href={`/dashboard/business/${businessId}/integrations`} className="underline font-bold hover:text-amber-600">
                  Integrasi Center
                </Link>{' '}
                sebelum dapat membuat draft dan mempublikasikan postingan.
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari isi postingan..."
              className="w-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0B0F19] pl-11 pr-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Provider Filter */}
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-1">
              {(['ALL', 'INSTAGRAM', 'THREADS'] as const).map((prov) => (
                <button
                  key={prov}
                  onClick={() => setFilterProvider(prov)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                    filterProvider === prov
                      ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                  )}
                >
                  {prov === 'ALL' ? 'Semua Platform' : prov === 'INSTAGRAM' ? 'Instagram' : 'Threads'}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-1">
              {(['ALL', 'DRAFT', 'PUBLISHING', 'PUBLISHED', 'FAILED'] as const).map((stat) => (
                <button
                  key={stat}
                  onClick={() => setFilterStatus(stat)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                    filterStatus === stat
                      ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                  )}
                >
                  {stat === 'ALL' ? 'Semua Status' : stat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Rendering Grid */}
        {isLoading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500"></div>
            <span className="text-xs text-gray-500 dark:text-zinc-400">Memuat data postingan...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0B0F19]/40 p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-400">
              <Send className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-gray-900 dark:text-white">Tidak Ada Postingan Ditemukan</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm">
                Mulai hubungkan jejaring sosial, buat draf postingan baru, dan tayangkan katalog UMKM Anda secara global.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post) => {
                const mediaList: string[] = JSON.parse(post.mediaUrls || '[]');
                const hasMedia = mediaList.length > 0;
                
                return (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] p-5 shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-800 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'h-8 w-8 rounded-xl flex items-center justify-center text-white',
                            post.provider === 'INSTAGRAM'
                              ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-amber-500'
                              : 'bg-black dark:bg-white text-white dark:text-black'
                          )}>
                            {post.provider === 'INSTAGRAM' ? (
                              <InstagramIcon className="h-4.5 w-4.5" />
                            ) : (
                              <Activity className="h-4.5 w-4.5" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-black text-gray-900 dark:text-white">
                              {post.provider === 'INSTAGRAM' ? 'Instagram' : 'Threads'}
                            </span>
                            <div className="text-[10px] text-gray-400">
                              @{post.integration?.providerAccountName || 'linked_account'}
                            </div>
                          </div>
                        </div>

                        {renderStatusBadge(post.status)}
                      </div>

                      {/* Content Preview */}
                      <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed line-clamp-4 whitespace-pre-line font-medium min-h-[72px]">
                        {post.content}
                      </p>

                      {/* Attached Media Preview */}
                      {hasMedia && (
                        <div className="relative rounded-2xl overflow-hidden aspect-video border border-gray-100 dark:border-zinc-900 bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mediaList[0]}
                            alt="Media Attachment"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {mediaList.length > 1 && (
                            <div className="absolute right-2 bottom-2 rounded-lg bg-black/75 px-1.5 py-0.5 text-[9px] font-black text-white flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              +{mediaList.length - 1} Media
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error details rendering */}
                      {post.status === 'FAILED' && post.errorMessage && (
                        <div className="rounded-2xl border border-rose-100 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/15 p-3 flex gap-2 items-start">
                          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400">Error Detail</span>
                            <p className="text-[10px] font-semibold text-rose-700 dark:text-rose-500/90 leading-tight">
                              {post.errorMessage}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions Area */}
                    <div className="pt-4 border-t border-gray-50 dark:border-zinc-900 mt-5 flex gap-2 items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>

                      <div className="flex gap-2">
                        {/* Delete trigger for Drafts or Fails */}
                        {(post.status === 'DRAFT' || post.status === 'FAILED') && (
                          <Button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            variant="ghost"
                            className="rounded-xl h-9 w-9 p-0 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Publish trigger for Drafts or Fails */}
                        {(post.status === 'DRAFT' || post.status === 'FAILED') && (
                          <Button
                            onClick={() => handlePublish(post.id)}
                            disabled={publishingId !== null}
                            className="rounded-xl h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm"
                          >
                            {publishingId === post.id ? 'Publishing...' : 'Terbitkan'}
                          </Button>
                        )}

                        {/* External platform post link */}
                        {post.status === 'PUBLISHED' && post.providerPostId && (
                          <Button
                            onClick={() => {
                              const url = post.provider === 'INSTAGRAM' 
                                ? `https://instagram.com/p/${post.providerPostId}`
                                : `https://threads.net/post/${post.providerPostId}`;
                              window.open(url, '_blank');
                            }}
                            variant="outline"
                            className="rounded-xl h-9 px-3 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-bold flex items-center gap-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Lihat Live
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
