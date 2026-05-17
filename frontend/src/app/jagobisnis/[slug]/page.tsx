'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { Site, Section, SiteTheme } from '@/types/site';
import { Product } from '@/types/product';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Smartphone, MapPin, Phone, ArrowRight, MessageSquare, Package, Globe, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PublicWebsitePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [site, setSite] = useState<Site | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const data = await siteService.getPublicSite(slug);
        setSite(data);
        setProducts(data.business?.Product || []);
      } catch (err) {
        setError('Website tidak ditemukan atau belum dipublikasikan.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-gray-900">Menyiapkan Pengalaman Visual</h2>
            <p className="text-sm font-medium text-muted-foreground animate-pulse uppercase tracking-widest">Memuat Konten Bisnis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="relative inline-block">
            <div className="text-9xl font-black text-gray-100 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="h-20 w-20 text-primary opacity-20" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Website Tidak Ditemukan</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Maaf, halaman ini mungkin telah dipindahkan, dihapus, atau belum dipublikasikan oleh pemiliknya.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-2xl px-10 font-black h-14 shadow-xl shadow-primary/20">
            <a href="/">Kembali ke Beranda</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  const { theme, sections } = site;

  return (
    <div 
      className="min-h-screen selection:bg-primary selection:text-white"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.font 
      }}
    >
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="py-3 px-6 flex justify-between items-center bg-white/70 dark:bg-zinc-950/70 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>
            <Globe className="h-4 w-4" />
          </div>
          <span className="text-lg font-black tracking-tight" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-semibold tracking-wider">
          {sections.map(s => {
            const getSectionLabel = (type: string) => {
              switch (type) {
                case 'hero': return 'Beranda';
                case 'about': return 'Tentang Kami';
                case 'products': return 'Layanan & Produk';
                case 'contact': return 'Hubungi';
                default: return type;
              }
            };
            return (
              <a key={s.id} href={`#${s.id}`} className="hover:opacity-60 transition-all relative group" style={{ color: theme.textColor }}>
                {getSectionLabel(s.type)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" style={{ backgroundColor: theme.primaryColor }} />
              </a>
            );
          })}
        </div>
        <Button 
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          size="sm" 
          className="rounded-xl px-5 h-9 font-bold text-white text-xs border-none shadow-sm hover:scale-[1.01] transition-transform" 
          style={{ backgroundColor: theme.primaryColor }}
        >
          Hubungi
        </Button>
      </motion.nav>


      {/* Sections Renderer */}
      <main className="flex flex-col">
        {sections.sort((a, b) => a.order - b.order).map((section, index) => (
          <SectionRenderer 
            key={section.id} 
            section={section} 
            theme={theme} 
            products={products} 
            index={index}
            siteTitle={site.title}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20">
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
    </div>
  );
}

import { SectionRenderer } from '@/components/builder/section-renderer';
