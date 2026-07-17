'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Package, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Globe, 
  Check, 
  Star, 
  Heart, 
  Shield, 
  Award, 
  Users, 
  Clock, 
  Smile, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  X,
  Calendar,
  Eye,
  Pin,
  FileText
} from 'lucide-react';
import { Section, SiteTheme } from '@/types/site';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { postService } from '@/services/post.service';
import { Post } from '@/types/post';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';

const stripHtml = (html?: string) => {
  if (!html) return '';
  // Convert HTML entities briefly like &amp; to &
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

interface SectionRendererProps {
  section: Section;
  theme: SiteTheme;
  products: Product[];
  index: number;
  siteTitle: string;
  onOrderProduct?: (product: Product) => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  section, 
  theme, 
  products, 
  index, 
  siteTitle,
  onOrderProduct
}) => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { content } = section;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  
  // Blog / Post states
  const [blogPosts, setBlogPosts] = useState<Post[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);

  useEffect(() => {
    if (section.type === 'blog') {
      setBlogLoading(true);
      const businessId = params?.id as string;
      const businessSlug = params?.slug as string;
      
      if (businessId) {
        // Builder view
        postService.getAll(businessId)
          .then((data) => {
            // Sort: pinned first, then date desc
            const sorted = [...data].sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setBlogPosts(sorted);
          })
          .catch((err) => console.error("Error fetching preview posts:", err))
          .finally(() => setBlogLoading(false));
      } else if (businessSlug) {
        // Public site view
        postService.getPublicPosts(businessSlug)
          .then((data) => {
            const sorted = [...data].sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setBlogPosts(sorted);
          })
          .catch((err) => console.error("Error fetching public posts:", err))
          .finally(() => setBlogLoading(false));
      } else {
        setBlogLoading(false);
      }
    }
  }, [section.type, params?.id, params?.slug]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Get active color style
  const buttonStyle = { backgroundColor: 'var(--primary-color)' };
  const textPrimaryStyle = { color: 'var(--primary-color)' };
  const borderPrimaryStyle = { borderColor: 'var(--primary-color)' };

  switch (section.type) {
    case 'hero':
      // Parse checklist buttons configurations
      const buttons = content.buttons || {
        custom: true,
        catalog: false,
        whatsapp: false,
        maps: false
      };
      
      const customUrl = content.buttonUrl || '#';
      const customText = content.buttonText || 'Pelajari Lebih Lanjut';
      const phoneClean = content.phone?.replace(/[^0-9]/g, '') || '';
      const waLink = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(content.whatsappText || 'Halo! Saya tertarik dengan produk Anda.')}` : '#';
      const mapsLink = content.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address)}` : '#';

      const hasBgImage = !!content.backgroundImage;

      return (
        <section 
          id={section.id} 
          className={cn(
            "py-24 px-6 text-center lg:py-36 relative overflow-hidden flex flex-col items-center justify-center transition-colors bg-cover bg-center bg-no-repeat",
            hasBgImage ? "min-h-[500px] lg:min-h-[600px]" : "bg-white dark:bg-[#0B0F19]"
          )}
          style={hasBgImage ? { backgroundImage: `url(${content.backgroundImage})` } : undefined}
        >
          {/* Overlay if background image exists */}
          {hasBgImage ? (
            <div className="absolute inset-0 bg-zinc-950/65 dark:bg-zinc-950/75 z-0" />
          ) : (
            /* Dynamic background element when there is no background image */
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.03, 0.07, 0.03]
                }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[130px]" 
                style={{ backgroundColor: theme.primaryColor }} 
              />
            </div>
          )}
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-6 relative z-10"
          >
            {hasBgImage ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                Bisnis Terpercaya
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: theme.primaryColor }}>
                <Sparkles className="h-3.5 w-3.5" />
                Bisnis Terpercaya
              </div>
            )}
            
            <h1 className={cn(
              "text-3xl font-black tracking-tight lg:text-5xl leading-tight text-balance transition-colors",
              hasBgImage ? "text-white" : "text-gray-900 dark:text-white"
            )}>
              <RichTextRenderer content={content.headline || 'Selamat Datang di Bisnis Kami'} isInline />
            </h1>
            
            <p className={cn(
              "text-sm lg:text-base font-medium max-w-xl mx-auto leading-relaxed text-balance transition-colors",
              hasBgImage ? "text-zinc-200" : "text-gray-700 dark:text-zinc-300 opacity-75"
            )}>
              <RichTextRenderer content={content.subheadline || 'Kami menyediakan produk dan layanan terbaik khusus untuk kebutuhan Anda.'} isInline />
            </p>
            
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              {buttons.custom && (
                <Button 
                  asChild
                  className="h-11 px-6 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:scale-95 text-white border-none"
                  style={buttonStyle}
                >
                  <a href={customUrl}>
                    <RichTextRenderer content={customText} isInline />
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              {buttons.catalog && (
                <Button 
                  variant="outline"
                  asChild
                  className={cn(
                    "h-11 px-6 rounded-xl font-bold text-sm hover:-translate-y-0.5 active:scale-95",
                    hasBgImage 
                      ? "border-white/20 hover:bg-white/10 text-white bg-transparent" 
                      : "border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200"
                  )}
                >
                  <a href={slug ? `/jagobisnis/${slug}#products` : '#products'}>
                    Lihat Katalog
                    <Package className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              {buttons.whatsapp && (
                <Button 
                  asChild
                  className="h-11 px-6 rounded-xl font-bold text-sm shadow-md bg-green-600 hover:bg-green-700 text-white transition-all hover:-translate-y-0.5 active:scale-95 border-none"
                >
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    Hubungi WhatsApp
                    <Phone className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              {buttons.maps && (
                <Button 
                  variant="outline"
                  asChild
                  className={cn(
                    "h-11 px-6 rounded-xl font-bold text-sm hover:-translate-y-0.5 active:scale-95",
                    hasBgImage 
                      ? "border-white/20 hover:bg-white/10 text-white bg-transparent" 
                      : "border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200"
                  )}
                >
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                    Petunjuk Peta
                    <MapPin className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </section>
      );

    case 'products':
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-gray-50/20 dark:bg-zinc-950/10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12"
            >
              <div className="space-y-3 text-left max-w-xl">
                <div className="h-1 w-12 rounded-full" style={buttonStyle} />
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white">
                  <RichTextRenderer content={content.title || 'Layanan & Produk Pilihan'} isInline />
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  Pilihan produk terbaik untuk menunjang kebutuhan Anda.
                </p>
              </div>
              <Button variant="outline" className="rounded-xl px-5 h-10 font-bold text-xs uppercase tracking-wider border text-gray-700 dark:text-zinc-300">
                Lihat Semua
              </Button>
            </motion.div>

            {content.showProducts !== false && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, i) => {
                  const productDetailUrl = slug ? `/jagobisnis/${slug}/product/${product.id}` : '#';
                  return (
                    <Link key={product.id} href={productDetailUrl} className="block h-full">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className="group flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900 border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                      >
                        <div className="aspect-[4/5] bg-muted dark:bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="flex flex-col items-center opacity-10">
                              <Package className="h-12 w-12 mb-3" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-center px-4">Katalog {siteTitle}</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider shadow-sm text-gray-800 dark:text-zinc-200">
                              {product.category || 'Terbaru'}
                            </div>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex-1 space-y-2">
                            <h3 className="font-bold text-base tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors" style={{ '--primary': theme.primaryColor } as any}>{product.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-medium">{stripHtml(product.description)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Harga</span>
                              <p className="font-extrabold text-base tracking-tight" style={textPrimaryStyle}>
                                Rp{product.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onOrderProduct) {
                                  onOrderProduct(product);
                                }
                              }}
                              className="h-8 px-3.5 rounded-xl font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-95 text-white transition-all border-none"
                              style={buttonStyle}
                            >
                              Pesan Sekarang
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center bg-muted/20 dark:bg-zinc-900/20 rounded-2xl border border-dashed border-border/50 flex flex-col items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm">
                  <Package className="h-6 w-6 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-muted-foreground">Katalog Masih Kosong</p>
                  <p className="text-xs font-medium text-muted-foreground/60 max-w-xs">Kembali lagi nanti untuk melihat penawaran produk terbaru kami.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      );

    case 'about': {
      const desc = content.description || 'Kami adalah sebuah toko baju yang melayani pada offline store dan online store pada Shopee dan Tokopedia dengan merek Onderstroom.\n\nKami berkomitmen untuk menyediakan pakaian yang nyaman, stylish, dan berkualitas tinggi untuk pelanggan kami.';
      const isHtml = desc.includes('<p>') || desc.includes('<br') || desc.includes('<strong>') || desc.includes('<ul>') || desc.includes('<ol>');
      const htmlContent = isHtml 
        ? desc 
        : desc.split('\n').map((p: string) => `<p>${p.trim()}</p>`).join('');
      const aboutImage = content.imageUrl || '';

      return (
        <section id={section.id} className="py-24 overflow-hidden bg-white dark:bg-zinc-950 transition-colors">
          <div className="container max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="order-2 md:order-1 space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  <RichTextRenderer content={content.title || 'Tentang Kami'} isInline />
                </h2>
                <div className="rich-text-content text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  <RichTextRenderer content={htmlContent} />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-1 md:order-2"
              >
                <div className="relative aspect-square w-full max-w-md mx-auto">
                  <div className="w-full h-full bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center p-4 shadow-sm border border-gray-150 dark:border-zinc-800/80 overflow-hidden">
                    {aboutImage ? (
                      <img src={aboutImage} alt={content.title || 'Tentang Kami'} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="140" className="fill-gray-200/30 dark:fill-zinc-800/30" />
                        <path d="M120,150 Q160,110 240,130 T300,220 Q320,290 230,300 T110,230 Q80,180 120,150 Z" className="fill-primary/5 dark:fill-amber-400/5" style={{ fill: `${theme.primaryColor}15` }} />
                        <path d="M80,310 L320,310" className="stroke-gray-200 dark:stroke-zinc-800" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="135" cy="130" r="15" className="fill-[#F0D5C6] dark:fill-[#DDA894]" />
                        <path d="M120,145 L115,280 C115,285 120,290 126,290 L144,290 C150,290 155,285 155,280 L150,145 Z" className="fill-amber-600/80 dark:fill-amber-500/70" />
                        <line x1="122" y1="205" x2="148" y2="205" className="stroke-amber-900/30 dark:stroke-zinc-900/30" strokeWidth="3" />
                        <path d="M130,290 L130,310 M140,290 L140,310" className="stroke-zinc-800 dark:stroke-zinc-400" strokeWidth="4.5" strokeLinecap="round" />
                        <circle cx="200" cy="115" r="16" className="fill-[#E6C2AC] dark:fill-[#D2A992]" />
                        <path d="M185,131 C180,140 180,160 182,180 L218,180 C220,160 220,140 215,131 Z" className="fill-primary dark:fill-amber-400/90" style={{ fill: theme.primaryColor }} />
                        <path d="M190,131 L200,148 L210,131" className="stroke-white/30 dark:stroke-zinc-950/20" strokeWidth="2" strokeLinecap="round" />
                        <path d="M188,180 L188,310 M212,180 L212,310" className="stroke-zinc-850 dark:stroke-zinc-300" strokeWidth="5.5" strokeLinecap="round" />
                        <path d="M182,310 L188,315 M206,310 L212,315" className="stroke-zinc-850 dark:stroke-zinc-300" strokeWidth="4.5" strokeLinecap="round" />
                        <circle cx="265" cy="125" r="15.5" className="fill-[#EAD2C6] dark:fill-[#CFA490]" />
                        <path d="M250,140 C248,150 248,180 252,215 L278,215 C282,180 282,150 280,140 Z" className="fill-zinc-700 dark:fill-zinc-450" />
                        <path d="M248,215 L238,285 C238,288 242,290 245,290 L285,290 C288,290 292,288 292,285 L282,215 Z" className="fill-zinc-400/90 dark:fill-zinc-600" />
                        <path d="M258,290 L258,310 M272,290 L272,310" className="stroke-zinc-800 dark:stroke-zinc-400" strokeWidth="4.5" strokeLinecap="round" />
                        <path d="M280,165 Q305,185 305,210" className="stroke-[#EAD2C6] dark:stroke-[#CFA490]" strokeWidth="4.5" strokeLinecap="round" />
                        <rect x="290" y="210" width="30" height="35" rx="3" className="fill-primary/80 dark:fill-amber-400/80" style={{ fill: `${theme.primaryColor}c0` }} />
                        <path d="M298,210 C298,202 312,202 312,210" className="stroke-primary/50 dark:stroke-amber-400/50" strokeWidth="2.5" style={{ stroke: `${theme.primaryColor}80` }} />
                        <path d="M100,90 L102,94 L106,95 L102,96 L100,100 L98,96 L94,95 L98,94 Z" className="fill-amber-400 dark:fill-amber-300" />
                        <path d="M305,100 L307,104 L311,105 L307,106 L305,110 L303,106 L299,105 L303,104 Z" className="fill-amber-400 dark:fill-amber-300" />
                        <path d="M325,270 L327,274 L331,275 L327,276 L325,280 L323,276 L319,275 L323,274 Z" className="fill-amber-400 dark:fill-amber-300" />
                      </svg>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      );
    }

    case 'gallery': {
      const galleryImages = (content.images || []).slice(0, 8);
      const galleryLayout = content.layoutStyle || 'grid';

      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <RichTextRenderer content={content.title || 'Galeri Bisnis'} isInline />
              </h2>
              {content.subtitle && (
                <p className="text-sm font-medium text-muted-foreground max-w-xl mx-auto">
                  <RichTextRenderer content={content.subtitle} isInline />
                </p>
              )}
            </div>

            {galleryImages.length > 0 ? (
              galleryLayout === 'carousel' ? (
                <div className="relative group">
                  <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth">
                    {galleryImages.map((imgUrl: string, idx: number) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveLightboxImage(imgUrl)}
                        className="w-[80vw] sm:w-[320px] shrink-0 aspect-[4/3] rounded-2xl overflow-hidden bg-muted dark:bg-zinc-900 border border-border/30 shadow-sm snap-center cursor-pointer"
                      >
                        <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : galleryLayout === 'bento' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[200px]">
                  {galleryImages.map((imgUrl: string, idx: number) => {
                    let gridClass = "aspect-square";
                    if (idx === 0) {
                      gridClass = "md:col-span-2 md:row-span-2 aspect-[1.4/1] md:aspect-auto h-full";
                    } else if (idx === 1) {
                      gridClass = "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto h-full";
                    } else if (idx === 2) {
                      gridClass = "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto h-full";
                    } else if (idx === 3) {
                      gridClass = "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto h-full";
                    } else if (idx === 4) {
                      gridClass = "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto h-full";
                    } else if (idx === 5) {
                      gridClass = "md:col-span-2 md:row-span-1 aspect-[2/1] md:aspect-auto h-full";
                    } else if (idx === 6) {
                      gridClass = "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto h-full";
                    } else if (idx === 7) {
                      gridClass = "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto h-full";
                    }
                    
                    return (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveLightboxImage(imgUrl)}
                        className={cn("bg-muted dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-border/20 group relative cursor-pointer", gridClass)}
                      >
                        <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((imgUrl: string, idx: number) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveLightboxImage(imgUrl)}
                      className="aspect-square bg-muted dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-border/40 cursor-pointer"
                    >
                      <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Globe className="h-8 w-8 text-muted-foreground/35" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {activeLightboxImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveLightboxImage(null)}
                className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
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
                  alt="Tampilan penuh galeri" 
                  className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/10"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      );
    }

    case 'logos': {
      const logoImages = content.images || [];
      const logoItems = content.items || ['Maju Bersama', 'Kemitraan UMKM', 'Kualitas Ekspor', 'Jago Kuliner'];
      const isMarquee = content.marquee !== false;

      return (
        <section id={section.id} className="py-10 px-6 bg-gray-50/60 dark:bg-zinc-900/30 border-y border-gray-100 dark:border-zinc-850 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            {isMarquee ? (
              <div className="relative w-full overflow-hidden flex flex-col gap-2">
                <div className="flex w-max gap-12 py-3 animate-marquee whitespace-nowrap">
                  {logoImages.length > 0 ? (
                    [...logoImages, ...logoImages].map((imgUrl: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="inline-flex items-center justify-center h-12 w-28 shrink-0 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-border/40 shadow-xs"
                      >
                        <img src={imgUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    ))
                  ) : (
                    [...logoItems, ...logoItems].map((logo: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-400 select-none bg-white dark:bg-zinc-900 px-5 py-2.5 rounded-xl border border-border/40 shadow-xs"
                      >
                        <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                        {logo}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-75 dark:opacity-90">
                {logoImages.length > 0 ? (
                  logoImages.map((imgUrl: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-center h-12 w-28 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-border/40 shadow-xs"
                    >
                      <img src={imgUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  ))
                ) : (
                  logoItems.map((logo: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-5 py-2.5 rounded-xl border border-border/40 shadow-xs"
                    >
                      <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                      {logo}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'stats': {
      const statsList = content.stats || [
        { value: '500+', label: 'Pelanggan Setia' },
        { value: '100%', label: 'Bahan Pilihan' },
        { value: '5★', label: 'Rating Rata-Rata' }
      ];
      
      const cols = content.cols || 3;
      const align = content.align || 'center';
      const themeBg = content.themeBg || 'muted';
      const title = content.title || '';
      const description = content.description || '';

      let bgStyleClass = "bg-gray-50/50 dark:bg-zinc-900/20";
      let textTitleClass = "text-gray-900 dark:text-white";
      let textDescClass = "text-muted-foreground";
      let statValStyle: React.CSSProperties = textPrimaryStyle;
      let statLblClass = "text-muted-foreground";
      let sectionStyle: React.CSSProperties = {};

      if (themeBg === 'white') {
        bgStyleClass = "bg-white dark:bg-zinc-950";
      } else if (themeBg === 'primary') {
        sectionStyle = {
          background: `linear-gradient(135deg, ${theme.primaryColor || '#2563eb'}dd, ${theme.primaryColor || '#2563eb'})`
        };
        textTitleClass = "text-white";
        textDescClass = "text-white/80";
        statValStyle = { color: '#ffffff' };
        statLblClass = "text-white/70";
      } else if (themeBg === 'dark') {
        bgStyleClass = "bg-zinc-950 text-white";
        textTitleClass = "text-white";
        textDescClass = "text-zinc-400";
        statValStyle = { color: theme.primaryColor || '#2563eb' };
        statLblClass = "text-zinc-400";
      }

      let colClass = "grid-cols-3";
      if (cols === 2) colClass = "grid-cols-2";
      else if (cols === 4) colClass = "grid-cols-2 md:grid-cols-4";

      let alignClass = "text-center";
      if (align === 'left') alignClass = "text-left";
      else if (align === 'right') alignClass = "text-right";

      return (
        <section id={section.id} className={cn("py-16 px-6 relative overflow-hidden transition-colors", bgStyleClass, alignClass)} style={sectionStyle}>
          <div className="max-w-5xl mx-auto space-y-10">
            {(title || description) && (
              <div className="space-y-3">
                {title && (
                  <h2 className={cn("text-2xl lg:text-3xl font-extrabold tracking-tight", textTitleClass)}>
                    <RichTextRenderer content={title} isInline />
                  </h2>
                )}
                {description && (
                  <p className={cn("text-sm max-w-xl mx-auto leading-relaxed font-medium", textDescClass)}>
                    <RichTextRenderer content={description} isInline />
                  </p>
                )}
              </div>
            )}

            <div className={cn("grid gap-8 items-center", colClass)}>
              {statsList.map((stat: any, idx: number) => (
                <div key={idx} className="space-y-1.5 p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/5 shadow-xs transition-transform hover:scale-[1.02]">
                  <p className="text-3xl md:text-4xl font-black tracking-tight" style={statValStyle}>
                    <RichTextRenderer content={stat.value || '0'} isInline />
                  </p>
                  <p className={cn("text-xs font-bold uppercase tracking-widest leading-normal", statLblClass)}>
                    <RichTextRenderer content={stat.label || ''} isInline />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'features-grid': {
      const rtTitle = content.rtTitle || 'Bahan Premium Pilihan';
      const rtDesc = content.rtDesc || 'Kami hanya menggunakan kualitas bahan terbaik pilihan dari pemasok terpercaya untuk menjamin keawetan dan kenyamanan maksimal.';
      const rtImage = content.rtImage || '';

      const rbTitle = content.rbTitle || 'Layanan Pengiriman Kilat';
      const rbDesc = content.rbDesc || 'Pengemasan rapi dan ekspedisi super cepat siap mengantarkan produk pesanan Anda dengan aman ke seluruh pelosok Indonesia.';
      const rbImage = content.rbImage || '';

      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          
          <div className="max-w-5xl mx-auto space-y-16">
            {content.title && (
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  <RichTextRenderer content={content.title} isInline />
                </h2>
              </div>
            )}

            <div className="flex flex-col gap-12 md:gap-20">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="space-y-4 text-left">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white font-extrabold text-sm" style={buttonStyle}>
                    1
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    <RichTextRenderer content={rtTitle} isInline />
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                    <RichTextRenderer content={rtDesc} isInline />
                  </p>
                </div>
                <div className="relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted dark:bg-zinc-900 border border-border/40 shadow-md">
                  {rtImage ? (
                    <img src={rtImage} alt="rtImage" className="w-full h-full object-cover transition-transform hover:scale-105 duration-555" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-900 text-center gap-2">
                      <Package className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gambar Kanan Atas</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="space-y-4 text-left">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white font-extrabold text-sm" style={buttonStyle}>
                    2
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    <RichTextRenderer content={rbTitle} isInline />
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                    <RichTextRenderer content={rbDesc} isInline />
                  </p>
                </div>
                <div className="relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted dark:bg-zinc-900 border border-border/40 shadow-md">
                  {rbImage ? (
                    <img src={rbImage} alt={rbTitle} className="w-full h-full object-cover transition-transform hover:scale-105 duration-555" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-900 text-center gap-2">
                      <Package className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gambar Kanan Bawah</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'features-cards': {
      const cardFeatures = content.cards || [
        { title: 'Paket Pemula', desc: 'Pilihan hemat untuk memulai kebutuhan esensial Anda.' },
        { title: 'Paket Bisnis', desc: 'Penawaran paling populer lengkap dengan dukungan ekstra.' },
        { title: 'Paket Premium', desc: 'Solusi lengkap tanpa batas untuk bisnis profesional.' }
      ];
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors">
          <div className="max-w-6xl mx-auto space-y-12 text-center">
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <RichTextRenderer content={content.title || 'Layanan Unggulan Kami'} isInline />
              </h2>
              {content.subtitle && (
                <p className="text-sm text-muted-foreground max-w-lg mx-auto font-medium">
                  <RichTextRenderer content={content.subtitle} isInline />
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cardFeatures.map((card: any, idx: number) => (
                <div key={idx} className="bg-gray-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-border/40 text-left space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                  <div className="space-y-4">
                    {card.imageUrl ? (
                      <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted dark:bg-zinc-900 border border-border/30 relative">
                        <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-800 shadow-xs group-hover:scale-110 transition-transform">
                        <Award className="h-6 w-6" style={textPrimaryStyle} />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white tracking-tight">
                        <RichTextRenderer content={card.title} isInline />
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        <RichTextRenderer content={card.desc} isInline />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'cta': {
      const ctaUrl = content.buttonUrl || '#';
      const ctaBtnText = content.buttonText || 'Mulai Sekarang';
      const ctaTitle = content.title || 'Siap Meningkatkan Bisnis Anda?';
      const ctaDesc = content.description || 'Bergabunglah sekarang dan rasakan kemudahan mengelola platform penjualan digital.';
      
      const themeBg = content.themeBg || 'primary';
      const buttonAction = content.buttonAction || 'whatsapp';
      
      let bgStyleClass = "bg-primary";
      let textTitleClass = "text-white";
      let textDescClass = "text-white/80";
      let btnStyle: React.CSSProperties = { backgroundColor: '#ffffff', color: theme.primaryColor || '#2563eb' };
      let sectionStyle: React.CSSProperties = {};

      if (themeBg === 'primary') {
        sectionStyle = {
          background: `linear-gradient(135deg, ${theme.primaryColor || '#2563eb'}dd, ${theme.primaryColor || '#2563eb'})`
        };
        btnStyle = { backgroundColor: '#ffffff', color: theme.primaryColor || '#2563eb' };
      } else if (themeBg === 'dark') {
        bgStyleClass = "bg-zinc-950 text-white";
        btnStyle = buttonStyle; 
      } else if (themeBg === 'amber') {
        bgStyleClass = "bg-gradient-to-tr from-amber-600 to-amber-500 text-white";
        btnStyle = { backgroundColor: '#ffffff', color: '#b45309' };
      } else if (themeBg === 'muted') {
        bgStyleClass = "bg-gray-50 dark:bg-zinc-900 border-y border-border/40 text-gray-900 dark:text-white";
        textTitleClass = "text-gray-900 dark:text-white";
        textDescClass = "text-muted-foreground";
        btnStyle = buttonStyle; 
      }

      let resolvedUrl = ctaUrl;
      if (buttonAction === 'whatsapp') {
        resolvedUrl = `https://wa.me/?text=${encodeURIComponent('Halo! Saya tertarik dengan penawaran Anda.')}`;
      } else if (buttonAction === 'catalog') {
        resolvedUrl = '#catalog';
      }

      return (
        <section id={section.id} className={cn("py-16 px-6 relative overflow-hidden transition-colors", bgStyleClass)} style={sectionStyle}>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-10 bg-white" />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
            <h2 className={cn("text-2xl md:text-3xl font-extrabold tracking-tight leading-tight", textTitleClass)}>
              <RichTextRenderer content={ctaTitle} isInline />
            </h2>
            {ctaDesc && (
              <p className={cn("text-xs md:text-sm max-w-md mx-auto leading-relaxed font-medium", textDescClass)}>
                <RichTextRenderer content={ctaDesc} isInline />
              </p>
            )}
            <div className="pt-4">
              <Button 
                asChild
                className="h-11 px-8 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 border-none"
                style={btnStyle}
              >
                <a href={resolvedUrl}>
                  <RichTextRenderer content={ctaBtnText} isInline />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      );
    }

    case 'faq':
      const faqList = content.faqs || [
        { q: 'Bagaimana cara melakukan pemesanan?', a: 'Sangat mudah! Pilih produk yang Anda inginkan dari katalog, klik tombol beli, lalu Anda akan langsung diarahkan untuk checkout otomatis via WhatsApp.' },
        { q: 'Apakah melayani pengiriman luar kota?', a: 'Ya, kami bekerja sama dengan berbagai ekspedisi terpercaya untuk mengirim produk dengan aman ke seluruh wilayah di Indonesia.' },
        { q: 'Apakah ada garansi jika produk rusak?', a: 'Tentu. Kepuasan pelanggan adalah prioritas kami. Hubungi CS WhatsApp kami maksimal 1x24 jam setelah barang sampai dengan menyertakan bukti video unboxing.' }
      ];
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-gray-50/30 dark:bg-zinc-950/20">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <RichTextRenderer content={content.title || 'Pertanyaan Umum (FAQ)'} isInline />
              </h2>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Hal yang paling sering ditanyakan pelanggan kami
              </p>
            </div>

            <div className="space-y-4">
              {faqList.map((faq: any, idx: number) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-border/50 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm transition-all"
                  >
                    <button 
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-bold text-sm text-gray-900 dark:text-white focus:outline-none"
                    >
                      <span><RichTextRenderer content={faq.q} isInline /></span>
                      <div className="text-muted-foreground">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/30 dark:border-zinc-800">
                            <RichTextRenderer content={faq.a} isInline />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case 'contact': {
      const waLinkContact = `https://wa.me/${content.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.whatsappText || 'Halo! Saya ingin menghubungi Anda.')}`;
      const mapUrl = content.mapUrl || '';
      
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden transition-colors">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-5xl mx-auto space-y-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="rounded-2xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden" 
              style={buttonStyle}
            >
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-none">
                      <RichTextRenderer content={content.title || 'Hubungi Kami'} isInline />
                    </h2>
                    <p className="text-sm lg:text-base font-medium opacity-80 leading-relaxed max-w-md">Kami siap melayani Anda. Hubungi kami kapan saja melalui saluran berikut.</p>
                  </div>

                  <div className="space-y-6">
                    {content.phone && (
                      <div className="flex items-center gap-4 group">
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md transition-all group-hover:scale-105">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] uppercase font-bold tracking-widest opacity-60">Hubungi Langsung</p>
                          <p className="text-lg lg:text-xl font-bold tracking-tight">{content.phone}</p>
                        </div>
                      </div>
                    )}
                    {content.address && (
                      <div className="flex items-center gap-4 group">
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md transition-all group-hover:scale-105">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] uppercase font-bold tracking-widest opacity-60">Lokasi Kantor</p>
                          <p className="text-sm lg:text-base font-bold leading-tight">{content.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl rounded-xl p-6 lg:p-8 border border-white/20 shadow-lg flex flex-col items-center text-center gap-6 max-w-sm mx-auto w-full">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <MessageSquare className="h-6 w-6" style={textPrimaryStyle} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold tracking-tight">Kirim Pesan</h3>
                    <p className="text-xs opacity-75 leading-relaxed">Respon cepat melalui asisten WhatsApp kami yang tersedia 24/7.</p>
                  </div>
                  <Button 
                    asChild
                    className="w-full h-10 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-all hover:scale-[1.01] shadow-md border-none"
                  >
                    <a href={waLinkContact} target="_blank" rel="noopener noreferrer">
                      Buka WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>

            {mapUrl && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border border-border/40 bg-muted dark:bg-zinc-900 shadow-md relative"
              >
                <iframe 
                  src={mapUrl} 
                  className="absolute inset-0 w-full h-full border-none"
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            )}
          </div>
        </section>
      );
    }

    case 'blog': {
      const blogTitle = content.title || 'Artikel & Pembaruan';
      const blogSubtitle = content.subtitle || 'Ikuti kisah terbaru, wawasan edukatif, dan promosi eksklusif dari kami.';
      const blogLayout = content.layout || 'grid';
      const maxPosts = content.maxPosts || 3;
      const typeFilter = content.postTypeFilter || 'Semua';

      // Client filtering of posts
      let filtered = blogPosts;
      
      // Filter by status (only 'Publik' on public side, show all in builder to allow dynamic editing feedback)
      if (!params?.id) {
        filtered = filtered.filter(p => p.status === 'Publik');
      }

      if (typeFilter !== 'Semua') {
        filtered = filtered.filter(p => p.contentType === typeFilter);
      }

      const visiblePosts = filtered.slice(0, maxPosts);

      // Category color mapping
      const getCategoryBadgeClass = (type: string) => {
        switch (type) {
          case 'Promo':
            return "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400";
          case 'Artikel':
            return "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400";
          case 'Pembaruan':
          default:
            return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
        }
      };

      return (
        <section id={section.id} className="py-20 px-6 lg:py-28 bg-white dark:bg-[#0B0F19] transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-6xl mx-auto space-y-16 relative z-10">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: theme.primaryColor }}>
                <FileText className="h-3.5 w-3.5" />
                Blog Usaha Kami
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                <RichTextRenderer content={blogTitle} isInline />
              </h2>
              {blogSubtitle && (
                <p className="text-xs md:text-sm font-medium text-muted-foreground leading-relaxed">
                  <RichTextRenderer content={blogSubtitle} isInline />
                </p>
              )}
            </div>

            {/* Content Renderers */}
            {blogLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl border border-border/30 overflow-hidden space-y-4 p-4 animate-pulse bg-muted/10">
                    <div className="aspect-[16/10] bg-gray-250 dark:bg-zinc-800 rounded-xl" />
                    <div className="h-4 w-1/3 bg-gray-250 dark:bg-zinc-800 rounded" />
                    <div className="h-6 w-3/4 bg-gray-250 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-full bg-gray-250 dark:bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            ) : visiblePosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50/50 dark:bg-zinc-900/30 rounded-3xl border border-border/30 max-w-xl mx-auto space-y-3">
                <p className="text-sm font-black text-gray-700 dark:text-zinc-300">Belum ada konten diterbitkan</p>
                <p className="text-xs text-muted-foreground font-semibold px-6">
                  {params?.id 
                    ? "Saran: Masuk ke tab 'Konten' di dashboard Anda dan buat artikel pertama dengan status Publik untuk menampilkannya di sini." 
                    : "Ikuti terus perkembangan kami untuk mendapatkan update menarik berikutnya."
                  }
                </p>
              </div>
            ) : blogLayout === 'bento' ? (
              /* Bento Layout */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {visiblePosts.map((post, idx) => {
                  // Determine block properties in bento grid
                  let cardClass = "";
                  let isLarge = false;

                  if (idx === 0) {
                    cardClass = "md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[524px] flex flex-col justify-end p-6 md:p-8 relative overflow-hidden group border border-border/40 hover:border-amber-400 rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300";
                    isLarge = true;
                  } else if (idx === 1) {
                    cardClass = "md:col-span-1 md:row-span-2 min-h-[320px] md:min-h-[524px] flex flex-col justify-between p-6 overflow-hidden group border border-border/40 hover:border-amber-400 bg-white dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300";
                  } else {
                    cardClass = "md:col-span-1 md:row-span-1 min-h-[220px] md:min-h-[250px] flex flex-col justify-between p-5 overflow-hidden group border border-border/40 hover:border-amber-400 bg-white dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300";
                  }

                  if (isLarge) {
                    return (
                      <motion.div
                        key={post.id}
                        whileHover={{ y: -6 }}
                        onClick={() => {
                          if (slug) {
                            router.push(`/jagobisnis/${slug}/posts/${post.slug}`);
                          }
                        }}
                        className={cardClass}
                      >
                        {/* Hero Image as Background */}
                        {post.coverImage ? (
                          <>
                            <img 
                              src={post.coverImage} 
                              alt={post.imageAlt || post.title} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-zinc-900 flex items-center justify-center text-xs font-black text-white/20 uppercase">
                            No Cover
                          </div>
                        )}

                        {/* Badges top right */}
                        <div className="absolute top-5 right-5 flex gap-2 z-20">
                          {post.isPinned && (
                            <div className="bg-amber-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                              <Pin className="h-3.5 w-3.5 fill-current" />
                            </div>
                          )}
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm",
                            getCategoryBadgeClass(post.contentType)
                          )}>
                            {post.contentType}
                          </span>
                        </div>

                        {/* Content overlapping the hero image */}
                        <div className="relative z-10 space-y-3.5 text-white max-w-xl">
                          <div className="flex items-center gap-3.5 text-[9px] font-extrabold uppercase tracking-wider text-white/70">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views || 0} Dilihat
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-extrabold text-xl md:text-2xl tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                              {post.title}
                            </h3>
                            {post.summary && (
                              <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-medium">
                                {post.summary}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors">
                            <span>Baca Selengkapnya</span>
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  const showImage = !!post.coverImage;
                  return (
                    <motion.div
                      key={post.id}
                      whileHover={{ y: -6 }}
                      onClick={() => {
                        if (slug) {
                          router.push(`/jagobisnis/${slug}/posts/${post.slug}`);
                        }
                      }}
                      className={cardClass}
                    >
                      {idx === 1 ? (
                        <div className="space-y-4 flex flex-col h-full justify-between">
                          <div className="space-y-4">
                            {showImage ? (
                              <div className="aspect-[16/10] w-full overflow-hidden bg-muted dark:bg-zinc-800 rounded-2xl relative border border-border/10">
                                <img 
                                  src={post.coverImage} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                              </div>
                            ) : (
                              <div className="aspect-[16/10] w-full bg-gray-50 dark:bg-zinc-800/20 rounded-2xl flex items-center justify-center text-[9px] font-black text-muted-foreground/30 uppercase">
                                No Cover
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                                <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider", getCategoryBadgeClass(post.contentType))}>
                                  {post.contentType}
                                </span>
                              </div>
                              <h3 className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors">
                                {post.title}
                              </h3>
                              {post.summary && (
                                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                  {post.summary}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-border/10 flex items-center justify-between text-xs font-black text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors shrink-0">
                            <span>Baca Selengkapnya</span>
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-between h-full space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
                              <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider", getCategoryBadgeClass(post.contentType))}>
                                {post.contentType}
                              </span>
                            </div>
                            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors">
                              {post.title}
                            </h3>
                            {post.summary && (
                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                                {post.summary}
                              </p>
                            )}
                          </div>
                          
                          <div className="pt-2 border-t border-border/10 flex items-center justify-between text-[11px] font-black text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors shrink-0">
                            <span>Baca Selengkapnya</span>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : blogLayout === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {visiblePosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -6 }}
                    onClick={() => {
                      if (slug) {
                        router.push(`/jagobisnis/${slug}/posts/${post.slug}`);
                      }
                    }}
                    className="group border border-border/40 hover:border-amber-400 dark:hover:border-amber-400 bg-white dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                  >
                    {/* Cover image & Category badge */}
                    <div className="aspect-[16/10] overflow-hidden bg-muted dark:bg-zinc-800 relative border-b border-border/10 shrink-0">
                      {post.coverImage ? (
                        <img 
                          src={post.coverImage} 
                          alt={post.imageAlt || post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-black text-muted-foreground/30 dark:text-zinc-700 uppercase">
                          No Cover
                        </div>
                      )}
                      
                      {/* Pinned badge */}
                      {post.isPinned && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                          <Pin className="h-3.5 w-3.5 fill-current" />
                        </div>
                      )}

                      {/* Content type badge */}
                      <span className={cn(
                        "absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm",
                        getCategoryBadgeClass(post.contentType)
                      )}>
                        {post.contentType}
                      </span>
                    </div>

                    {/* Excerpt Body */}
                    <div className="p-5 flex flex-col flex-grow space-y-3">
                      {/* Meta info */}
                      <div className="flex items-center gap-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views || 0} Dilihat
                        </span>
                      </div>

                      {/* Title & summary */}
                      <div className="space-y-2 flex-grow">
                        <h3 className="font-black text-base text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors">
                          {post.title}
                        </h3>
                        {post.summary && (
                          <p className="text-xs font-medium text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.summary}
                          </p>
                        )}
                      </div>

                      {/* Action text */}
                      <div className="pt-3 border-t border-border/10 flex items-center justify-between text-xs font-black text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Table Layout */
              <div className="space-y-4 max-w-4xl mx-auto">
                {visiblePosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      if (slug) {
                        router.push(`/jagobisnis/${slug}/posts/${post.slug}`);
                      }
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-amber-400 bg-white dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    {/* Compact cover */}
                    <div className="h-14 w-20 overflow-hidden rounded-xl border border-border/10 bg-muted dark:bg-zinc-800 shrink-0">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] font-black text-muted-foreground/35">No Photo</div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="flex-grow min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                        {post.isPinned && (
                          <span className="text-amber-500 inline-flex items-center">
                            <Pin className="h-3 w-3 fill-current mr-0.5" /> PIN
                          </span>
                        )}
                        <span className={cn("px-1.5 py-0.5 rounded", getCategoryBadgeClass(post.contentType))}>
                          {post.contentType}
                        </span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 className="font-black text-sm text-gray-900 dark:text-white line-clamp-1 leading-tight group-hover:text-amber-500 transition-colors">
                        {post.title}
                      </h3>
                    </div>

                    {/* Read action */}
                    <div className="flex items-center gap-3 text-xs font-black text-gray-900 dark:text-white group-hover:text-amber-500 shrink-0">
                      <span className="hidden sm:inline">Baca</span>
                      <div className="h-8 w-8 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center border border-border/20 shadow-sm group-hover:bg-amber-400 group-hover:text-white group-hover:border-transparent transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>



        </section>
      );
    }

    case 'footer':
      const copyright = content.copyright || `© 2026 Semua Hak Dilindungi. ${siteTitle || 'UMKM JagoBisnis'}.`;
      const desc = content.description || 'Partner UMKM terbaik untuk kemudahan bisnis digital Anda.';
      const hasSocials = !!(content.instagram || content.facebook || content.twitter);
      
      return (
        <footer id={section.id} className="py-12 px-6 border-t border-border/40 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20 text-center">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-base font-black tracking-tight text-gray-900 dark:text-white">{siteTitle || 'UMKM JagoBisnis'}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-medium">{desc}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none pt-1">{copyright}</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3.5">
              {hasSocials && (
                <div className="flex items-center gap-3">
                  {content.instagram && (
                    <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="h-8.5 w-8.5 rounded-xl bg-white dark:bg-zinc-900 border border-border/55 flex items-center justify-center text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </a>
                  )}
                  {content.facebook && (
                    <a href={content.facebook} target="_blank" rel="noopener noreferrer" className="h-8.5 w-8.5 rounded-xl bg-white dark:bg-zinc-900 border border-border/55 flex items-center justify-center text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                  )}
                  {content.twitter && (
                    <a href={content.twitter} target="_blank" rel="noopener noreferrer" className="h-8.5 w-8.5 rounded-xl bg-white dark:bg-zinc-900 border border-border/55 flex items-center justify-center text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
              
              <div className="flex flex-col items-center md:items-end gap-1.5 pt-1 border-t border-border/10 dark:border-zinc-800/40 w-full">
                <p className="text-[8px] font-extrabold text-muted-foreground/60 uppercase tracking-widest leading-none">Dibuat Dengan Platform</p>
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-85 transition-opacity">
                  <div className="h-5 w-5 rounded-lg bg-primary flex items-center justify-center text-white text-[9px] font-black shadow-sm" style={{ backgroundColor: theme.primaryColor }}>JB</div>
                  <span className="font-extrabold text-xs tracking-tight text-blue-600 dark:text-blue-400">JagoBisnis</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      );

    default:
      return null;
  }
};
