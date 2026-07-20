'use client';

import React from 'react';
import { Site, Section, SiteTheme } from '@/types/site';
import { Product } from '@/types/product';
import { SectionRenderer } from './section-renderer';
import { generateThemeCSS } from '@/lib/theme';
import { 
  Globe, 
  Store, 
  Coffee, 
  ShoppingBag, 
  Laptop, 
  Heart, 
  Sparkles, 
  Award, 
  Smile 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebsitePreviewProps {
  site: Site;
  products?: Product[];
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ site, products = [] }) => {
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
      className="w-full min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white transition-colors duration-200"
      style={{ 
        fontFamily: theme.font,
        color: theme.textColor
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(theme) }} />
      {/* Navigation Bar */}
      <nav className="py-3.5 px-6 flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 sticky top-0 z-[50] backdrop-blur-xl transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          {renderLogo()}
          <span className="text-base font-black tracking-tight" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        
        <div className="hidden md:flex gap-6 text-xs font-bold tracking-wider uppercase">
          {[...sections].sort((a, b) => a.order - b.order).filter(s => s.type !== 'footer').map(s => {
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
              <a key={s.id} href={`#${s.id}`} className="hover:opacity-75 transition-all relative group" style={{ color: theme.textColor }}>
                {getSectionLabel(s.type, s.id)}
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
          className="rounded-xl px-5 h-9 font-bold text-white text-xs border-none shadow-sm hover:scale-[1.01] transition-transform active:scale-95" 
          style={{ backgroundColor: theme.primaryColor }}
        >
          Hubungi Kami
        </Button>
      </nav>

      {/* Sections Renderer Stack */}
      <div className="flex flex-col">
        {[...sections].sort((a, b) => a.order - b.order).map((section, index) => (
          <SectionRenderer 
            key={section.id} 
            section={section} 
            theme={theme} 
            products={products} 
            index={index}
            siteTitle={site.title}
          />
        ))}
      </div>

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
};
