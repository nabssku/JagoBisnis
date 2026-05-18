'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { Site, Section, SiteTheme } from '@/types/site';
import { Product } from '@/types/product';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Globe, 
  Store, 
  Coffee, 
  ShoppingBag, 
  Laptop, 
  Heart, 
  Sparkles, 
  Award, 
  Smile, 
  MapPin, 
  Phone, 
  ArrowRight, 
  MessageSquare, 
  Package 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SectionRenderer } from '@/components/builder/section-renderer';
import { OrderModal } from '@/components/order/order-modal';

import { generateThemeCSS } from '@/lib/theme';

export default function PublicWebsitePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [site, setSite] = useState<Site | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrderSuccess = (orderId: string, paymentUrl?: string) => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      window.location.href = `/jagobisnis/${slug}/orders/${orderId}`;
    }
  };

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
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-base font-black tracking-tight text-gray-900 dark:text-white">Menyiapkan Pengalaman Visual</h2>
            <p className="text-[10px] font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Memuat Konten Bisnis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="relative inline-block">
            <div className="text-9xl font-black text-gray-100 dark:text-zinc-900 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="h-20 w-20 text-primary opacity-20" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Website Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
              Maaf, halaman ini mungkin telah dipindahkan, dinonaktifkan, atau belum dipublikasikan oleh pemiliknya.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-2xl px-10 font-black h-12 shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-none">
            <a href="/">Kembali ke Beranda</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  const { theme, sections } = site;

  const renderLogo = () => {
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
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.font 
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(theme) }} />
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="py-3.5 px-6 flex justify-between items-center bg-white/80 dark:bg-zinc-950/80 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {renderLogo()}
          <span className="text-base font-black tracking-tight" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        
        <div className="hidden md:flex gap-6 text-xs font-bold tracking-wider uppercase">
          {[...sections].sort((a, b) => a.order - b.order).filter(s => s.type !== 'footer').map(s => {
            const getSectionLabel = (type: string) => {
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
              <a key={s.id} href={`#${s.id}`} className="hover:opacity-75 transition-all relative group" style={{ color: theme.textColor }}>
                {getSectionLabel(s.type)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: theme.primaryColor }} />
              </a>
            );
          })}
        </div>
        
        <Button 
          onClick={() => {
            const contactSection = document.getElementById('contact') || document.querySelector('[id*="contact"]');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          size="sm" 
          className="rounded-xl px-5 h-9 font-bold text-white text-xs border-none shadow-sm hover:scale-[1.01] transition-transform active:scale-95 animate-fade-in" 
          style={{ backgroundColor: theme.primaryColor }}
        >
          Hubungi Kami
        </Button>
      </motion.nav>

      {/* Sections Renderer */}
      <main className="flex flex-col">
        {[...sections].sort((a, b) => a.order - b.order).map((section, index) => (
          <SectionRenderer 
            key={section.id} 
            section={section} 
            theme={theme} 
            products={products} 
            index={index}
            siteTitle={site.title}
            onOrderProduct={(prod) => {
              setSelectedProduct(prod);
              setIsOrderModalOpen(true);
            }}
          />
        ))}
      </main>

      {/* Order Modal */}
      {site && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          product={selectedProduct}
          site={site}
          onSuccess={handleOrderSuccess}
        />
      )}

      {/* Fallback Static Footer if no dynamic footer block is present */}
      {!sections.some(s => s.type === 'footer') && (
        <footer className="py-12 px-6 border-t border-gray-100 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20 text-center">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-left">
              <h2 className="text-base font-black tracking-tight">{site.title}</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">© 2024 Semua Hak Dilindungi. UMKM JagoBisnis.</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-70">Platform Digital</p>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary flex items-center justify-center text-white text-[8px] font-black" style={{ backgroundColor: theme.primaryColor }}>JB</div>
                <span className="font-extrabold text-sm tracking-tight text-blue-600 dark:text-blue-400">JagoBisnis</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
