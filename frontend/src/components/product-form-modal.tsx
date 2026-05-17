'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, ImageIcon, Loader2, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Check } from 'lucide-react';
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
  
  // Custom interactive mock gallery array
  const [galleryPlaceholders] = useState([1, 2, 3, 4]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    },
  });

  const watchCategory = watch('category');

  // Load product if editing
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setImagePreview(null);
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
            });
            if (product.imageUrl) {
              setImagePreview(product.imageUrl);
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
        });
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
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Gambar Utama</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative aspect-square rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all",
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
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="h-8 w-8 text-white animate-bounce" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md mx-auto">
                          <Upload className="h-6 w-6 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-gray-900 dark:text-white">Pilih Berkas</p>
                          <p className="text-[10px] font-medium text-gray-400 dark:text-zinc-500">JPG, PNG atau WebP (Max 5MB)</p>
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
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Galeri Tambahan</label>
                  <div className="grid grid-cols-4 gap-2">
                    {galleryPlaceholders.map((slot) => (
                      <div 
                        key={slot}
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-400 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                      >
                        <ImageIcon className="h-4 w-4 text-gray-300 dark:text-zinc-600" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-center text-gray-400 dark:text-zinc-500 pt-2">
                    Unggah gambar utama sebagai cover katalog Anda.
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

      </div>
    </div>
  );
}
