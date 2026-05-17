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
      <nav className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/70 sticky top-0 z-[50] backdrop-blur-xl transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
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
              <a key={s.id} href={`#${s.id}`} className="hover:opacity-50 transition-all relative group" style={{ color: theme.textColor }}>
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
          className="rounded-full px-6 font-bold text-white text-xs h-9" 
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
      <footer className="py-24 px-6 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter">{site.title}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">© 2024 Semua Hak Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
