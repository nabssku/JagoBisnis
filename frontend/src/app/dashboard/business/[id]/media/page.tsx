'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import mediaService, { MediaAsset } from '@/services/media.service';
import {
  Trash2,
  Upload,
  Play,
  Grid,
  List,
  Search,
  Video,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react';

import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

export default function MediaGalleryPage() {
  const { id: businessId } = useParams() as { id: string };

  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all media assets & user
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [mediaData, userData] = await Promise.all([
        mediaService.getAll(businessId),
        authService.getMe().catch(() => null)
      ]);
      setMediaList(mediaData);
      setUser(userData);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat pustaka media. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchMedia();
    }
  }, [businessId]);

  // Handle uploading media file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);
    setSuccess(null);

    // Client-side validation for file size (max 50MB)
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError('Berkas terlalu besar! Batas ukuran maksimal file adalah 50 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Client-side mime type validation
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setError('Format tidak didukung! Harap unggah file gambar atau video saja.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      await mediaService.upload(businessId, file);
      setSuccess('Berkas media berhasil diunggah!');
      fetchMedia();
    } catch (err: any) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || 'Gagal mengunggah berkas media. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle deleting a media asset
  const handleDelete = async (mediaId: string, filename: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${filename}"? Berkas yang dihapus tidak dapat dipulihkan.`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await mediaService.delete(businessId, mediaId);
      setSuccess('Media berhasil dihapus dari pustaka.');
      setMediaList((prev) => prev.filter((item) => item.id !== mediaId));
    } catch (err: any) {
      console.error(err);
      setError('Gagal menghapus berkas media. Silakan coba lagi.');
    }
  };

  // Helper to format file size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Total assets uploaded out of 500 limits
  const totalCount = mediaList.length;
  const limitCount = 500;
  const usagePercentage = Math.min((totalCount / limitCount) * 100, 100);

  // Filter and search computation
  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isItemVideo = item.mimeType.startsWith('video/');
    const isItemImage = item.mimeType.startsWith('image/');

    if (filterType === 'IMAGE') return matchesSearch && isItemImage;
    if (filterType === 'VIDEO') return matchesSearch && isItemVideo;
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <DashboardShell businessId={businessId} user={null}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
          <span className="text-sm font-bold text-gray-500 dark:text-zinc-400">Memuat berkas media...</span>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell businessId={businessId} user={user}>
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Pustaka Media</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Kelola semua file gambar dan video untuk katalog produk dan konten website kamu di satu tempat.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {/* View Mode Toggles */}
            <div className="flex items-center border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'GRID'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                }`}
                title="Tampilan Grid"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('LIST')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'LIST'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                }`}
                title="Tampilan List"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*,video/*"
              className="hidden"
              disabled={isUploading || totalCount >= limitCount}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || totalCount >= limitCount}
              className="flex items-center gap-2 px-5 h-11 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 text-black font-bold rounded-xl transition-all duration-200 shadow-sm disabled:cursor-not-allowed select-none"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" strokeWidth={2.5} />
              )}
              {isUploading ? 'Mengunggah...' : 'Unggah Media'}
            </button>
          </div>
        </div>

        {/* Banners */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 dark:bg-red-950/20 dark:border-red-900/50 rounded-2xl text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50 rounded-2xl text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Limit & Storage Stats Card */}
        <div className="bg-white dark:bg-[#0B0F19] border border-gray-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Kapasitas Unggah Akun
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{totalCount}</span>
                  <span className="text-sm text-gray-400 dark:text-zinc-500">dari {limitCount} foto/video terpakai</span>
                </div>
              </div>
              
              {totalCount >= limitCount && (
                <span className="self-start sm:self-center px-3 py-1 bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 text-xs font-black rounded-lg uppercase tracking-wider">
                  Penyimpanan Penuh
                </span>
              )}
            </div>

            {/* Custom Warm Progress Bar */}
            <div className="h-3 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePercentage > 90
                    ? 'bg-red-500'
                    : usagePercentage > 75
                    ? 'bg-amber-500'
                    : 'bg-amber-400'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <p className="text-xs text-gray-400 dark:text-zinc-500 leading-relaxed">
              Maks. 50 MB per berkas. Format yang didukung: JPG, JPEG, PNG, GIF, WEBP, SVG untuk gambar; MP4, WEBM untuk video.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-[#0B0F19] border border-gray-100 dark:border-zinc-900 rounded-2xl p-4 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Cari media berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-gray-50 hover:bg-gray-100/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-900 border border-gray-100 dark:border-zinc-800 focus:border-amber-400 dark:focus:border-amber-400 rounded-xl text-sm font-medium transition-all duration-200 outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['ALL', 'IMAGE', 'VIDEO'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 h-10 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 ${
                  filterType === type
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'bg-gray-50 dark:bg-zinc-900/50 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {type === 'ALL' && 'Semua Media'}
                {type === 'IMAGE' && 'Gambar'}
                {type === 'VIDEO' && 'Video'}
              </button>
            ))}
          </div>
        </div>

        {/* Media Assets Render */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            <span className="text-sm font-bold text-gray-500 dark:text-zinc-400">Memuat berkas media...</span>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#0B0F19] border border-gray-100 dark:border-zinc-900 rounded-3xl p-8 text-center shadow-sm">
            <div className="h-16 w-16 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
              <ImageIcon className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Belum Ada Media</h3>
            <p className="text-sm text-gray-400 dark:text-zinc-500 max-w-sm mb-6 leading-relaxed">
              {searchQuery || filterType !== 'ALL'
                ? 'Tidak ada media yang cocok dengan filter pencarian kamu.'
                : 'Mulai unggah foto produk atau aset konten website kamu agar bisa digunakan langsung kapan saja.'}
            </p>
            {(searchQuery || filterType !== 'ALL') ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('ALL');
                }}
                className="px-5 h-10 border border-gray-200 dark:border-zinc-800 dark:hover:bg-zinc-900 hover:bg-gray-50 text-gray-700 dark:text-zinc-300 font-bold rounded-xl transition-all"
              >
                Reset Filter
              </button>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 h-11 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-all shadow-sm"
              >
                Unggah File Pertama
              </button>
            )}
          </div>
        ) : viewMode === 'GRID' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMedia.map((item) => {
              const isVideo = item.mimeType.startsWith('video/');
              return (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-900 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="h-full w-full relative">
                    {isVideo ? (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-950">
                        <video
                          src={item.url}
                          className="h-full w-full object-cover opacity-60"
                          preload="metadata"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Badge Mimetype */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider text-white select-none">
                    {isVideo ? 'VIDEO' : 'IMAGE'}
                  </div>

                  {/* Absolute Info Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold truncate pr-6" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-300 font-medium">
                          {formatBytes(item.size)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-2 shrink-0">
                        <span className="text-[9px] text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white shadow-sm"
                          title="Hapus Media"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="bg-white dark:bg-[#0B0F19] border border-gray-100 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/30 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    <th className="py-4 px-6">Pratinjau</th>
                    <th className="py-4 px-6">Nama File</th>
                    <th className="py-4 px-6">Format</th>
                    <th className="py-4 px-6">Ukuran</th>
                    <th className="py-4 px-6">Tanggal Upload</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                  {filteredMedia.map((item) => {
                    const isVideo = item.mimeType.startsWith('video/');
                    return (
                      <tr
                        key={item.id}
                        className="text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                      >
                        {/* Preview */}
                        <td className="py-4 px-6">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 shrink-0 relative flex items-center justify-center">
                            {isVideo ? (
                              <div className="h-full w-full flex items-center justify-center bg-black">
                                <video src={item.url} className="h-full w-full object-cover opacity-50" />
                                <Play className="absolute h-4 w-4 text-white fill-white" />
                              </div>
                            ) : (
                              <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                        </td>

                        {/* Filename */}
                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white max-w-xs truncate">
                          {item.name}
                        </td>

                        {/* Format */}
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-900 border border-gray-200/20 dark:border-zinc-800 rounded-lg text-[9px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                            {item.mimeType.split('/')[1] || 'Unknown'}
                          </span>
                        </td>

                        {/* Size */}
                        <td className="py-4 px-6 font-medium text-gray-500 dark:text-zinc-400">
                          {formatBytes(item.size)}
                        </td>

                        {/* Upload Date */}
                        <td className="py-4 px-6 text-gray-500 dark:text-zinc-500 font-medium">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Delete Action */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 text-gray-400 dark:text-zinc-500 transition-colors"
                            title="Hapus Media"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
