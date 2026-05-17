'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { postService } from '@/services/post.service';
import { authService } from '@/services/auth.service';
import { Post } from '@/types/post';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { DashboardShell } from '@/components/dashboard-shell';
import { PostFormModal } from '@/components/post-form-modal';
import { 
  Plus, Edit, Trash2, FileText, Eye, Search, AlertCircle, 
  Pin, Sparkles, CheckCircle2, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'published' | 'draft' | 'archived' | 'seo_alert';

export default function PostListPage() {
  const params = useParams();
  const businessId = params.id as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  
  // Modal controllers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [postsData, userData] = await Promise.all([
        postService.getAll(businessId),
        authService.getMe()
      ]);
      setPosts(postsData);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  // Handle post delete
  const handleDelete = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      await postService.delete(businessId, deletePostId);
      setPosts(posts.filter((p) => p.id !== deletePostId));
      setDeletePostId(null);
    } catch (err) {
      console.error('Failed to delete post', err);
      alert('Gagal menghapus konten.');
    } finally {
      setIsDeleting(false);
    }
  };

  // SEO Score checker helper for SEO Alert Tab
  const needsSeoHelp = (post: Post) => {
    if (!post.focusKeyword?.trim()) return true;
    if (post.content.trim().split(/\s+/).length < 100) return true;
    if (!post.metaDescription?.trim()) return true;
    return false;
  };

  // Filter posts dynamically
  const filteredPosts = posts.filter((post) => {
    // Search filter
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === 'published') return post.status === 'Publik';
    if (activeTab === 'draft') return post.status === 'Draft';
    if (activeTab === 'archived') return post.status === 'Arsip';
    if (activeTab === 'seo_alert') return needsSeoHelp(post);

    return true;
  });

  if (isLoading) {
    return (
      <DashboardShell businessId={businessId} user={null}>
        <div className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell businessId={businessId} user={user}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Page Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Blog & Konten Usaha
            </h1>
            <p className="text-sm font-medium text-gray-400 dark:text-zinc-400">
              Buat pengumuman, promosi, dan artikel edukatif untuk meningkatkan penjualan dan branding.
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditPostId(null);
              setIsFormOpen(true);
            }}
            className="h-12 rounded-xl bg-gray-900 dark:bg-zinc-100 px-6 font-black text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-lg transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Buat Konten Baru
          </Button>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab selectors */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-gray-100/80 dark:bg-zinc-800/40 border border-gray-200/20 w-fit">
            {(
              [
                { id: 'all', label: 'Semua', icon: undefined },
                { id: 'published', label: 'Publik', icon: undefined },
                { id: 'draft', label: 'Draft', icon: undefined },
                { id: 'archived', label: 'Arsip', icon: undefined },
                { id: 'seo_alert', label: 'SEO Perlu Perbaikan', icon: AlertCircle }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 select-none",
                  activeTab === tab.id
                    ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm border border-gray-150/40"
                    : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                )}
              >
                {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-650"
            />
          </div>
        </div>

        {/* Content Listing Grid */}
        <Card className="overflow-hidden border-gray-100 dark:border-zinc-800 shadow-xl rounded-[2rem] bg-white dark:bg-zinc-900">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Konten & Kategori</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Status</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Dibaca</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">SEO Score</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Dibuat</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-16 w-16 rounded-3xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-black text-gray-900 dark:text-white">Belum ada konten</p>
                            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">
                              {searchQuery ? 'Tidak ada konten yang cocok dengan pencarian Anda.' : 'Mulai publikasikan artikel pertama Anda hari ini.'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => {
                      const isAlert = needsSeoHelp(post);
                      return (
                        <tr key={post.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                          
                          {/* Image, Title & Content Type */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-20 overflow-hidden rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-850 shadow-sm flex-shrink-0">
                                {post.coverImage ? (
                                  <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] font-black uppercase text-gray-300 dark:text-zinc-650 bg-gray-50 dark:bg-zinc-900">
                                    No Cover
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col max-w-xs md:max-w-md">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {post.isPinned && (
                                    <span className="inline-flex items-center text-amber-500" title="Disematkan">
                                      <Pin className="h-3.5 w-3.5 fill-current" />
                                    </span>
                                  )}
                                  <span className="font-black text-gray-900 dark:text-white line-clamp-1">{post.title}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-450 dark:text-zinc-550 truncate">
                                  /{post.slug}
                                </span>
                                <div className="flex gap-1.5 items-center mt-1.5">
                                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                                    {post.contentType}
                                  </span>
                                  {post.tags && post.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="text-[9px] font-bold text-gray-400 dark:text-zinc-500">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-8 py-5">
                            <span className={cn(
                              "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                              post.status === 'Publik' 
                                ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"
                                : post.status === 'Draft'
                                  ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                                  : "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
                            )}>
                              {post.status}
                            </span>
                          </td>

                          {/* Views count */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-1.5 font-black text-gray-900 dark:text-white">
                              <Eye className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                              <span>{post.views || 0}</span>
                              <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase">Kali</span>
                            </div>
                          </td>

                          {/* SEO Score Indicator */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                isAlert 
                                  ? "bg-red-500 animate-pulse" 
                                  : "bg-green-500"
                              )} />
                              <span className={cn(
                                "text-xs font-black",
                                isAlert 
                                  ? "text-red-500" 
                                  : "text-green-600 dark:text-green-400"
                              )}>
                                {isAlert ? 'Optimasi SEO' : 'SEO Optimal'}
                              </span>
                            </div>
                          </td>

                          {/* Dibuat Tanggal */}
                          <td className="px-8 py-5">
                            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">
                              {new Date(post.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md dark:hover:shadow-none"
                                onClick={() => {
                                  setEditPostId(post.id);
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 text-gray-450 dark:text-zinc-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 hover:shadow-md"
                                onClick={() => setDeletePostId(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        title="Hapus Konten Artikel?"
        description="Apakah Anda yakin ingin menghapus postingan blog ini? Artikel yang terhapus tidak dapat diakses lagi oleh publik."
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setDeletePostId(null)}>
              Batal
            </Button>
            <Button variant="danger" className="flex-1 h-12 rounded-xl font-black bg-red-600 text-white" onClick={handleDelete} isLoading={isDeleting}>
              Ya, Hapus Artikel
            </Button>
          </div>
        }
      />

      {/* Post Form Modal (Creation / Editing) */}
      <PostFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        postId={editPostId}
        businessId={businessId}
        onSuccess={fetchData}
      />
    </DashboardShell>
  );
}
