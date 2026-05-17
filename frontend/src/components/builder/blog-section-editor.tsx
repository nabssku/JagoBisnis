'use client';

import React from 'react';
import { LayoutGrid, Table, AlignLeft, Sparkles, Filter, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogSectionContent {
  title: string;
  subtitle: string;
  layout: 'grid' | 'table';
  maxPosts: number;
  postTypeFilter: string;
}

interface BlogSectionEditorProps {
  content: BlogSectionContent;
  onChange: (content: BlogSectionContent) => void;
}

export const BlogSectionEditor: React.FC<BlogSectionEditorProps> = ({ content, onChange }) => {
  const updateContent = (fields: Partial<BlogSectionContent>) => {
    onChange({ ...content, ...fields });
  };

  // Ensure default fallback values
  const currentTitle = content.title || 'Artikel & Kegiatan Terbaru';
  const currentSubtitle = content.subtitle || 'Ikuti pembaruan terkini, pengumuman, dan artikel edukatif dari kami.';
  const currentLayout = content.layout || 'grid';
  const currentMaxPosts = content.maxPosts || 3;
  const currentFilter = content.postTypeFilter || 'Semua';

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1.5">
          Judul Seksyen
        </label>
        <input
          type="text"
          value={currentTitle}
          onChange={(e) => updateContent({ title: e.target.value })}
          className="w-full h-10 px-3.5 rounded-xl border border-gray-250 dark:border-zinc-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1.5">
          Subjudul Deskripsi
        </label>
        <textarea
          value={currentSubtitle}
          onChange={(e) => updateContent({ subtitle: e.target.value })}
          rows={2}
          className="w-full p-3.5 rounded-xl border border-gray-250 dark:border-zinc-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white resize-none"
        />
      </div>

      {/* Layout Style Choice (Grid vs Table) */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-2">
          Gaya Tampilan Tata Letak (Layout)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Grid selection card */}
          <div 
            onClick={() => updateContent({ layout: 'grid' })}
            className={cn(
              "p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 select-none",
              currentLayout === 'grid'
                ? "bg-amber-400/10 dark:bg-amber-400/5 border-amber-400 text-amber-500" 
                : "border-gray-250 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-500 dark:text-zinc-400"
            )}
          >
            <LayoutGrid className="h-6 w-6" />
            <div>
              <p className="text-xs font-black">Modern Grid</p>
              <p className="text-[9px] font-bold opacity-60">Layout kartu responsif</p>
            </div>
          </div>

          {/* Table list selection card */}
          <div 
            onClick={() => updateContent({ layout: 'table' })}
            className={cn(
              "p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 select-none",
              currentLayout === 'table'
                ? "bg-amber-400/10 dark:bg-amber-400/5 border-amber-400 text-amber-500" 
                : "border-gray-250 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-500 dark:text-zinc-400"
            )}
          >
            <Table className="h-6 w-6" />
            <div>
              <p className="text-xs font-black">Compact Table</p>
              <p className="text-[9px] font-bold opacity-60">Daftar ringkas minimalis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid (Max posts & filter type) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1.5">
            Jumlah Maks Konten
          </label>
          <select
            value={currentMaxPosts}
            onChange={(e) => updateContent({ maxPosts: parseInt(e.target.value) })}
            className="w-full h-10 px-3.5 rounded-xl border border-gray-250 dark:border-zinc-800 text-xs font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white"
          >
            <option value={3}>3 Konten</option>
            <option value={6}>6 Konten</option>
            <option value={9}>9 Konten</option>
            <option value={12}>12 Konten</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1.5">
            Filter Tipe Konten
          </label>
          <select
            value={currentFilter}
            onChange={(e) => updateContent({ postTypeFilter: e.target.value })}
            className="w-full h-10 px-3.5 rounded-xl border border-gray-250 dark:border-zinc-800 text-xs font-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white"
          >
            <option value="Semua">Semua Tipe</option>
            <option value="Artikel">Artikel</option>
            <option value="Pembaruan">Pembaruan</option>
            <option value="Promo">Promo</option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-400/10 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 leading-normal">
          Seksyen Blog ini akan memuat postingan yang Anda buat dari tab <span className="font-black text-gray-800 dark:text-white">Konten</span> secara dinamis. Pastikan status artikel telah diatur ke <span className="font-black text-gray-800 dark:text-white">Publik</span> agar dapat dibaca pengunjung.
        </p>
      </div>

    </div>
  );
};
