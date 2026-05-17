'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { productService } from '@/services/product.service';
import { Site, SiteTheme, Section } from '@/types/site';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ThemeEditor } from '@/components/builder/theme-editor';
import { SectionListEditor } from '@/components/builder/section-list-editor';
import { WebsitePreview } from '@/components/builder/website-preview';
import { ChevronLeft, Save, Globe, Eye, Layout, Palette, Settings, Smartphone, Monitor, Laptop, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function WebsiteBuilderPage() {
  const params = useParams();
  const businessId = params.id as string;
  const router = useRouter();

  const [site, setSite] = useState<Site | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'settings'>('sections');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteData, productsData] = await Promise.all([
          siteService.getSite(businessId),
          productService.getAll(businessId)
        ]);
        setSite(siteData);
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to fetch data', err);
        toast.error('Gagal memuat data website');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  const handleThemeChange = (theme: SiteTheme) => {
    if (!site) return;
    setSite({ ...site, theme });
  };

  const handleSectionsChange = (sections: Section[]) => {
    if (!site) return;
    setSite({ ...site, sections });
  };

  const handleSave = async () => {
    if (!site) return;
    setIsSaving(true);
    try {
      await Promise.all([
        siteService.updateTheme(businessId, site.theme),
        siteService.updateSections(businessId, site.sections),
        siteService.updateSite(businessId, { title: site.title, slug: site.slug })
      ]);
      toast.success('Website berhasil disimpan!');
    } catch (err) {
      toast.error('Gagal menyimpan website');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!site) return;
    setIsPublishing(true);
    try {
      if (site.isPublished) {
        await siteService.unpublish(businessId);
        setSite({ ...site, isPublished: false });
        toast.success('Website telah ditarik dari publikasi');
      } else {
        await siteService.publish(businessId);
        setSite({ ...site, isPublished: true });
        toast.success('Website berhasil dipublikasikan!');
      }
    } catch (err) {
      toast.error('Gagal mengubah status publikasi');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Menyiapkan Builder...</p>
        </div>
      </div>
    );
  }

  if (!site) return <div>Website tidak ditemukan.</div>;

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] dark:bg-zinc-950 overflow-hidden transition-colors duration-200">
      {/* Top Bar */}
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-border dark:border-zinc-850 px-6 flex items-center justify-between z-30 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-6">
          <Link href={`/dashboard`}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted dark:hover:bg-zinc-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-foreground dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {site.title}
            </h1>
            <p className="text-[10px] text-muted-foreground dark:text-zinc-500 font-bold uppercase tracking-widest">Website Editor</p>
          </div>
        </div>

        {/* Device Toggles */}
        <div className="hidden md:flex items-center bg-muted/50 dark:bg-zinc-850 rounded-xl p-1 border dark:border-zinc-850">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={cn("p-2 rounded-lg transition-all", previewMode === 'desktop' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary dark:text-white" : "text-muted-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-white")}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setPreviewMode('tablet')}
            className={cn("p-2 rounded-lg transition-all", previewMode === 'tablet' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary dark:text-white" : "text-muted-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-white")}
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={cn("p-2 rounded-lg transition-all", previewMode === 'mobile' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary dark:text-white" : "text-muted-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-white")}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("h-10 px-4 font-bold rounded-xl", site.isPublished && "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30")}
            onClick={handleTogglePublish}
            disabled={isPublishing}
          >
            {site.isPublished ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
            {site.isPublished ? 'Live' : 'Publish'}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="h-10 px-6 font-black rounded-xl shadow-lg shadow-primary/20 dark:shadow-none"
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Editor */}
        <aside className="w-[340px] flex flex-col bg-white dark:bg-zinc-900 border-r border-border dark:border-zinc-850 z-20 shadow-xl overflow-hidden shrink-0 transition-colors duration-200">
          <nav className="flex border-b border-border dark:border-zinc-850 p-2 bg-muted/20 dark:bg-zinc-950/20">
            <button 
              onClick={() => setActiveTab('sections')}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg gap-2 transition-all font-bold text-[10px] uppercase tracking-wider",
                activeTab === 'sections' ? "bg-white dark:bg-zinc-800 shadow-sm text-primary dark:text-white ring-1 ring-border dark:ring-zinc-700" : "text-muted-foreground dark:text-zinc-500 hover:bg-muted dark:hover:bg-zinc-800/50"
              )}
            >
              <Layout className="h-4 w-4" />
              Konten
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg gap-2 transition-all font-bold text-[10px] uppercase tracking-wider",
                activeTab === 'theme' ? "bg-white dark:bg-zinc-800 shadow-sm text-primary dark:text-white ring-1 ring-border dark:ring-zinc-700" : "text-muted-foreground dark:text-zinc-500 hover:bg-muted dark:hover:bg-zinc-800/50"
              )}
            >
              <Palette className="h-4 w-4" />
              Desain
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg gap-2 transition-all font-bold text-[10px] uppercase tracking-wider",
                activeTab === 'settings' ? "bg-white dark:bg-zinc-800 shadow-sm text-primary dark:text-white ring-1 ring-border dark:ring-zinc-700" : "text-muted-foreground dark:text-zinc-500 hover:bg-muted dark:hover:bg-zinc-800/50"
              )}
            >
              <Settings className="h-4 w-4" />
              Opsi
            </button>
          </nav>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'sections' && (
                  <SectionListEditor sections={site.sections} onChange={handleSectionsChange} />
                )}
                {activeTab === 'theme' && (
                  <ThemeEditor theme={site.theme} onChange={handleThemeChange} />
                )}
                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-4">
                        <Settings className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Pengaturan Website</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Nama Website</label>
                          <input 
                            className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/30 dark:bg-zinc-950 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={site.title}
                            onChange={(e) => setSite({ ...site, title: e.target.value })}
                            placeholder="Contoh: Toko Kopi Jago"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Custom Slug (URL)</label>
                          <div className="flex items-center group">
                            <div className="rounded-l-xl border border-r-0 border-border dark:border-zinc-800 bg-muted dark:bg-zinc-800 px-3 py-3 text-xs font-bold text-muted-foreground dark:text-zinc-400">
                              /jagobisnis/
                            </div>
                            <input 
                              className="flex-1 rounded-r-xl border border-border dark:border-zinc-800 bg-muted/30 dark:bg-zinc-950 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-primary dark:text-amber-400"
                              value={site.slug}
                              onChange={(e) => setSite({ ...site, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground dark:text-zinc-500 italic mt-1 px-1">Gunakan huruf kecil, angka, dan tanda hubung (-).</p>
                        </div>
                      </div>
                    </div>

                    {site.isPublished && (
                      <div className="rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          <p className="text-[10px] font-black text-primary dark:text-amber-400 uppercase tracking-widest">Website Live Sekarang</p>
                        </div>
                        <div className="rounded-xl bg-white dark:bg-zinc-800 p-3 border border-gray-150 dark:border-zinc-700 shadow-sm">
                          <p className="text-[10px] font-mono text-muted-foreground dark:text-zinc-400 break-all mb-3 px-1">
                            {window.location.origin}/jagobisnis/{site.slug}
                          </p>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="w-full text-xs font-black h-9 rounded-lg"
                            onClick={() => window.open(`/jagobisnis/${site.slug}`, '_blank')}
                          >
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            Kunjungi Situs
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>

        {/* Right Panel - Preview */}
        <main className="flex-1 bg-[#F0F2F5] dark:bg-zinc-950/60 p-10 overflow-hidden flex flex-col items-center transition-colors duration-200">
          <div className="flex items-center gap-4 mb-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full px-6 py-2 shadow-sm border border-white/50 dark:border-zinc-800/50">
            <div className="flex items-center gap-2 border-r dark:border-zinc-800 pr-4">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-black text-foreground dark:text-white uppercase tracking-widest">Live Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground dark:text-zinc-500" />
              <span className="text-[10px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-wider">Melihat perubahan secara langsung</span>
            </div>
          </div>

          <div 
            className={cn(
              "flex-1 w-full bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-t-3xl border border-border dark:border-zinc-850 overflow-hidden transition-all duration-500 origin-top",
              previewMode === 'mobile' ? "max-w-[375px] rounded-3xl mb-10 ring-8 ring-gray-900 dark:ring-zinc-800" : 
              previewMode === 'tablet' ? "max-w-[768px] rounded-2xl mb-10 ring-8 ring-gray-800 dark:ring-zinc-800" : "max-w-6xl"
            )}
          >
            {/* Browser/Device Header */}
            <div className="h-10 bg-muted/30 dark:bg-zinc-900/30 border-b border-border dark:border-zinc-850 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
              </div>
              <div className="mx-auto bg-white dark:bg-zinc-800 rounded-md border border-border dark:border-zinc-750 px-4 py-1 text-[10px] font-mono text-muted-foreground dark:text-zinc-400 w-1/2 text-center truncate">
                {site.slug}.jagobisnis.id
              </div>
            </div>

            <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
              <WebsitePreview site={site} products={products} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
