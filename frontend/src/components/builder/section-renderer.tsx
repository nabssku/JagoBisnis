'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronRight, Package, Phone, MapPin, MessageSquare } from 'lucide-react';
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

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  switch (section.type) {
    case 'hero':
      return (
        <section id={section.id} className="py-16 px-6 text-center lg:py-24 relative overflow-hidden flex flex-col items-center justify-center">
          {/* Dynamic background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]" 
              style={{ backgroundColor: theme.primaryColor }} 
            />
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary" style={{ color: theme.primaryColor }}>
              <Sparkles className="h-3 w-3" />
              Bisnis Terpercaya
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl leading-tight text-balance" style={{ color: theme.textColor }}>
              {content.headline}
            </h1>
            <p className="text-sm lg:text-base font-medium opacity-70 max-w-xl mx-auto leading-relaxed text-balance">
              {content.subheadline}
            </p>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                asChild
                className="h-11 px-6 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:scale-95 text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <a href={content.buttonUrl}>
                  {content.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" className="h-11 px-5 rounded-xl font-bold text-sm">
                Selengkapnya
              </Button>
            </div>
          </motion.div>
        </section>
      );


    case 'about':
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24 bg-gray-50/50 dark:bg-zinc-900/10 transition-colors">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ backgroundColor: theme.primaryColor }}>
                Tentang Kami
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">{content.title}</h2>
              <p className="text-sm lg:text-base opacity-75 leading-relaxed whitespace-pre-wrap font-medium">
                {content.description}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { label: 'Kualitas', value: 'Premium' },
                  { label: 'Layanan', value: 'Tercepat' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1 border-l-4 pl-4" style={{ borderColor: theme.primaryColor }}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-square bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-md ring-1 ring-border/50 overflow-hidden group max-w-sm mx-auto w-full"
            >
              <div className="w-full h-full bg-muted dark:bg-zinc-950 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" style={{ backgroundColor: `${theme.primaryColor}10` }} />
                <div className="relative text-center space-y-4 group-hover:scale-105 transition-transform duration-700">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 shadow-md mx-auto flex items-center justify-center">
                    <Sparkles className="h-6 w-6" style={{ color: theme.primaryColor }} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Premium Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      );


    case 'products':
      return (
        <section id={section.id} className="py-16 px-6 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12"
            >
              <div className="space-y-3 text-left max-w-xl">
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-none">{content.title}</h2>
                <p className="text-sm font-medium text-muted-foreground">Pilihan produk terbaik untuk menunjang kebutuhan Anda.</p>
              </div>
              <Button variant="outline" className="rounded-xl px-5 h-10 font-bold text-xs uppercase tracking-wider border text-gray-700 dark:text-zinc-300">
                Lihat Semua
              </Button>
            </motion.div>

            {content.showProducts && products.length > 0 ? (
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
                            /* eslint-disable-next-line @next/next/no-img-element */
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
                              <p className="font-extrabold text-base tracking-tight" style={{ color: theme.primaryColor }}>
                                Rp{product.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Button size="icon" className="h-8 w-8 rounded-lg shadow-sm transition-all hover:translate-x-0.5 active:scale-90 text-white" style={{ backgroundColor: theme.primaryColor }}>
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


    case 'contact':
      const waLink = `https://wa.me/${content.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.whatsappText || '')}`;
      
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
            style={{ backgroundColor: theme.primaryColor }}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-none">{content.title}</h2>
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
                  <MessageSquare className="h-6 w-6" style={{ color: theme.primaryColor }} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-tight">Kirim Pesan</h3>
                  <p className="text-xs opacity-75 leading-relaxed">Respon cepat melalui asisten WhatsApp kami yang tersedia 24/7.</p>
                </div>
                <Button 
                  asChild
                  className="w-full h-10 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-all hover:scale-[1.01] shadow-md border-none"
                >
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
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
