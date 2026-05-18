'use client';

import React from 'react';
import { SiteTheme } from '@/types/site';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Palette, 
  Type, 
  Paintbrush, 
  TextSelect, 
  Sparkles, 
  Layers, 
  Box, 
  Settings, 
  MousePointerClick,
  Link as LinkIcon
} from 'lucide-react';

interface ThemeEditorProps {
  theme: SiteTheme;
  onChange: (theme: SiteTheme) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...theme, [field]: value });
  };

  const fonts = [
    { name: 'Inter (Modern & Bersih)', value: 'Inter' },
    { name: 'Outfit (Premium & Trendy)', value: 'Outfit' },
    { name: 'Roboto (Sederhana & Terpercaya)', value: 'Roboto' },
    { name: 'System Sans', value: 'sans-serif' },
    { name: 'Modern Serif', value: 'serif' },
  ];

  const radii = [
    { label: 'Tajam (Sharp)', value: '0px' },
    { label: 'Halus (Sm)', value: '0.5rem' },
    { label: 'Medium (Md)', value: '0.75rem' },
    { label: 'Bulat (Lg)', value: '1.25rem' },
    { label: 'Ekstra Bulat (Xl)', value: '2rem' },
  ];

  const shadows = [
    { label: 'Tanpa Bayangan', value: 'none' },
    { label: 'Lembut (Soft)', value: 'sm' },
    { label: 'Normal (Md)', value: 'md' },
    { label: 'Tebal (Lg)', value: 'lg' },
    { label: 'Mewah (Xl)', value: 'xl' },
  ];

  const buttonStyles = [
    { label: 'Solid (Penuh)', value: 'solid' },
    { label: 'Garis Tepi (Outline)', value: 'outline' },
    { label: 'Minimalis (Ghost)', value: 'ghost' },
    { label: 'Pill (Kapsul)', value: 'pill' },
  ];

  const linkStyles = [
    { label: 'Garis Bawah Selalu', value: 'underline' },
    { label: 'Garis Bawah Saat Hover', value: 'hover-underline' },
    { label: 'Minimal (Polos)', value: 'none' },
  ];

  const spacingSystems = [
    { label: 'Rapat (Compact)', value: 'compact' },
    { label: 'Nyaman (Cozy)', value: 'cozy' },
    { label: 'Lebar (Comfortable)', value: 'comfortable' },
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center gap-2 mb-1">
        <Palette className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Desain & Tema Global</h3>
      </div>
      
      <div className="space-y-6">
        {/* Colors Section */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Paintbrush className="h-3.5 w-3.5" />
            Palet Warna
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Warna Utama (Brand)</label>
              <span className="text-[10px] font-mono text-muted-foreground">{theme.primaryColor}</span>
            </div>
            <div className="flex gap-2">
              <div 
                className="h-10 w-10 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm shrink-0 overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
                style={{ backgroundColor: theme.primaryColor || '#e8aa20' }}
              >
                <input 
                  type="color" 
                  value={theme.primaryColor || '#e8aa20'} 
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
              <Input 
                value={theme.primaryColor || '#e8aa20'} 
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="h-10 font-mono text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Warna Sekunder (Kontras)</label>
              <span className="text-[10px] font-mono text-muted-foreground">{(theme as any).secondaryColor || '#1e293b'}</span>
            </div>
            <div className="flex gap-2">
              <div 
                className="h-10 w-10 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm shrink-0 overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
                style={{ backgroundColor: (theme as any).secondaryColor || '#1e293b' }}
              >
                <input 
                  type="color" 
                  value={(theme as any).secondaryColor || '#1e293b'} 
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
              <Input 
                value={(theme as any).secondaryColor || '#1e293b'} 
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="h-10 font-mono text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Warna Aksen (Highlight)</label>
              <span className="text-[10px] font-mono text-muted-foreground">{(theme as any).accentColor || '#f59e0b'}</span>
            </div>
            <div className="flex gap-2">
              <div 
                className="h-10 w-10 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm shrink-0 overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
                style={{ backgroundColor: (theme as any).accentColor || '#f59e0b' }}
              >
                <input 
                  type="color" 
                  value={(theme as any).accentColor || '#f59e0b'} 
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
              <Input 
                value={(theme as any).accentColor || '#f59e0b'} 
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="h-10 font-mono text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Fonts Section */}
        <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Type className="h-3.5 w-3.5" />
            Tipografi Font
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Font Judul (Heading)</label>
            <select
              value={(theme as any).headingFont || theme.font || 'Outfit'}
              onChange={(e) => handleChange('headingFont', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border dark:border-zinc-800 bg-muted/40 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {fonts.map((f) => (
                <option key={f.value} value={f.value}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Font Isi (Body Text)</label>
            <select
              value={(theme as any).bodyFont || theme.font || 'Inter'}
              onChange={(e) => handleChange('bodyFont', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border dark:border-zinc-800 bg-muted/40 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {fonts.map((f) => (
                <option key={f.value} value={f.value}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Border Radius & Shadow */}
        <div className="space-y-4 pt-3 border-t border-border dark:border-zinc-850">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Layers className="h-3.5 w-3.5" />
            Bentuk & Efek (Radius & Shadow)
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Lengkungan Sudut (Border Radius)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {radii.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleChange('borderRadius', r.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer active:scale-95",
                    ((theme as any).borderRadius || '0.75rem') === r.value 
                      ? "border-primary bg-primary/10 text-primary dark:text-amber-400" 
                      : "border-border dark:border-zinc-800 text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Bayangan Kartu & Elemen (Shadow)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {shadows.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleChange('shadowStyle', s.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer active:scale-95",
                    ((theme as any).shadowStyle || 'lg') === s.value 
                      ? "border-primary bg-primary/10 text-primary dark:text-amber-400" 
                      : "border-border dark:border-zinc-800 text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons & Links Styling */}
        <div className="space-y-4 pt-3 border-t border-border dark:border-zinc-850">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <MousePointerClick className="h-3.5 w-3.5" />
            Interaksi & Gaya Tombol
          </div>

          {/* Button Style */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Gaya Tombol Utama</label>
            <div className="grid grid-cols-2 gap-1.5">
              {buttonStyles.map((b) => (
                <button
                  key={b.value}
                  onClick={() => handleChange('buttonStyle', b.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer active:scale-95",
                    ((theme as any).buttonStyle || 'solid') === b.value 
                      ? "border-primary bg-primary/10 text-primary dark:text-amber-400" 
                      : "border-border dark:border-zinc-800 text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Link Hover Style */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Gaya Link & Hover Navigasi</label>
            <div className="grid grid-cols-2 gap-1.5">
              {linkStyles.map((l) => (
                <button
                  key={l.value}
                  onClick={() => handleChange('linkStyle', l.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer active:scale-95",
                    ((theme as any).linkStyle || 'hover-underline') === l.value 
                      ? "border-primary bg-primary/10 text-primary dark:text-amber-400" 
                      : "border-border dark:border-zinc-800 text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spacing / Layout Rhythms */}
        <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Box className="h-3.5 w-3.5" />
            Kerapatan Blok Halaman (Spacing)
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400">Kerapatan Konten Halaman</label>
            <div className="grid grid-cols-3 gap-1.5">
              {spacingSystems.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleChange('spacingSystem', s.value)}
                  className={cn(
                    "px-2 py-1.5 text-[10px] font-black rounded-lg border text-center transition-all cursor-pointer active:scale-95 uppercase tracking-wider",
                    ((theme as any).spacingSystem || 'cozy') === s.value 
                      ? "border-primary bg-primary/10 text-primary dark:text-amber-400" 
                      : "border-border dark:border-zinc-800 text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800"
                  )}
                >
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
