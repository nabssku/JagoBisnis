'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { Site } from '@/types/site';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Package, 
  ArrowLeft,
  Share2,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PublicProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const productId = params.productId as string;

  const [site, setSite] = useState<Site | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'spesifikasi'>('deskripsi');
  const [copied, setCopied] = useState(false);

  // Load site and products
  useEffect(() => {
    const fetchSiteAndProduct = async () => {
      try {
        const data = await siteService.getPublicSite(slug);
        setSite(data);
        const allProducts: Product[] = data.business?.Product || [];
        const found = allProducts.find(p => p.id === productId);
        
        if (found) {
          setProduct(found);
          setActiveImage(found.imageUrl || '');
          setOtherProducts(allProducts.filter(p => p.id !== productId && p.isActive).slice(0, 4));
        } else {
          setError('Produk tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memuat produk.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug && productId) {
      fetchSiteAndProduct();
    }
  }, [slug, productId]);

  // Combine cover image and additional gallery images safely
  const getAllImages = () => {
    if (!product) return [];
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list;
  };

  const imagesList = getAllImages();
  const activeIndex = imagesList.indexOf(activeImage);

  const handlePrevImage = () => {
    if (imagesList.length <= 1) return;
    const prevIndex = (activeIndex - 1 + imagesList.length) % imagesList.length;
    setActiveImage(imagesList[prevIndex]);
  };

  const handleNextImage = () => {
    if (imagesList.length <= 1) return;
    const nextIndex = (activeIndex + 1) % imagesList.length;
    setActiveImage(imagesList[nextIndex]);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Menyiapkan Detail Produk</h2>
            <p className="text-sm font-medium text-muted-foreground animate-pulse uppercase tracking-widest">Memuat Galeri & Deskripsi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="relative inline-block">
            <div className="text-9xl font-black text-gray-100 dark:text-zinc-900 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-20 w-20 text-primary opacity-20" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Produk Tidak Ditemukan</h2>
            <p className="text-muted-foreground font-medium leading-relaxed dark:text-zinc-400">
              Maaf, detail produk ini tidak tersedia atau telah dihapus oleh pemilik toko.
            </p>
          </div>
          <Button onClick={() => router.push(`/jagobisnis/${slug}`)} size="lg" className="rounded-2xl px-10 font-black h-14 shadow-xl shadow-primary/20">
            Kembali ke Toko
          </Button>
        </motion.div>
      </div>
    );
  }

  const { theme } = site;
  const businessPhone = site.business?.phone || '';
  const waMessage = `Halo! Saya tertarik membeli produk *${product.name}* seharga *Rp ${product.price.toLocaleString('id-ID')}* dari website ${site.title} Anda. Mohon info ketersediaan stok dan cara pemesanannya. Terima kasih!`;
  const waUrl = `https://wa.me/${businessPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div 
      className="min-h-screen selection:bg-primary selection:text-white bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white transition-colors duration-200"
      style={{ fontFamily: theme.font }}
    >
      {/* Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 flex justify-between items-center bg-white/85 dark:bg-[#0B0F19]/85 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/jagobisnis/${slug}`)}>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            {site.title}
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
          <Link href={`/jagobisnis/${slug}#hero`} className="hover:opacity-50 transition-all">Beranda</Link>
          <Link href={`/jagobisnis/${slug}#products`} className="hover:opacity-50 transition-all font-bold">Produk & Layanan</Link>
          <Link href={`/jagobisnis/${slug}#about`} className="hover:opacity-50 transition-all">Tentang Kami</Link>
          <Link href={`/jagobisnis/${slug}#contact`} className="hover:opacity-50 transition-all">Hubungi</Link>
        </div>
        <Button 
          onClick={() => window.open(waUrl, '_blank')}
          size="sm" 
          className="rounded-full px-6 font-bold" 
          style={{ backgroundColor: theme.primaryColor }}
        >
          Hubungi
        </Button>
      </motion.nav>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Breadcrumbs & Navigation Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400">
            <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => router.push(`/jagobisnis/${slug}`)}>Beranda</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => router.push(`/jagobisnis/${slug}#products`)}>Produk & Layanan</span>
            <span>&gt;</span>
            <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => router.push(`/jagobisnis/${slug}#products`)}
              className="flex h-10 px-4 items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-xs font-bold gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali
            </button>
          </div>
        </div>

        {/* Double-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Gallery & Main Image View */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            
            {/* Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div className="flex md:flex-col flex-row gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-hide py-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                      activeImage === img 
                        ? "border-primary shadow-md scale-95" 
                        : "border-gray-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
                    )}
                    style={{ borderColor: activeImage === img ? theme.primaryColor : undefined }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} thumb ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Preview Frame */}
            <div className="flex-1 order-1 md:order-2 relative aspect-[4/3] rounded-[2.5rem] bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 overflow-hidden shadow-sm group flex items-center justify-center">
              {activeImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={activeImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center opacity-20">
                  <Package className="h-20 w-20 mb-3" />
                  <span className="text-xs font-bold uppercase tracking-wider">No Image Available</span>
                </div>
              )}

              {/* Arrow Carousels */}
              {imagesList.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-zinc-700 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-zinc-700 transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900 dark:text-white" />
                  </button>
                </>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Info, Price, Actions & Description Tabs */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
            
            <div className="space-y-4">
              <span 
                className="inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest"
                style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}15` }}
              >
                {product.category || 'Makanan & Minuman'}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-gray-900 dark:text-white">
                {product.name}
              </h1>
            </div>

            {/* Price Box */}
            <div className="border-t border-b border-gray-100 dark:border-zinc-900 py-6 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block">HARGA</span>
              <div className="text-3xl font-black tracking-tighter" style={{ color: theme.primaryColor }}>
                Rp{product.price.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={() => window.open(waUrl, '_blank')}
              className="w-full h-14 rounded-2xl font-black text-base shadow-xl text-white transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 border-none shadow-emerald-200 dark:shadow-none"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              Beli Sekarang
              <ExternalLink className="h-4 w-4 opacity-80" />
            </Button>

            {/* Product description / specs TABS */}
            <div className="space-y-4 pt-4">
              <div className="flex border-b border-gray-100 dark:border-zinc-900">
                <button
                  onClick={() => setActiveTab('deskripsi')}
                  className={cn(
                    "pb-3 text-xs font-black uppercase tracking-widest transition-all relative px-1 mr-8",
                    activeTab === 'deskripsi' 
                      ? "text-gray-900 dark:text-white" 
                      : "text-gray-400 dark:text-zinc-500 hover:text-gray-600"
                  )}
                >
                  Deskripsi
                  {activeTab === 'deskripsi' && (
                    <motion.div 
                      layoutId="activeDetailTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5" 
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('spesifikasi')}
                  className={cn(
                    "pb-3 text-xs font-black uppercase tracking-widest transition-all relative px-1",
                    activeTab === 'spesifikasi' 
                      ? "text-gray-900 dark:text-white" 
                      : "text-gray-400 dark:text-zinc-500 hover:text-gray-600"
                  )}
                >
                  Spesifikasi
                  {activeTab === 'spesifikasi' && (
                    <motion.div 
                      layoutId="activeDetailTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5" 
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                  )}
                </button>
              </div>

              <div className="text-sm leading-relaxed text-gray-600 dark:text-zinc-300 font-medium whitespace-pre-line min-h-[100px]">
                {activeTab === 'deskripsi' ? (
                  product.description || 'Tidak ada deskripsi untuk produk ini.'
                ) : (
                  <div className="space-y-3 font-semibold">
                    <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-900/50">
                      <span className="text-gray-400">Kategori</span>
                      <span>{product.category || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-900/50">
                      <span className="text-gray-400">Status Stok</span>
                      <span className={cn(product.stock > 0 ? "text-green-500" : "text-amber-500")}>
                        {product.stock > 0 ? `Tersedia (${product.stock})` : 'Hubungi Penjual'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-400">Metode Pemesanan</span>
                      <span className="text-emerald-500 flex items-center gap-1.5">WhatsApp Checkout <CheckCircle className="h-3.5 w-3.5" /></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* OTHER PRODUCTS SECTION ("Produk Lainnya") */}
        {otherProducts.length > 0 && (
          <div className="pt-16 border-t border-gray-100 dark:border-zinc-900 space-y-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" style={{ color: theme.primaryColor }}>Rekomendasi</span>
              <h2 className="text-3xl font-black tracking-tight">Produk Lainnya</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {otherProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => router.push(`/jagobisnis/${slug}/product/${p.id}`)}
                  className="group cursor-pointer rounded-3xl bg-gray-50/50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800 p-4 hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-4 relative">
                    {p.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center opacity-20">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">{p.category}</span>
                    <h3 className="font-bold text-sm truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors" style={{ '--primary': theme.primaryColor } as any}>
                      {p.name}
                    </h3>
                    <div className="text-xs font-black tracking-tight" style={{ color: theme.primaryColor }}>
                      Rp{p.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-gray-100 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter">{site.title}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">© 2024 Semua Hak Dilindungi.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Platform Web Oleh</p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white text-[10px] font-black">JB</div>
              <span className="font-black text-lg tracking-tighter text-blue-600">JagoBisnis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
