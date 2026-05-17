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
        <section id={section.id} className="py-24 px-6 text-center lg:py-48 relative overflow-hidden flex flex-col items-center justify-center">
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
            className="max-w-5xl mx-auto space-y-10 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary" style={{ color: theme.primaryColor }}>
              <Sparkles className="h-3 w-3" />
              Bisnis Terpercaya
            </div>
            <h1 className="text-6xl font-black tracking-tighter lg:text-[7.5rem] leading-[0.95] text-balance" style={{ color: theme.textColor }}>
              {content.headline}
            </h1>
            <p className="text-xl lg:text-3xl font-medium opacity-60 max-w-2xl mx-auto leading-relaxed text-balance">
              {content.subheadline}
            </p>
            <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="h-16 px-12 rounded-[2rem] font-black text-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <a href={content.buttonUrl}>
                  {content.buttonText}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </a>
              </Button>
              <Button variant="ghost" size="lg" className="h-16 px-10 rounded-[2rem] font-bold text-lg">
                Selengkapnya
              </Button>
            </div>
          </motion.div>
        </section>
      );

    case 'about':
      return (
        <section id={section.id} className="py-24 px-6 lg:py-40 bg-gray-50/50">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ backgroundColor: theme.primaryColor }}>
                Tentang Kami
              </div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">{content.title}</h2>
              <p className="text-xl lg:text-2xl opacity-70 leading-loose whitespace-pre-wrap font-medium">
                {content.description}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                {[
                  { label: 'Kualitas', value: 'Premium' },
                  { label: 'Layanan', value: 'Tercepat' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2 border-l-4 pl-6" style={{ borderColor: theme.primaryColor }}>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="text-2xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-square bg-white rounded-[3.5rem] p-4 shadow-2xl shadow-primary/5 ring-1 ring-border overflow-hidden group"
            >
              <div className="w-full h-full bg-muted rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" style={{ backgroundColor: `${theme.primaryColor}10` }} />
                <div className="relative text-center space-y-6 group-hover:scale-110 transition-transform duration-700">
                  <div className="w-24 h-24 rounded-full bg-white shadow-xl mx-auto flex items-center justify-center">
                    <Sparkles className="h-10 w-10" style={{ color: theme.primaryColor }} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Premium Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      );

    case 'products':
      return (
        <section id={section.id} className="py-24 px-6 lg:py-40">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24"
            >
              <div className="space-y-6 text-left max-w-2xl">
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">{content.title}</h2>
                <p className="text-xl font-medium text-muted-foreground">Pilihan produk terbaik untuk menunjang kebutuhan Anda.</p>
              </div>
              <Button variant="outline" className="rounded-2xl px-8 h-14 font-black text-sm uppercase tracking-widest border-2">
                Lihat Semua
              </Button>
            </motion.div>

            {content.showProducts && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {products.map((product, i) => {
                  const productDetailUrl = slug ? `/jagobisnis/${slug}/product/${product.id}` : '#';
                  return (
                    <Link key={product.id} href={productDetailUrl} className="block h-full">
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group flex flex-col h-full rounded-[2.5rem] bg-white border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer"
                      >
                        <div className="aspect-[4/5] bg-muted flex items-center justify-center overflow-hidden relative">
                          {product.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          ) : (
                            <div className="flex flex-col items-center opacity-10">
                              <Package className="h-20 w-20 mb-4" />
                              <span className="text-xs font-black uppercase tracking-widest text-center px-4">Katalog {siteTitle}</span>
                            </div>
                          )}
                          <div className="absolute top-6 left-6">
                            <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm">
                              {product.category || 'Terbaru'}
                            </div>
                          </div>
                        </div>
                        <div className="p-10 flex flex-col flex-1">
                          <div className="flex-1 space-y-3">
                            <h3 className="font-black text-2xl tracking-tight text-gray-900 group-hover:text-primary transition-colors" style={{ '--primary': theme.primaryColor } as any}>{product.name}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium">{product.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-10 pt-8 border-t border-border/50">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Harga</span>
                              <p className="font-black text-2xl tracking-tighter" style={{ color: theme.primaryColor }}>
                                Rp{product.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Button size="icon" className="h-14 w-14 rounded-2xl shadow-lg transition-all hover:rotate-90 active:scale-90" style={{ backgroundColor: theme.primaryColor }}>
                              <ChevronRight className="h-7 w-7" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-40 text-center bg-muted/30 rounded-[4rem] border-2 border-dashed border-border/50 flex flex-col items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Package className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black text-muted-foreground">Katalog Masih Kosong</p>
                  <p className="text-sm font-medium text-muted-foreground/60 max-w-xs">Kembali lagi nanti untuk melihat penawaran produk terbaru kami.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      );

    case 'contact':
      const waLink = `https://wa.me/${content.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.whatsappText || '')}`;
      
      return (
        <section id={section.id} className="py-24 px-6 lg:py-48 bg-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-6xl mx-auto rounded-[4.5rem] p-12 lg:p-24 text-white shadow-3xl relative overflow-hidden" 
            style={{ backgroundColor: theme.primaryColor }}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">{content.title}</h2>
                  <p className="text-xl lg:text-2xl font-medium opacity-80 leading-relaxed max-w-md">Kami siap melayani Anda. Hubungi kami kapan saja melalui saluran berikut.</p>
                </div>

                <div className="space-y-10">
                  {content.phone && (
                    <div className="flex items-center gap-6 group">
                      <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md transition-all group-hover:scale-110">
                        <Phone className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60">Hubungi Langsung</p>
                        <p className="text-2xl lg:text-3xl font-black tracking-tight">{content.phone}</p>
                      </div>
                    </div>
                  )}
                  {content.address && (
                    <div className="flex items-center gap-6 group">
                      <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md transition-all group-hover:scale-110">
                        <MapPin className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60">Lokasi Kantor</p>
                        <p className="text-xl lg:text-2xl font-bold leading-tight">{content.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-14 border border-white/20 shadow-2xl flex flex-col items-center text-center gap-8">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <MessageSquare className="h-12 w-12" style={{ color: theme.primaryColor }} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tight">Kirim Pesan</h3>
                  <p className="text-sm font-medium opacity-70 leading-relaxed">Respon cepat melalui asisten WhatsApp kami yang tersedia 24/7.</p>
                </div>
                <Button 
                  asChild
                  size="lg"
                  className="w-full h-16 rounded-2xl bg-white text-gray-900 font-black text-xl hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-xl"
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
