'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
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
  ExternalLink 
} from 'lucide-react';
import { Section, SiteTheme } from '@/types/site';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SectionRendererProps {
  section: Section;
  theme: SiteTheme;
  products: Product[];
  index: number;
  siteTitle: string;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  section, 
  theme, 
  products, 
  index, 
  siteTitle 
}) => {
  const params = useParams();
  const slug = params?.slug as string;
  const { content } = section;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Get active color style
  const buttonStyle = { backgroundColor: theme.primaryColor };
  const textPrimaryStyle = { color: theme.primaryColor };
  const borderPrimaryStyle = { borderColor: theme.primaryColor };

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

      return (
        <section id={section.id} className="py-20 px-6 text-center lg:py-28 relative overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-[#0B0F19] transition-colors">
          {/* Dynamic background element */}
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
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: theme.primaryColor }}>
              <Sparkles className="h-3.5 w-3.5" />
              Bisnis Terpercaya
            </div>
            
            <h1 className="text-3xl font-black tracking-tight lg:text-5xl leading-tight text-balance text-gray-900 dark:text-white">
              {content.headline || 'Selamat Datang di Bisnis Kami'}
            </h1>
            
            <p className="text-sm lg:text-base font-medium opacity-75 max-w-xl mx-auto leading-relaxed text-balance text-gray-700 dark:text-zinc-300">
              {content.subheadline || 'Kami menyediakan produk dan layanan terbaik khusus untuk kebutuhan Anda.'}
            </p>

            {/* Render Background Image Preview (if provided) */}
            {content.backgroundImage && (
              <div className="my-8 max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md aspect-[16/9] border border-gray-100 dark:border-zinc-800">
                <img src={content.backgroundImage} alt="Background Preview" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              {buttons.custom && (
                <Button 
                  asChild
                  className="h-11 px-6 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:scale-95 text-white"
                  style={buttonStyle}
                >
                  <a href={customUrl}>
                    {customText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              {buttons.catalog && (
                <Button 
                  variant="outline"
                  asChild
                  className="h-11 px-6 rounded-xl font-bold text-sm border-gray-200 dark:border-zinc-800 hover:-translate-y-0.5 active:scale-95 text-gray-700 dark:text-zinc-200"
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
                  className="h-11 px-6 rounded-xl font-bold text-sm shadow-md bg-green-600 hover:bg-green-700 text-white transition-all hover:-translate-y-0.5 active:scale-95"
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
                  className="h-11 px-6 rounded-xl font-bold text-sm border-gray-200 dark:border-zinc-800 hover:-translate-y-0.5 active:scale-95 text-gray-700 dark:text-zinc-200"
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
                  {content.title || 'Layanan & Produk Pilihan'}
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
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-medium">{product.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Harga</span>
                              <p className="font-extrabold text-base tracking-tight" style={textPrimaryStyle}>
                                Rp{product.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Button size="icon" className="h-8 w-8 rounded-lg shadow-sm transition-all hover:translate-x-0.5 active:scale-90 text-white" style={buttonStyle}>
                              <ChevronRight className="h-4 w-4" />
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

    case 'about':
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-gray-50/50 dark:bg-zinc-900/10 transition-colors">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={buttonStyle}>
                Tentang Kami
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
                {content.title || 'Misi Utama Bisnis Kami'}
              </h2>
              <p className="text-sm lg:text-base opacity-75 leading-relaxed whitespace-pre-wrap font-medium text-gray-700 dark:text-zinc-300">
                {content.description || 'Kami bertekad menyajikan produk berstandar tinggi yang mendukung kegiatan UMKM dan pengembangan bisnis di Indonesia.'}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { label: 'Kualitas', value: 'Premium' },
                  { label: 'Layanan', value: 'Terpercaya' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1 border-l-4 pl-4" style={borderPrimaryStyle}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-square bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-md ring-1 ring-border/50 overflow-hidden group max-w-sm mx-auto w-full"
            >
              <div className="w-full h-full bg-muted dark:bg-zinc-950 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" style={{ backgroundColor: `${theme.primaryColor}10` }} />
                <div className="relative text-center space-y-4 group-hover:scale-105 transition-transform duration-700">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 shadow-md mx-auto flex items-center justify-center">
                    <Sparkles className="h-6 w-6" style={textPrimaryStyle} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Premium Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      );

    case 'gallery':
      const galleryImages = content.images || [];
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {content.title || 'Galeri Bisnis'}
              </h2>
              <p className="text-sm font-medium text-muted-foreground max-w-xl mx-auto">
                {content.subtitle || 'Dokumentasi visual portofolio, suasana outlet, dan kegiatan bisnis kami.'}
              </p>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((imgUrl: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.02 }}
                    className="aspect-square bg-muted dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-border/40"
                  >
                    <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
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
        </section>
      );

    case 'logos':
      const logoItems = content.items || ['Maju Bersama', 'Kemitraan UMKM', 'Kualitas Ekspor', 'Jago Kuliner'];
      return (
        <section id={section.id} className="py-10 px-6 bg-gray-50/60 dark:bg-zinc-900/30 border-y border-gray-100 dark:border-zinc-850">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 opacity-60 dark:opacity-85 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400">
            {logoItems.map((logo: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 hover:scale-[1.02] transition-transform">
                <Award className="h-4 w-4" style={textPrimaryStyle} />
                <span>{logo}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'stats':
      const statList = content.stats || [
        { value: '500+', label: 'Pelanggan Setia' },
        { value: '100%', label: 'Bahan Pilihan' },
        { value: '5★', label: 'Rating Rata-Rata' }
      ];
      return (
        <section id={section.id} className="py-14 px-6 bg-white dark:bg-[#0B0F19] text-center" style={{ backgroundColor: `${theme.primaryColor}05` }}>
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
            {statList.map((stat: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl md:text-3xl font-black tracking-tight" style={textPrimaryStyle}>
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-normal">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      );

    case 'features-grid':
      const gridFeatures = content.features || [
        { title: 'Bahan Premium', desc: 'Kami hanya menggunakan kualitas bahan terbaik pilihan.' },
        { title: 'Layanan Kilat', desc: 'Respon dan pengiriman super cepat ke seluruh penjuru.' },
        { title: '100% Higienis', desc: 'Proses pembuatan bersih, aman, dan berstandar dinas.' },
        { title: 'Harga Bersaing', desc: 'Kualitas bintang lima dengan penawaran harga kaki lima.' }
      ];
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-gray-50/20 dark:bg-zinc-950/10">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {content.title || 'Mengapa Memilih Kami?'}
              </h2>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Keunggulan utama layanan bisnis kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridFeatures.map((feat: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-border/40 p-6 rounded-2xl flex gap-4 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white" style={buttonStyle}>
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'features-cards':
      const cardFeatures = content.cards || [
        { title: 'Paket Pemula', desc: 'Pilihan hemat untuk memulai kebutuhan esensial Anda.' },
        { title: 'Paket Bisnis', desc: 'Penawaran paling populer lengkap dengan dukungan ekstra.' },
        { title: 'Paket Premium', desc: 'Solusi lengkap tanpa batas untuk bisnis profesional.' }
      ];
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19]">
          <div className="max-w-6xl mx-auto space-y-12 text-center">
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {content.title || 'Layanan Unggulan Kami'}
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                {content.subtitle || 'Jelajahi paket layanan yang kami rancang khusus untuk menumbuhkan performa bisnis Anda.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cardFeatures.map((card: any, idx: number) => (
                <div key={idx} className="bg-gray-50/50 dark:bg-zinc-900/40 p-8 rounded-2xl border border-border/40 text-center space-y-4 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-2xl mx-auto flex items-center justify-center bg-white dark:bg-zinc-800 shadow-sm group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6" style={textPrimaryStyle} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{card.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      const ctaUrl = content.buttonUrl || '#';
      const ctaBtnText = content.buttonText || 'Mulai Sekarang';
      return (
        <section id={section.id} className="py-16 px-6 bg-gray-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-15" style={{ backgroundColor: theme.primaryColor }} />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {content.title || 'Siap Meningkatkan Bisnis Anda?'}
            </h2>
            <p className="text-xs md:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              {content.subtitle || 'Bergabunglah sekarang dan rasakan kemudahan mengelola platform penjualan digital.'}
            </p>
            <div className="pt-4">
              <Button 
                asChild
                className="h-11 px-8 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 text-white border-none"
                style={buttonStyle}
              >
                <a href={ctaUrl}>
                  {ctaBtnText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      );

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
                {content.title || 'Pertanyaan Umum (FAQ)'}
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
                      <span>{faq.q}</span>
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
                            {faq.a}
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

    case 'contact':
      const waLinkContact = `https://wa.me/${content.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.whatsappText || 'Halo! Saya ingin menghubungi Anda.')}`;
      
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden transition-colors">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-5xl mx-auto rounded-2xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden" 
            style={buttonStyle}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-none">
                    {content.title || 'Hubungi Kami'}
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
        </section>
      );

    default:
      return null;
  }
};
