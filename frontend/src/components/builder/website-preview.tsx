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

interface WebsitePreviewProps {
  site: Site;
  products?: Product[];
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ site, products = [] }) => {
  const { theme, sections } = site;

  return (
    <div 
      className="w-full min-h-screen bg-white"
      style={{ 
        fontFamily: theme.font 
      }}
    >
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-[50]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="hover:opacity-50 transition-all relative group">
              {s.type}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: theme.primaryColor }} />
            </a>
          ))}
        </div>
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
