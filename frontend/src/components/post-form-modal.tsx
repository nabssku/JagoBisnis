'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { 
  X, Upload, Loader2, Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link2, Check, Plus, 
  Eye, Search, Sparkles, BookOpen, AlertTriangle, FileText, Image as ImageIcon 
} from 'lucide-react';
import { CreatePostDto, UpdatePostDto } from '@/types/post-dto';
import { postService } from '@/services/post.service';
import { productService } from '@/services/product.service';
import { businessService } from '@/services/business.service';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Product } from '@/types/product';
import { Business } from '@/types/business';
import axios from 'axios';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string | null;
  businessId: string;
  onSuccess: () => void;
}

export function PostFormModal({
  isOpen,
  onClose,
  postId,
  businessId,
  onSuccess,
}: PostFormModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Media Pustaka Drawer state
  const [isPustakaOpen, setIsPustakaOpen] = useState(false);
  const [pustakaMedia, setPustakaMedia] = useState<{ name: string; url: string }[]>([]);
  const [pustakaTarget, setPustakaTarget] = useState<'cover' | 'gallery' | null>(null);
  
  // Selected Images Previews
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Rich Text Editor State helpers
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePostDto>({
    defaultValues: {
      title: '',
      slug: '',
      coverImage: '',
      images: [],
      focusKeyword: '',
      metaTitle: '',
      metaDescription: '',
      content: '',
      summary: '',
      ctaType: 'Tanpa Tombol',
      ctaValue: '',
      imageAlt: '',
      contentType: 'Artikel',
      status: 'Draft',
      isPinned: false,
      tags: [],
      relatedProductIds: [],
    },
  });

  const watchTitle = watch('title') || '';
  const watchSlug = watch('slug') || '';
  const watchFocusKeyword = watch('focusKeyword') || '';
  const watchMetaTitle = watch('metaTitle') || '';
  const watchMetaDescription = watch('metaDescription') || '';
  const watchContent = watch('content') || '';
  const watchImageAlt = watch('imageAlt') || '';
  const watchCtaType = watch('ctaType') || 'Tanpa Tombol';
  const watchTags = watch('tags') || [];
  const watchRelatedProductIds = watch('relatedProductIds') || [];

  // Fetch Business, Products, and Media
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setCoverPreview(null);
      setGalleryPreviews([]);
      
      // Load business details
      businessService.getById(businessId)
        .then(setBusiness)
        .catch(console.error);

      // Load products for selector
      productService.getAll(businessId)
        .then(setProducts)
        .catch(console.error);

      // Load media library assets
      productService.getMedia(businessId)
        .then(setPustakaMedia)
        .catch(console.error);

      if (postId) {
        setIsFetching(true);
        postService
          .getById(businessId, postId)
          .then((post) => {
            reset({
              title: post.title,
              slug: post.slug,
              coverImage: post.coverImage || '',
              images: post.images || [],
              focusKeyword: post.focusKeyword || '',
              metaTitle: post.metaTitle || '',
              metaDescription: post.metaDescription || '',
              content: post.content,
              summary: post.summary || '',
              ctaType: post.ctaType || 'Tanpa Tombol',
              ctaValue: post.ctaValue || '',
              imageAlt: post.imageAlt || '',
              contentType: post.contentType || 'Artikel',
              status: post.status || 'Draft',
              isPinned: post.isPinned || false,
              tags: post.tags || [],
              relatedProductIds: post.relatedProductIds || [],
            });
            if (post.coverImage) {
              setCoverPreview(post.coverImage);
            }
            if (post.images) {
              setGalleryPreviews(post.images);
            }
          })
          .catch((err) => {
            console.error('Failed to load post', err);
            setError('Gagal memuat data konten.');
          })
          .finally(() => {
            setIsFetching(false);
          });
      } else {
        reset({
          title: '',
          slug: '',
          coverImage: '',
          images: [],
          focusKeyword: '',
          metaTitle: '',
          metaDescription: '',
          content: '',
          summary: '',
          ctaType: 'Tanpa Tombol',
          ctaValue: '',
          imageAlt: '',
          contentType: 'Artikel',
          status: 'Draft',
          isPinned: false,
          tags: [],
          relatedProductIds: [],
        });
      }
    }
  }, [isOpen, postId, businessId, reset]);

  // Handle Slug generation on title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    
    // Auto generate slug
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', generatedSlug);
  };

  // Upload main image cover
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const localUrl = URL.createObjectURL(file);
    setCoverPreview(localUrl);
    setIsUploading(true);
    setError(null);

    try {
      const response = await productService.uploadImage(businessId, file);
      setValue('coverImage', response.url);
      setCoverPreview(response.url);
      
      // Refresh media library list
      const media = await productService.getMedia(businessId);
      setPustakaMedia(media);
    } catch (err) {
      console.error('Cover upload failed', err);
      setError('Gagal mengunggah cover.');
      setCoverPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Upload gallery multiple images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    const urls = [...galleryPreviews];

    try {
      for (let i = 0; i < files.length; i++) {
        if (urls.length >= 8) break;
        const file = files[i];
        const response = await productService.uploadImage(businessId, file);
        urls.push(response.url);
      }
      setGalleryPreviews(urls);
      setValue('images', urls);
      
      // Refresh media library list
      const media = await productService.getMedia(businessId);
      setPustakaMedia(media);
    } catch (err) {
      console.error('Gallery image upload failed', err);
      setError('Gagal mengunggah sebagian gambar galeri.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (index: number) => {
    const updated = galleryPreviews.filter((_, idx) => idx !== index);
    setGalleryPreviews(updated);
    setValue('images', updated);
  };

  // Open Pustaka Modal Drawer
  const openPustaka = (target: 'cover' | 'gallery') => {
    setPustakaTarget(target);
    setIsPustakaOpen(true);
  };

  // Select item from Media Pustaka list
  const handleSelectPustaka = (url: string) => {
    if (pustakaTarget === 'cover') {
      setValue('coverImage', url);
      setCoverPreview(url);
    } else if (pustakaTarget === 'gallery') {
      if (galleryPreviews.length < 8) {
        const updated = [...galleryPreviews, url];
        setGalleryPreviews(updated);
        setValue('images', updated);
      }
    }
    setIsPustakaOpen(false);
    setPustakaTarget(null);
  };

  // Format Text Editor helpers
  const insertText = (before: string, after: string = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    setValue('content', text.substring(0, start) + replacement + text.substring(end));
    
    // Put focus back
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  // Handlers for Tag input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = val.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setValue('tags', parsed.slice(0, 6)); // Cap at 6 tags
  };

  // Toggle related products
  const toggleProductRelation = (pId: string) => {
    const current = watchRelatedProductIds;
    if (current.includes(pId)) {
      setValue('relatedProductIds', current.filter(id => id !== pId));
    } else {
      setValue('relatedProductIds', [...current, pId]);
    }
  };

  // Submit Form
  const onSubmit = async (data: CreatePostDto) => {
    setIsLoading(true);
    setError(null);
    try {
      if (postId) {
        await postService.update(businessId, postId, data);
      } else {
        await postService.create(businessId, data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal menyimpan data konten.');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Dynamic SEO score calculation ---
  const calculateSeo = () => {
    let score = 0;
    const rules: { label: string; passed: boolean; critical: boolean }[] = [];

    // Rule 1: Keyword defined
    const hasKeyword = !!watchFocusKeyword.trim();
    rules.push({
      label: 'Frasa kunci fokus ditentukan',
      passed: hasKeyword,
      critical: true,
    });
    if (hasKeyword) score += 20;

    // Rule 2: Content Length
    const words = watchContent.trim().split(/\s+/).filter(w => w.length > 0);
    const meetsLength = words.length >= 100; // Let's set a reasonable 100 words minimum for local SEO
    rules.push({
      label: `Panjang konten (${words.length} kata, minimal 100 kata)`,
      passed: meetsLength,
      critical: false,
    });
    if (meetsLength) score += 20;

    // Rule 3: Keyword in Title
    const keywordInTitle = hasKeyword && watchTitle.toLowerCase().includes(watchFocusKeyword.toLowerCase());
    rules.push({
      label: 'Frasa kunci ditemukan di Judul Konten',
      passed: keywordInTitle,
      critical: false,
    });
    if (keywordInTitle) score += 15;

    // Rule 4: Keyword in Meta Description
    const keywordInMeta = hasKeyword && watchMetaDescription.toLowerCase().includes(watchFocusKeyword.toLowerCase());
    rules.push({
      label: 'Frasa kunci ditemukan di Meta Deskripsi',
      passed: keywordInMeta,
      critical: false,
    });
    if (keywordInMeta) score += 15;

    // Rule 5: Alt Text set
    const hasAlt = !!watchImageAlt.trim();
    rules.push({
      label: 'Teks Alt Gambar Cover ditentukan untuk SEO Gambar',
      passed: hasAlt,
      critical: false,
    });
    if (hasAlt) score += 15;

    // Rule 6: CTA Link
    const hasCta = watchCtaType !== 'Tanpa Tombol' && !!watch('ctaValue')?.trim();
    rules.push({
      label: 'Tautan aksi luar / CTA Hubungkan Pembaca dikonfigurasi',
      passed: hasCta,
      critical: false,
    });
    if (hasCta) score += 15;

    // Constrain score
    const finalScore = hasKeyword ? Math.min(score, 100) : Math.max(score - 40, 10);

    return { score: finalScore, rules };
  };

  const seoReport = calculateSeo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-7xl rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-150 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400/10 dark:bg-amber-400/5 flex items-center justify-center text-amber-500">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {postId ? 'Edit Artikel & Konten Blog' : 'Buat Artikel & Konten Blog'}
              </h2>
              <p className="text-xs font-bold text-gray-400 dark:text-zinc-500">
                Kelola dan optimalkan postingan blog untuk meningkatkan konversi dan SEO.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          {isFetching ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
              <p className="text-sm font-black text-gray-400 dark:text-zinc-500">Memuat data konten...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              {error && (
                <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                  {error}
                </div>
              )}

              {/* Main Content Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- Left Column: Media & Meta Configs --- */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Cover Image Upload & Media Library */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Gambar Cover Utama</label>
                    <div 
                      className={cn(
                        "relative aspect-[16/10] rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all",
                        coverPreview 
                          ? "border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900" 
                          : "border-gray-300 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30"
                      )}
                    >
                      {coverPreview ? (
                        <>
                          <img 
                            src={coverPreview} 
                            alt="Cover Preview" 
                            className="h-full w-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-3 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-white rounded-xl shadow-lg font-black text-xs transition-transform hover:scale-105"
                            >
                              Unggah Baru
                            </button>
                            <button
                              type="button"
                              onClick={() => openPustaka('cover')}
                              className="p-3 bg-amber-400 text-zinc-950 hover:bg-amber-500 rounded-xl shadow-lg font-black text-xs transition-transform hover:scale-105"
                            >
                              Dari Pustaka
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 space-y-3">
                          <div className="h-10 w-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mx-auto">
                            <Upload className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-black text-gray-900 dark:text-white">Pilih Cover</p>
                            <div className="flex gap-2 justify-center pt-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[10px] font-black uppercase text-amber-500 hover:underline"
                              >
                                Unggah File
                              </button>
                              <span className="text-[10px] text-gray-300">•</span>
                              <button
                                type="button"
                                onClick={() => openPustaka('cover')}
                                className="text-[10px] font-black uppercase text-amber-500 hover:underline"
                              >
                                Media Pustaka
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                          <span className="text-xs font-bold">Mengunggah...</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleCoverUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                  </div>

                  {/* Alt Text for Cover Image */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Alt Text Gambar Cover
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kacang goreng renyah kemasan premium"
                      {...register('imageAlt')}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                    />
                  </div>

                  {/* Additional Gallery Images */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Gambar Tambahan ({galleryPreviews.length}/8)</label>
                      <button
                        type="button"
                        onClick={() => openPustaka('gallery')}
                        className="text-[10px] font-black uppercase tracking-wider text-amber-500 hover:underline"
                      >
                        + Pustaka
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                        const url = galleryPreviews[index];
                        return (
                          <div 
                            key={index}
                            className="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-amber-400 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-center overflow-hidden transition-all group"
                          >
                            {url ? (
                              <>
                                <img 
                                  src={url} 
                                  alt={`Gallery Preview ${index + 1}`} 
                                  className="h-full w-full object-cover" 
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(index)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </>
                            ) : (
                              <div 
                                onClick={() => galleryInputRef.current?.click()}
                                className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              >
                                <Plus className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <input 
                      type="file" 
                      ref={galleryInputRef}
                      onChange={handleGalleryUpload}
                      accept="image/*"
                      multiple
                      className="hidden" 
                    />
                  </div>

                  {/* Content Meta Attributes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                        Tipe Konten
                      </label>
                      <select
                        {...register('contentType')}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                      >
                        <option value="Artikel">Artikel</option>
                        <option value="Pembaruan">Pembaruan</option>
                        <option value="Promo">Promo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                        Status Publikasi
                      </label>
                      <select
                        {...register('status')}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Publik">Publik</option>
                        <option value="Arsip">Arsip</option>
                      </select>
                    </div>
                  </div>

                  {/* Pinned Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        id="isPinned"
                        {...register('isPinned')}
                        className="peer h-5 w-5 rounded-md border border-gray-300 dark:border-zinc-800 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0 bg-white dark:bg-zinc-900 transition-all cursor-pointer appearance-none checked:bg-amber-400 checked:border-transparent"
                      />
                      <Check className="absolute h-3 w-3 text-zinc-950 font-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label 
                      htmlFor="isPinned" 
                      className="text-xs font-black uppercase tracking-wider text-gray-600 dark:text-zinc-400 cursor-pointer select-none"
                    >
                      Sematkan konten ini di paling atas
                    </label>
                  </div>

                  {/* Tags input */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Tag Konten (Maksimal 6, pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: kuliner, resep, kacang"
                      defaultValue={watchTags.join(', ')}
                      onChange={handleTagsChange}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {watchTags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-zinc-850 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-zinc-400 border border-gray-200/50 dark:border-zinc-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hubungkan Katalog Produk */}
                  <div className="space-y-2 border-t border-gray-100 dark:border-zinc-900 pt-4">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block">
                      Hubungkan Katalog Produk
                    </label>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold mb-2">
                      Pilih produk dari katalog yang relevan dengan artikel ini.
                    </p>
                    <div className="max-h-44 overflow-y-auto rounded-2xl border border-gray-100 dark:border-zinc-900 p-3 space-y-2 bg-gray-50/50 dark:bg-zinc-950/20">
                      {products.length === 0 ? (
                        <p className="text-[10px] font-bold text-gray-400 text-center py-4">Belum ada katalog produk</p>
                      ) : (
                        products.map((p) => {
                          const isLinked = watchRelatedProductIds.includes(p.id);
                          return (
                            <div 
                              key={p.id}
                              onClick={() => toggleProductRelation(p.id)}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border border-transparent select-none",
                                isLinked 
                                  ? "bg-amber-400/10 dark:bg-amber-400/5 border-amber-400/30 text-amber-500" 
                                  : "hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-300"
                              )}
                            >
                              <div className="relative flex items-center justify-center">
                                <div className={cn(
                                  "h-4 w-4 rounded border flex items-center justify-center transition-all",
                                  isLinked 
                                    ? "bg-amber-400 border-transparent" 
                                    : "border-gray-300 dark:border-zinc-700"
                                )}>
                                  {isLinked && <Check className="h-3 w-3 text-zinc-950 stroke-[3]" />}
                                </div>
                              </div>
                              <span className="text-xs font-bold truncate">{p.name}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                {/* --- Right Column: Content Editors & SEO Quality --- */}
                <div className="lg:col-span-8 space-y-5">
                  
                  {/* Judul Konten */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Judul Konten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 5 Rahasia Memilih Kacang Premium yang Renyah"
                      {...register('title', { required: true })}
                      onChange={handleTitleChange}
                      className={cn(
                        "w-full h-11 px-4 rounded-xl border text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-650",
                        errors.title ? "border-red-500" : "border-gray-200 dark:border-zinc-800"
                      )}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500 mt-1 font-semibold">Judul Konten wajib diisi.</p>
                    )}
                  </div>

                  {/* Slug & Live URL Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                        Link Slug (URL Kustom)
                      </label>
                      <input
                        type="text"
                        placeholder="slug-konten"
                        {...register('slug', { required: true })}
                        onChange={(e) => setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-mono text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                        Live Preview URL Halaman Publik
                      </label>
                      <div className="w-full h-11 px-4 rounded-xl border border-gray-100 dark:border-zinc-850 text-xs font-mono text-gray-400 bg-gray-50/50 dark:bg-zinc-900/60 flex items-center truncate">
                        /jagobisnis/{business?.slug || 'bisnis'}/posts/{watchSlug || 'slug'}
                      </div>
                    </div>
                  </div>

                  {/* SEO Keyword & Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-zinc-900 pt-4">
                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                        Frasa Kata Kunci Fokus
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: kacang premium"
                        {...register('focusKeyword')}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                          Meta Title Google Search
                        </label>
                        <span className={cn(
                          "text-[10px] font-bold",
                          watchMetaTitle.length > 60 ? "text-red-500" : "text-gray-400"
                        )}>
                          {watchMetaTitle.length}/60 Karakter
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Contoh: Jual Kacang Premium Renyah Organik"
                        maxLength={65}
                        {...register('metaTitle')}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                        Meta Description Google Search
                      </label>
                      <span className={cn(
                        "text-[10px] font-bold",
                        watchMetaDescription.length > 160 ? "text-red-500" : "text-gray-400"
                      )}>
                        {watchMetaDescription.length}/160 Karakter
                      </span>
                    </div>
                    <textarea
                      placeholder="Tulis ringkasan singkat untuk hasil pencarian Google..."
                      rows={2}
                      maxLength={170}
                      {...register('metaDescription')}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  {/* Isi Konten Rich Editor */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block">
                      Isi Konten Utama
                    </label>
                    <RichTextEditor
                      value={watch('content') || ''}
                      onChange={(value) => setValue('content', value, { shouldDirty: true, shouldValidate: true })}
                      placeholder="Tulis artikel atau berita pembaruan Anda secara rinci disini..."
                    />
                  </div>

                  {/* Ringkasan (Card Snippet) */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Ringkasan Singkat (Akan muncul di kartu grid blog)
                    </label>
                    <textarea
                      placeholder="Tulis ringkasan pemikat singkat untuk pembaca..."
                      rows={2}
                      {...register('summary')}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  {/* Tombol Aksi (CTA) Box */}
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-400/20 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Tombol Aksi Pembaca (CTA)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 block mb-1.5">
                          Pilihan Jenis Tombol
                        </label>
                        <select
                          {...register('ctaType')}
                          className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                        >
                          <option value="Tanpa Tombol">Tanpa Tombol</option>
                          <option value="Hubungi WA">Hubungi WhatsApp</option>
                          <option value="Link Kustom">Link Kustom</option>
                          <option value="Pesan Sekarang">Pesan Sekarang</option>
                        </select>
                      </div>

                      {watchCtaType !== 'Tanpa Tombol' && (
                        <div>
                          <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 block mb-1.5">
                            {watchCtaType === 'Hubungi WA' ? 'Nomor WhatsApp (Contoh: 6281234567)' : 'URL Tujuan (Contoh: https://...)'}
                          </label>
                          <input
                            type="text"
                            placeholder={watchCtaType === 'Hubungi WA' ? '628123456789' : 'https://tokopedia.com/...'}
                            {...register('ctaValue')}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* --- Bottom Row: Live Google Search Snippet & Dynamic SEO Scoring --- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-gray-100 dark:border-zinc-900 pt-6">
                
                {/* Live Google Search Preview */}
                <div className="lg:col-span-6 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                    <Search className="h-4 w-4" /> Google Search Preview Mockup
                  </h3>
                  <div className="p-6 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 shadow-lg space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        G
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 truncate leading-none">
                          https://temmu.id/jagobisnis/{business?.slug || 'bisnis'}/posts/{watchSlug || 'slug'}
                        </span>
                      </div>
                    </div>
                    <a 
                      href="#" 
                      className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline block leading-tight font-sans"
                    >
                      {watchMetaTitle.trim() || watchTitle || 'Silahkan tulis judul konten...'}
                    </a>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 font-sans leading-normal line-clamp-2">
                      {watchMetaDescription.trim() || 'Tulis meta deskripsi yang menarik untuk memikat pembaca melakukan klik dari hasil pencarian Google.'}
                    </p>
                  </div>
                </div>

                {/* Interactive Dynamic SEO Analysis Score */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" /> Analisis SEO & Kualitas Konten
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">Skor SEO:</span>
                      <span className={cn(
                        "text-sm font-black px-2.5 py-0.5 rounded-full",
                        seoReport.score >= 80 
                          ? "bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                          : seoReport.score >= 50 
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" 
                            : "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                      )}>
                        {seoReport.score}/100
                      </span>
                    </div>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 shadow-lg space-y-3.5 max-h-[160px] overflow-y-auto">
                    {seoReport.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className={cn(
                          "h-4 w-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0",
                          rule.passed 
                            ? "bg-green-500 text-white" 
                            : rule.critical 
                              ? "bg-red-500 text-white animate-pulse" 
                              : "bg-amber-400 text-zinc-950"
                        )}>
                          {rule.passed ? (
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          ) : (
                            <span className="text-[10px] font-black leading-none">!</span>
                          )}
                        </div>
                        <span className={cn(
                          "text-xs font-semibold leading-none pt-0.5",
                          rule.passed 
                            ? "text-gray-700 dark:text-zinc-300" 
                            : rule.critical 
                              ? "text-red-500 font-bold" 
                              : "text-gray-400 dark:text-zinc-500"
                        )}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Form Footer Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-150 dark:border-zinc-850">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="h-11 px-6 rounded-xl font-bold border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="h-11 px-8 rounded-xl font-black bg-amber-400 hover:bg-amber-500 text-zinc-950 shadow-lg hover:shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2"
                  isLoading={isLoading}
                >
                  {postId ? 'Simpan Perubahan' : 'Terbitkan Konten'}
                </Button>
              </div>

            </form>
          )}
        </div>

      </div>

      {/* --- Visual overlay Pustaka Modal Drawer --- */}
      {isPustakaOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-amber-500" /> Pustaka Media Usaha Anda
                </h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">
                  Gunakan kembali aset gambar yang pernah Anda unggah sebelumnya tanpa upload ulang.
                </p>
              </div>
              <button 
                onClick={() => setIsPustakaOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {pustakaMedia.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-3xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white">Pustaka Media Kosong</p>
                    <p className="text-[10px] font-medium text-gray-400 dark:text-zinc-500">Silahkan unggah berkas baru terlebih dahulu di atas.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {pustakaMedia.map((media, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSelectPustaka(media.url)}
                      className="relative aspect-square rounded-2xl border border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 overflow-hidden cursor-pointer group hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <img 
                        src={media.url} 
                        alt={media.name} 
                        className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-black uppercase text-zinc-950 bg-amber-400 px-2.5 py-1 rounded-full shadow-md">
                          Pilih
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-8 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/20 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsPustakaOpen(false)}
                className="h-10 px-5 rounded-xl font-bold border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300"
              >
                Tutup
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
