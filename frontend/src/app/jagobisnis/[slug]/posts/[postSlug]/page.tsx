'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { postService } from '@/services/post.service';
import { Site } from '@/types/site';
import { Post } from '@/types/post';
import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Package, 
  ArrowLeft,
  Share2,
  CheckCircle,
  ExternalLink,
  Store,
  Coffee,
  ShoppingBag,
  Laptop,
  Heart,
  Sparkles,
  Award,
  Smile,
  Calendar,
  Eye,
  BookOpen,
  X,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';

export default function PublicPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const postSlug = params.postSlug as string;

  const [site, setSite] = useState<Site | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [otherPosts, setOtherPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load site, post, and other recommendations
  useEffect(() => {
    const fetchSiteAndPost = async () => {
      try {
        // 1. Fetch main site config
        const siteData = await siteService.getPublicSite(slug);
        setSite(siteData);
        setProducts(siteData.business?.Product || []);

        // 2. Fetch the specific post detail (which automatically increments view count)
        const postData = await postService.getPublicPostBySlug(slug, postSlug);
        setPost(postData);

        // 3. Fetch all other public posts for recommendations
        const allPosts = await postService.getPublicPosts(slug);
        setOtherPosts(allPosts.filter(p => p.slug !== postSlug && p.status === 'Publik').slice(0, 4));
        
      } catch (err) {
        console.error('Error fetching post data:', err);
        setError('Artikel tidak ditemukan atau gagah dimuat.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug && postSlug) {
      fetchSiteAndPost();
    }
  }, [slug, postSlug]);

  // Update page title on data load
  useEffect(() => {
    if (post && site) {
      document.title = post.metaTitle || `${post.title} - ${site.title}`;
    }
  }, [post, site]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryBadgeClass = (type: string) => {
    switch (type) {
      case 'Promo':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'Pembaruan':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Artikel':
      default:
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
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
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Menyiapkan Bacaan Anda</h2>
            <p className="text-sm font-medium text-muted-foreground animate-pulse uppercase tracking-widest">Memuat Konten & Optimasi SEO...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site || !post) {
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
              <BookOpen className="h-20 w-20 text-primary opacity-20" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Artikel Tidak Ditemukan</h2>
            <p className="text-muted-foreground font-medium leading-relaxed dark:text-zinc-400">
              Maaf, konten artikel ini tidak tersedia, diarsipkan, atau telah dihapus oleh pemilik toko.
            </p>
          </div>
          <Button onClick={() => router.push(`/jagobisnis/${slug}`)} size="lg" className="rounded-2xl px-10 font-black h-14 shadow-xl shadow-primary/20">
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    );
  }

  const { theme } = site;
  const businessPhone = site.business?.phone || '';
  const waContactUrl = `https://wa.me/${businessPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Halo! Saya membaca artikel "' + post.title + '" di website Anda dan ingin berdiskusi lebih lanjut.')}`;

  return (
    <div 
      className="min-h-screen selection:bg-primary selection:text-white bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white transition-colors duration-200"
      style={{ fontFamily: theme.font }}
    >

      {/* Header */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="py-3.5 px-6 flex justify-between items-center bg-white/85 dark:bg-zinc-950/85 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push(`/jagobisnis/${slug}`)}>
          {(() => {
            if (theme.logoUrl) {
              return <img src={theme.logoUrl} alt={site.title} className="h-8 max-w-[140px] object-contain rounded" />;
            }
            const iconMap: Record<string, React.ComponentType<any>> = {
              globe: Globe,
              store: Store,
              coffee: Coffee,
              'shopping-bag': ShoppingBag,
              laptop: Laptop,
              heart: Heart,
              sparkles: Sparkles,
              award: Award,
              smile: Smile
            };
            const SelectedIcon = theme.logoIcon && iconMap[theme.logoIcon] ? iconMap[theme.logoIcon] : Globe;
            return (
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                <SelectedIcon className="h-4 w-4" />
              </div>
            );
          })()}
          <span className="text-base font-black tracking-tight" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-bold tracking-wider uppercase">
          {site.sections.sort((a, b) => a.order - b.order).map(s => {
            const getSectionLabel = (type: string, id: string) => {
              const lowerId = id.toLowerCase();
              if (lowerId.includes('hero')) return 'Beranda';
              if (lowerId.includes('about')) return 'Tentang Kami';
              if (lowerId.includes('feature')) return 'Keunggulan';
              if (lowerId.includes('faq')) return 'FAQ';
              if (lowerId.includes('contact')) return 'Kontak';
              if (lowerId.includes('cta')) return 'Promo';

              switch (type) {
                case 'hero': return 'Beranda';
                case 'about': return 'Tentang Kami';
                case 'products': return 'Katalog';
                case 'gallery': return 'Galeri';
                case 'faq': return 'FAQ';
                case 'contact': return 'Kontak';
                default: return type.replace('-', ' ');
              }
            };
            return (
              <Link 
                key={s.id} 
                href={`/jagobisnis/${slug}#${s.id}`} 
                className="hover:opacity-75 transition-all relative group" 
                style={{ color: theme.textColor }}
              >
                {getSectionLabel(s.type, s.id)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: theme.primaryColor }} />
              </Link>
            );
          })}
        </div>
        <Button 
          onClick={() => window.open(waContactUrl, '_blank')}
          size="sm" 
          className="rounded-xl px-5 h-9 font-bold text-white text-xs border-none shadow-sm hover:scale-[1.01] transition-transform active:scale-95 animate-pulse" 
          style={{ backgroundColor: theme.primaryColor }}
        >
          Hubungi Kami
        </Button>
      </motion.nav>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Breadcrumbs & Navigation Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400">
            <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => router.push(`/jagobisnis/${slug}`)}>Beranda</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => router.push(`/jagobisnis/${slug}#blog`)}>Artikel & Pembaruan</span>
            <span>&gt;</span>
            <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{post.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-gray-600 dark:text-zinc-300"
              title="Salin Tautan Halaman"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
            </button>
            <button 
              onClick={() => router.push(`/jagobisnis/${slug}#blog`)}
              className="flex h-9 px-3 items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-xs font-bold gap-1.5 text-gray-600 dark:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali
            </button>
          </div>
        </div>

        {/* Double-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Main Blog Post Contents (lg:col-span-8) */}
          <article className="lg:col-span-8 space-y-6">
            
            {/* Header info */}
            <div className="space-y-4">
              <span className={cn("inline-block rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-wider", getCategoryBadgeClass(post.contentType))}>
                {post.contentType}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
                {post.title}
              </h1>
              
              {/* Stats & Dates */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground border-b border-gray-150 dark:border-zinc-850 pb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="hidden sm:inline text-gray-300 dark:text-zinc-800">•</span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-gray-400" />
                  {post.views || 0} Kali Dibaca
                </span>
              </div>
            </div>

            {/* Main Cover Image */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-center">
              {post.coverImage ? (
                <img 
                  src={post.coverImage} 
                  alt={post.imageAlt || post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]" 
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center opacity-25">
                  <FileText className="h-14 w-14 mb-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cover Image Not Configured</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="text-base text-gray-800 dark:text-zinc-200 leading-relaxed font-medium pt-2">
              {(() => {
                const isHtml = post.content.includes('<p>') || post.content.includes('<br') || post.content.includes('<strong>') || post.content.includes('<ul>') || post.content.includes('<ol>');
                const htmlContent = isHtml 
                  ? post.content 
                  : post.content.split('\n').map((p: string) => `<p>${p.trim()}</p>`).join('');
                return <RichTextRenderer content={htmlContent} />;
              })()}
            </div>

            {/* Additional Photo Gallery Grid */}
            {post.images && post.images.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-zinc-900/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">Foto & Lampiran Artikel</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {post.images.map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveLightboxImage(img)}
                      className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-150 dark:border-zinc-800 bg-gray-55 dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                      <img src={img} alt={`Tambahan ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100 dark:border-zinc-900/60">
                {post.tags.map((tag: string, i: number) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-850 px-3 py-1 rounded-xl"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Call To Action (CTA) Button */}
            {post.ctaType && post.ctaType !== 'Tanpa Tombol' && post.ctaType !== 'None' && (
              <div className="pt-8 flex justify-start">
                {post.ctaType === 'Hubungi Wa' || post.ctaType === 'WhatsApp' ? (
                  <Button
                    onClick={() => window.open(waContactUrl, '_blank')}
                    className="h-12 w-full sm:w-auto px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-550/15 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all border-none"
                  >
                    <MessageSquare className="h-4 w-4 fill-current" />
                    Hubungi via WhatsApp
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.open(post.ctaValue || '#', '_blank')}
                    className="h-12 w-full sm:w-auto px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/15 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all border-none"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {post.ctaType === 'Pesan Sekarang' ? 'Pesan Sekarang' : 'Buka Tautan Kustom'}
                  </Button>
                )}
              </div>
            )}

          </article>

          {/* RIGHT COLUMN: Sidebar (lg:col-span-4) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Connected Related Product Card */}
            {post.relatedProductIds && post.relatedProductIds[0] && (
              (() => {
                const relProductId = post.relatedProductIds[0];
                const relProd = products.find(p => p.id === relProductId);
                if (!relProd) return null;
                return (
                  <div className="p-5 rounded-3xl bg-amber-400/5 dark:bg-amber-400/3 border border-amber-400/20 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-500">
                      <Package className="h-4 w-4" />
                      Produk Terkait Artikel Ini
                    </div>
                    
                    <div className="group cursor-pointer rounded-2xl bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-3 hover:border-amber-400 dark:hover:border-amber-400 transition-all shadow-xs hover:shadow-md">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted dark:bg-zinc-850 mb-3 relative">
                        {relProd.imageUrl || (relProd.images && relProd.images[0]) ? (
                          <img 
                            src={relProd.imageUrl || relProd.images[0]} 
                            alt={relProd.name} 
                            className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-20">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1.5 px-1 flex flex-col justify-start">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                          {relProd.category || 'Pilihan Utama'}
                        </span>
                        <h3 className="font-extrabold text-xs text-gray-900 dark:text-zinc-100 line-clamp-1">
                          {relProd.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 font-medium">
                          {relProd.description}
                        </p>
                        <div className="text-xs font-black tracking-tight pt-1 text-amber-500">
                          Rp {relProd.price.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <Button 
                        onClick={() => router.push(`/jagobisnis/${slug}/product/${relProd.id}`)}
                        className="w-full h-9 rounded-xl font-bold text-[10px] shadow-sm text-white mt-3 border-none flex items-center justify-center gap-1.5 transition-all"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        Beli & Lihat Detail
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Recommendations Widget (Other Articles) */}
            {otherPosts.length > 0 && (
              <div className="p-6 rounded-3xl bg-gray-50/40 dark:bg-zinc-950/20 border border-gray-150 dark:border-zinc-900 space-y-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground" style={{ color: theme.primaryColor }}>Rekomendasi</span>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">Artikel Terbaru Lainnya</h3>
                </div>
                
                <div className="space-y-4">
                  {otherPosts.map((otherPost) => (
                    <div 
                      key={otherPost.id}
                      onClick={() => router.push(`/jagobisnis/${slug}/posts/${otherPost.slug}`)}
                      className="flex items-center gap-3 group cursor-pointer border-b border-gray-100 dark:border-zinc-900 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="h-12 w-16 overflow-hidden rounded-lg bg-muted dark:bg-zinc-800 shrink-0 border border-border/10">
                        {otherPost.coverImage ? (
                          <img src={otherPost.coverImage} alt={otherPost.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] font-black text-muted-foreground/35">No Cover</div>
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0 space-y-0.5">
                        <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-500" style={{ color: theme.primaryColor }}>
                          {otherPost.contentType}
                        </span>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-1" style={{ '--primary': theme.primaryColor } as any}>
                          {otherPost.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] font-semibold text-gray-400 dark:text-zinc-500">
                          <span>{new Date(otherPost.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                          <span>•</span>
                          <span>{otherPost.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-150 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-lg font-bold tracking-tight">{site.title}</h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">© 2024 Semua Hak Dilindungi.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Platform Web Oleh</p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary flex items-center justify-center text-white text-[8px] font-black">JB</div>
              <span className="font-bold text-sm tracking-tighter text-blue-600">JagoBisnis</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Full-Screen Lightbox Zoom Overlay */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 bg-black/95 z-[100000] flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-6 right-6 h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={activeLightboxImage}
              alt="Zoom detail gambar"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
