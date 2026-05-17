'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, Loader2, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Check, Plus, BookOpen, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productSchema, ProductDto } from '@/types/product-dto';
import { productService } from '@/services/product.service';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | null;
  businessId: string;
  onSuccess: () => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  productId,
  businessId,
  onSuccess,
}: ProductFormModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Media Pustaka State
  const [isPustakaOpen, setIsPustakaOpen] = useState(false);
  const [pustakaMedia, setPustakaMedia] = useState<{ name: string; url: string }[]>([]);
  const [searchMedia, setSearchMedia] = useState('');
  const [pustakaTarget, setPustakaTarget] = useState<'main' | 'gallery' | null>(null);

  // Fetch Media Library items
  useEffect(() => {
    if (isOpen && businessId) {
      productService.getMedia(businessId)
        .then((media) => {
          setPustakaMedia(media || []);
        })
        .catch(console.error);
    }
  }, [isOpen, businessId]);

  const handleSelectFromPustaka = (url: string) => {
    if (pustakaTarget === 'main') {
      setValue('imageUrl', url, { shouldValidate: true });
      setImagePreview(url);
    } else if (pustakaTarget === 'gallery') {
      const updated = [...galleryPreviews, url];
      setGalleryPreviews(updated);
      setValue('images', updated, { shouldValidate: true });
    }
    setIsPustakaOpen(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductDto>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
      isActive: true,
      category: 'Makanan & Minuman',
      description: '',
      images: [],
    },
  });

  const watchCategory = watch('category');

  // Load product if editing
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setImagePreview(null);
      setGalleryPreviews([]);
      if (productId) {
        setIsFetching(true);
        productService
          .getById(businessId, productId)
          .then((product) => {
            reset({
              name: product.name,
              slug: product.slug,
              price: product.price,
              stock: product.stock,
              category: product.category || 'Makanan & Minuman',
              description: product.description || '',
              imageUrl: product.imageUrl || '',
              isActive: product.isActive,
              images: product.images || [],
            });
            if (product.imageUrl) {
              setImagePreview(product.imageUrl);
            }
            if (product.images) {
              setGalleryPreviews(product.images);
            }
          })
          .catch((err) => {
            console.error('Failed to load product', err);
            setError('Gagal memuat data produk.');
          })
          .finally(() => {
            setIsFetching(false);
          });
      } else {
        reset({
          name: '',
          slug: '',
          price: 0,
          stock: 0,
          category: 'Makanan & Minuman',
          description: '',
          imageUrl: '',
          isActive: true,
          images: [],
        });
        setGalleryPreviews([]);
      }
    }
  }, [isOpen, productId, businessId, reset]);

  // Handle Slug generation on name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    
    // Auto generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug, { shouldValidate: true });
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Quick local preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setIsUploading(true);
    setError(null);

    try {
      const response = await productService.uploadImage(businessId, file);
      setValue('imageUrl', response.url, { shouldValidate: true });
      setImagePreview(response.url); // Use the permanent backend uploaded URL
    } catch (err: unknown) {
      console.error('Image upload failed', err);
      let errMsg = 'Gagal mengunggah gambar.';
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.message || errMsg;
      }
      setError(errMsg);
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle gallery multiple image upload
  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const newUrls = [...galleryPreviews];

    try {
      for (let i = 0; i < files.length; i++) {
         const file = files[i];
         const response = await productService.uploadImage(businessId, file);
         newUrls.push(response.url);
      }
      setGalleryPreviews(newUrls);
      setValue('images', newUrls, { shouldValidate: true });
    } catch (err: unknown) {
      console.error('Gallery image upload failed', err);
      let errMsg = 'Gagal mengunggah gambar galeri.';
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.message || errMsg;
      }
      setError(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image from gallery list
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const updated = galleryPreviews.filter((_, idx) => idx !== indexToRemove);
    setGalleryPreviews(updated);
    setValue('images', updated, { shouldValidate: true });
  };

  // Submit product
  const onSubmit = async (data: ProductDto) => {
    setIsLoading(true);
    setError(null);
    try {
      if (productId) {
        await productService.update(businessId, productId, data);
      } else {
        await productService.create(businessId, data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal menyimpan produk.');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-[2rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {productId ? 'Edit Katalog' : 'Tambah Katalog'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Fetching Skeleton */}
        {isFetching ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-gray-400">Memuat data produk...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Image Upload & Gallery */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Main image upload card */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Gambar Utama</label>
                    <button
                      type="button"
                      onClick={() => {
                        setPustakaTarget('main');
                        setIsPustakaOpen(true);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="h-3 w-3" />
                      Pilih Pustaka
                    </button>
                  </div>
                  <div 
                    className={cn(
                      "relative aspect-square rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all",
                      imagePreview 
                        ? "border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900" 
                        : "border-gray-300 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-400 bg-gray-50/50 dark:bg-zinc-900/30"
                    )}
                  >
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center gap-2 transition-opacity animate-in fade-in duration-150">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-md"
                            title="Unggah Baru"
                          >
                            <Upload className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPustakaTarget('main');
                              setIsPustakaOpen(true);
                            }}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-amber-500 hover:scale-105 active:scale-95 transition-all shadow-md"
                            title="Pilih dari Pustaka"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setValue('imageUrl', '');
                            }}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-red-500 hover:scale-105 active:scale-95 transition-all shadow-md"
                            title="Hapus Gambar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md mx-auto">
                          <Upload className="h-6 w-6 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs font-black text-gray-900 dark:text-white">Pilih Sumber Gambar</p>
                          <p className="text-[10px] font-medium text-gray-400 dark:text-zinc-500">JPG, PNG atau WebP (Max 5MB)</p>
                        </div>
                        <div className="flex items-center gap-2 justify-center pt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-xl h-8 px-3 text-[10px] font-black uppercase tracking-wider bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-350 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all border border-gray-200 dark:border-zinc-700"
                          >
                            Unggah Baru
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPustakaTarget('main');
                              setIsPustakaOpen(true);
                            }}
                            className="rounded-xl h-8 px-3 text-[10px] font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-zinc-950 transition-all shadow-sm hover:shadow-amber-400/10"
                          >
                            Pustaka Media
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Upload spinner */}
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
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>

                {/* Additional gallery placeholders matching image */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Galeri Tambahan</label>
                    <button
                      type="button"
                      onClick={() => {
                        setPustakaTarget('gallery');
                        setIsPustakaOpen(true);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="h-3 w-3" />
                      Pilih Pustaka
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((index) => {
                      const url = galleryPreviews[index];
                      return (
                        <div 
                          key={index}
                          className="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-400 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-center overflow-hidden transition-all group"
                        >
                          {url ? (
                            <>
                              <img 
                                src={url} 
                                alt={`Galeri ${index + 1}`} 
                                className="h-full w-full object-cover" 
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(index)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div 
                              onClick={() => {
                                setPustakaTarget('gallery');
                                setIsPustakaOpen(true);
                              }}
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform gap-1"
                            >
                              <Plus className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                              <span className="text-[8px] font-black text-gray-400 dark:text-zinc-500">Pustaka</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <input 
                    type="file" 
                    ref={galleryInputRef}
                    onChange={handleGalleryChange}
                    accept="image/*"
                    multiple
                    className="hidden" 
                  />
                  <p className="text-[10px] font-bold text-center text-gray-400 dark:text-zinc-500 pt-2">
                    Mendukung unggah langsung dari Pustaka Media atau local upload.
                  </p>
                </div>
              </div>

              {/* Right Column: Editor Fields */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Catalog Name */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                    Nama Katalog <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: kacang"
                    {...register('name')}
                    onChange={handleNameChange}
                    className={cn(
                      "w-full h-11 px-4 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600",
                      errors.name ? "border-red-500" : "border-gray-200 dark:border-zinc-800"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name.message}</p>
                  )}
                </div>

                {/* Rich Editor Description Mock */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block">
                    Deskripsi
                  </label>
                  <div className="rounded-[1.25rem] border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 flex flex-col focus-within:ring-2 focus-within:ring-amber-500">
                    
                    {/* Visual formatting toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                      {[
                        { icon: Bold, label: 'Bold' },
                        { icon: Italic, label: 'Italic' },
                        { icon: Underline, label: 'Underline' }
                      ].map((tool, i) => (
                        <button 
                          key={i} 
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-850 text-gray-500 dark:text-zinc-400 transition-colors"
                        >
                          <tool.icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                      <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 mx-1" />
                      {[
                        { icon: List, label: 'Bullet' },
                        { icon: ListOrdered, label: 'Numbered' }
                      ].map((tool, i) => (
                        <button 
                          key={i} 
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-850 text-gray-500 dark:text-zinc-400 transition-colors"
                        >
                          <tool.icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                      <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 mx-1" />
                      {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
                        <button 
                          key={i} 
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-850 text-gray-500 dark:text-zinc-400 transition-colors"
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                      <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 mx-1" />
                      <button 
                        type="button" 
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-850 text-gray-500 dark:text-zinc-400 transition-colors"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <textarea
                      placeholder="kacang goreng"
                      {...register('description')}
                      rows={5}
                      className="w-full p-4 text-sm font-medium focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-650 resize-none"
                    />
                  </div>
                </div>

                {/* Price (Harga) & Button Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Harga
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-sm font-black text-gray-400 dark:text-zinc-500">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="12.000"
                        {...register('price')}
                        className={cn(
                          "w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400",
                          errors.price ? "border-red-500" : "border-gray-200 dark:border-zinc-800"
                        )}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-red-500 mt-1 font-semibold">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Teks Tombol
                    </label>
                    <select
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                    >
                      <option value="beli">Beli</option>
                      <option value="pesan">Pesan</option>
                      <option value="hubungi">Hubungi Kami</option>
                    </select>
                  </div>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                    >
                      <option value="Makanan & Minuman">Makanan & Minuman</option>
                      <option value="Pakaian">Pakaian</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Jasa & Layanan">Jasa & Layanan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Subkategori
                    </label>
                    <select
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                    >
                      <option value="">Pilih Subkategori...</option>
                      {watchCategory === 'Makanan & Minuman' && (
                        <>
                          <option value="camilan">Camilan</option>
                          <option value="makanan_berat">Makanan Berat</option>
                          <option value="minuman">Minuman</option>
                        </>
                      )}
                      {watchCategory === 'Pakaian' && (
                        <>
                          <option value="pria">Pria</option>
                          <option value="wanita">Wanita</option>
                          <option value="anak">Anak-Anak</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Link Tombol & Slug Field (Hidden or read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Link Tombol
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 block mb-1.5">
                      Slug Katalog (ID Otomatis)
                    </label>
                    <input
                      type="text"
                      {...register('slug')}
                      readOnly
                      className="w-full h-11 px-4 rounded-xl border border-gray-100 dark:border-zinc-850 text-sm font-mono text-gray-400 bg-gray-50 dark:bg-zinc-900/60 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Checkbox: Tampilkan produk ini aktif di website */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      {...register('isActive')}
                      className="peer h-5 w-5 rounded-md border border-gray-300 dark:border-zinc-800 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0 bg-white dark:bg-zinc-900 transition-all cursor-pointer appearance-none checked:bg-amber-400 checked:border-transparent"
                    />
                    <Check className="absolute h-3 w-3 text-zinc-950 font-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <label 
                    htmlFor="isActive" 
                    className="text-xs font-black uppercase tracking-wider text-gray-600 dark:text-zinc-400 cursor-pointer select-none"
                  >
                    Tampilkan aktif di halaman website toko
                  </label>
                </div>

              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-150 dark:border-zinc-900">
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
                Simpan
              </Button>
            </div>

          </form>
        )}

      {/* Media Pustaka Modal */}
      <AnimatePresence>
        {isPustakaOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl rounded-[2rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-805 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-500">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-905 dark:text-white">Pustaka Media</h3>
                    <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500">Pilih gambar yang pernah diunggah sebelumnya</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPustakaOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sub-header actions (Search & Direct Upload) */}
              <div className="px-8 py-4 border-b border-gray-150 dark:border-zinc-900/80 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari media..."
                    value={searchMedia}
                    onChange={(e) => setSearchMedia(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                </div>
                
                {/* Upload Button right inside Media Library */}
                <Button
                  type="button"
                  onClick={() => {
                    if (pustakaTarget === 'main') {
                      fileInputRef.current?.click();
                    } else {
                      galleryInputRef.current?.click();
                    }
                  }}
                  className="w-full sm:w-auto h-10 px-5 rounded-xl font-bold bg-amber-400 hover:bg-amber-505 text-zinc-955 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Upload className="h-4 w-4" />
                  Unggah Berkas Baru
                </Button>
              </div>

              {/* Content Grid */}
              <div className="flex-1 overflow-y-auto p-8">
                {pustakaMedia.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="h-16 w-16 rounded-[1.25rem] bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-gray-950 dark:text-white">Pustaka Media Kosong</p>
                      <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">Anda belum mengunggah gambar apa pun ke pustaka bisnis ini.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {/* Filtered media library list */}
                    {pustakaMedia
                      .filter((media) => media.name.toLowerCase().includes(searchMedia.toLowerCase()))
                      .map((media, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectFromPustaka(media.url)}
                          className="group relative aspect-square rounded-[1.25rem] border border-gray-150 dark:border-zinc-800/80 overflow-hidden cursor-pointer hover:border-amber-400 dark:hover:border-amber-400 bg-gray-50 dark:bg-zinc-900 transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                          <img
                            src={media.url}
                            alt={media.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-3 transition-opacity">
                            <span className="text-[10px] font-bold text-white truncate w-full bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                              {media.name}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
