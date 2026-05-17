'use client';

import React from 'react';
import { Site, Section, SiteTheme } from '@/types/site';
import { Product } from '@/types/product';

interface WebsitePreviewProps {
  site: Site;
  products?: Product[];
}

import { SectionRenderer } from './section-renderer';
import { Globe, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ site, products = [] }) => {
  const { theme, sections } = site;

  return (
    <div 
      className="w-full min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white transition-colors duration-200"
      style={{ 
        fontFamily: theme.font,
        color: theme.textColor
      }}
    >
      {/* Navigation */}
      <nav className="py-3 px-6 flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/70 sticky top-0 z-[50] backdrop-blur-xl transition-colors duration-200">
        <div className="flex items-center gap-2">
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: theme.primaryColor }} />
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
      </nav>


      {/* Sections Renderer */}
      <div className="flex flex-col">
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
      </div>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-lg font-bold tracking-tight">{site.title}</h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">© 2024 Semua Hak Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
