'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Activity,
  Send,
  Upload,
  Image as ImageIcon,
  Check,
  Search,
  Plus,
  BookOpen,
  HelpCircle,
  Sparkles,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  User,
  Clock,
  Globe2,
  Trash2,
  RefreshCw,
  X
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
import { socialPublishingService } from '@/services/social-publishing.service';
import { productService } from '@/services/product.service';
import { businessService } from '@/services/business.service';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateSocialPostPage() {
  const params = useParams();
  const router = useRouter();
  
  const businessId = params.id as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form Fields
  const [provider, setProvider] = useState<'INSTAGRAM' | 'THREADS'>('INSTAGRAM');
  const [content, setContent] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  
  // Media Pustaka State
  const [isPustakaOpen, setIsPustakaOpen] = useState(false);
  const [pustakaMedia, setPustakaMedia] = useState<{ name: string; url: string }[]>([]);
  const [searchMedia, setSearchMedia] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load Business
    businessService.getById(businessId)
      .then(setBusiness)
      .catch(console.error);

    // Load Media Library
    productService.getMedia(businessId)
      .then(setPustakaMedia)
      .catch(console.error);
  }, [businessId]);

  // Handle direct file upload to Pustaka Media
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    try {
      const res = await productService.uploadImage(businessId, file);
      setSelectedMediaUrl(res.url);
      toast.success('Gambar berhasil diunggah ke Pustaka Media!');
      
      // Refresh media pustaka list
      const media = await productService.getMedia(businessId);
      setPustakaMedia(media);
    } catch (error) {
      toast.error('Gagal mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit and create draft post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Harap tulis isi postingan.');
      return;
    }

    if (provider === 'INSTAGRAM' && !selectedMediaUrl) {
      toast.error('Instagram mewajibkan minimal satu media gambar atau video.');
      return;
    }

    setIsSaving(true);
    try {
      await socialPublishingService.create(businessId, {
        provider,
        content,
        mediaType: selectedMediaUrl ? 'IMAGE' : 'TEXT',
        mediaUrls: selectedMediaUrl ? [selectedMediaUrl] : [],
      });
      toast.success('Draf postingan berhasil dibuat!');
      router.push(`/dashboard/business/${businessId}/social-posts`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan postingan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Word limits based on provider
  const getCharLimit = () => (provider === 'INSTAGRAM' ? 2200 : 500);
  const isOverLimit = content.length > getCharLimit();

  // Filter media in library
  const filteredMedia = pustakaMedia.filter((m) =>
    m.name.toLowerCase().includes(searchMedia.toLowerCase())
  );

  return (
    <DashboardShell businessId={businessId}>
      <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/business/${businessId}/social-posts`}>
            <Button
              variant="outline"
              className="rounded-xl h-10 w-10 p-0 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Buat Postingan Baru</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Rancang postingan draf menarik untuk jejaring sosial JagoBisnis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Composer (Lefthand Column) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] p-6 shadow-sm">
              
              {/* Provider Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Penerbitan</label>
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Instagram Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setProvider('INSTAGRAM');
                      setSelectedMediaUrl(''); // Reset or force image
                    }}
                    className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all ${
                      provider === 'INSTAGRAM'
                        ? 'border-pink-400 bg-pink-50/20 dark:bg-pink-950/10 text-pink-600 dark:text-pink-400 shadow-sm'
                        : 'border-gray-200 dark:border-zinc-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <InstagramIcon className="h-6 w-6" />
                    <span className="text-xs font-black">Instagram Business</span>
                  </button>

                  {/* Threads Option */}
                  <button
                    type="button"
                    onClick={() => setProvider('THREADS')}
                    className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all ${
                      provider === 'THREADS'
                        ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white shadow-sm'
                        : 'border-gray-200 dark:border-zinc-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <Activity className="h-6 w-6" />
                    <span className="text-xs font-black">Threads</span>
                  </button>

                </div>
              </div>

              {/* Media Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Lampiran Media {provider === 'INSTAGRAM' && <span className="text-red-500">* Wajib</span>}
                </label>
                
                {selectedMediaUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedMediaUrl} alt="Selected Media" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setSelectedMediaUrl('')}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Select from Pustaka */}
                    <button
                      type="button"
                      onClick={() => setIsPustakaOpen(true)}
                      className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:border-amber-400 dark:hover:border-zinc-700 transition-all min-h-[140px]"
                    >
                      <BookOpen className="h-6 w-6 text-amber-500" />
                      <span className="text-xs font-black">Pilih dari Pustaka</span>
                    </button>

                    {/* Upload New Image */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:border-amber-400 dark:hover:border-zinc-700 transition-all min-h-[140px]"
                    >
                      {isUploading ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500"></div>
                      ) : (
                        <Upload className="h-6 w-6 text-teal-600" />
                      )}
                      <span className="text-xs font-black">{isUploading ? 'Mengunggah...' : 'Unggah File Baru'}</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Text Area Content */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Caption Postingan</label>
                  <span className={`text-[10px] font-black ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                    {content.length}/{getCharLimit()} karakter
                  </span>
                </div>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    provider === 'INSTAGRAM'
                      ? 'Tulis caption Instagram Anda di sini... Sertakan tagar menarik untuk meningkatkan performa bisnis!'
                      : 'Apa yang sedang terjadi di usaha Anda? Bagikan ke jejaring Threads...'
                  }
                  rows={6}
                  className={`w-full rounded-2xl border ${
                    isOverLimit ? 'border-red-400' : 'border-gray-200'
                  } dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-zinc-700 placeholder:text-gray-400 transition-colors font-medium`}
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-50 dark:border-zinc-900 flex justify-end gap-3">
                <Link href={`/dashboard/business/${businessId}/social-posts`}>
                  <Button variant="ghost" className="rounded-xl font-bold">
                    Batal
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSaving || isOverLimit}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black px-6 shadow-sm"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan ke Draf'}
                </Button>
              </div>

            </form>
          </div>

          {/* Real-time Phone Mock Preview (Righthand Column) */}
          <div className="lg:col-span-5 flex justify-center sticky top-28">
            <div className="w-full max-w-[340px] rounded-[48px] border-8 border-gray-900 dark:border-zinc-800 bg-[#F3F4F6] dark:bg-zinc-950 aspect-[9/18] overflow-hidden shadow-2xl relative flex flex-col">
              
              {/* iPhone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 dark:bg-zinc-800 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-16 h-3 bg-black rounded-full"></div>
              </div>

              {/* Top Platform Custom Header */}
              <div className={`pt-8 pb-3 px-4 flex items-center justify-between text-xs font-black shadow-sm ${
                provider === 'INSTAGRAM'
                  ? 'bg-white dark:bg-zinc-900 border-b text-gray-900 dark:text-white'
                  : 'bg-zinc-900 text-white'
              }`}>
                <div className="flex items-center gap-1.5">
                  {provider === 'INSTAGRAM' ? (
                    <>
                      <InstagramIcon className="h-4.5 w-4.5 text-pink-600 dark:text-pink-400" />
                      <span>Instagram Preview</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-4.5 w-4.5 text-white" />
                      <span>Threads Preview</span>
                    </>
                  )}
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
              </div>

              {/* Mock Body Container */}
              <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 scrollbar-hide text-xs">
                
                {/* 1. INSTAGRAM FEED PREVIEW */}
                {provider === 'INSTAGRAM' ? (
                  <div className="space-y-3 p-3">
                    
                    {/* User Header */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-sm">
                        <div className="h-full w-full rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-gray-900 dark:text-white">
                          {business?.name?.charAt(0).toUpperCase() || 'J'}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 dark:text-white text-[11px]">{business?.name || 'My Business'}</span>
                        <span className="text-[9px] text-gray-400">Sponsor / Unggahan JagoBisnis</span>
                      </div>
                    </div>

                    {/* Image Box */}
                    <div className="rounded-xl overflow-hidden aspect-square bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-300">
                      {selectedMediaUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selectedMediaUrl} alt="Instagram media attachment" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400">Wajib sertakan media</span>
                        </div>
                      )}
                    </div>

                    {/* Instagram Interactions Bar */}
                    <div className="flex items-center justify-between text-gray-600 dark:text-zinc-300 py-1">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 hover:text-red-500 cursor-pointer transition-colors" />
                        <MessageCircle className="h-5 w-5" />
                        <Send className="h-5 w-5" />
                      </div>
                      <Bookmark className="h-5 w-5" />
                    </div>

                    {/* Likes & Caption Text */}
                    <div className="space-y-1">
                      <span className="font-bold text-[10px] text-gray-900 dark:text-white">12,482 likes</span>
                      <p className="text-gray-800 dark:text-zinc-300 leading-relaxed font-medium">
                        <span className="font-black text-gray-900 dark:text-white mr-1.5">{business?.name || 'my_business'}</span>
                        {content || 'Isi caption akan terender secara dinamis di sini saat Anda mengetik...'}
                      </p>
                    </div>

                  </div>
                ) : (
                  // 2. THREADS FEED PREVIEW
                  <div className="p-4 space-y-4">
                    
                    <div className="flex gap-3">
                      {/* Left Column Avatar */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-gray-700 dark:text-zinc-300 font-black text-xs shadow-sm">
                          {business?.name?.charAt(0).toUpperCase() || 'J'}
                        </div>
                        <div className="w-0.5 flex-1 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                      </div>

                      {/* Right Column Body */}
                      <div className="flex-1 space-y-2">
                        
                        {/* Header Username */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-black text-gray-900 dark:text-white">{business?.name || 'my_business'}</span>
                          <span className="text-[10px] text-gray-400">1m</span>
                        </div>

                        {/* Content text */}
                        <p className="text-gray-800 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-line text-[11px]">
                          {content || 'Isi tulisan postingan Threads Anda akan langsung muncul di sini secara real-time...'}
                        </p>

                        {/* Image attachment if exists */}
                        {selectedMediaUrl && (
                          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 aspect-video bg-gray-50 dark:bg-zinc-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedMediaUrl} alt="Threads media attachment" className="h-full w-full object-cover" />
                          </div>
                        )}

                        {/* Interactions Icon Bar */}
                        <div className="flex items-center gap-4 text-gray-400 dark:text-zinc-500 py-1.5">
                          <Heart className="h-4 w-4 hover:text-red-500 transition-colors cursor-pointer" />
                          <MessageCircle className="h-4 w-4" />
                          <RefreshCw className="h-4 w-4" />
                          <Send className="h-4 w-4" />
                        </div>

                        <div className="text-[10px] text-gray-400">
                          1 reply · 4 likes
                        </div>

                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

        {/* MEDIA PUSTAKA DRAWER / MODAL */}
        <AnimatePresence>
          {isPustakaOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPustakaOpen(false)}
                className="absolute inset-0 bg-black/60"
              />

              {/* Box */}
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0E131F] p-6 shadow-2xl flex flex-col max-h-[80vh]"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-zinc-900 shrink-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-500" />
                    <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Pustaka Media</span>
                  </div>
                  <button
                    onClick={() => setIsPustakaOpen(false)}
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Library Search */}
                <div className="relative my-4 shrink-0">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchMedia}
                    onChange={(e) => setSearchMedia(e.target.value)}
                    placeholder="Cari gambar di pustaka..."
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 pl-10 pr-4 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Media grid */}
                <div className="flex-1 overflow-y-auto py-2">
                  {filteredMedia.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400">
                      Tidak ada file gambar ditemukan di pustaka media.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {filteredMedia.map((media) => (
                        <div
                          key={media.url}
                          onClick={() => {
                            setSelectedMediaUrl(media.url);
                            setIsPustakaOpen(false);
                          }}
                          className={`group relative rounded-2xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                            selectedMediaUrl === media.url
                              ? 'border-amber-400 scale-[0.98] shadow-sm shadow-amber-300'
                              : 'border-gray-100 dark:border-zinc-900 hover:border-gray-300'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={media.url} alt={media.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] font-black text-white px-2 py-1 bg-black/60 rounded-lg">Pilih Gambar</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-zinc-900 flex justify-end shrink-0">
                  <Button
                    onClick={() => setIsPustakaOpen(false)}
                    variant="outline"
                    className="rounded-xl font-bold text-xs"
                  >
                    Tutup Pustaka
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardShell>
  );
}
