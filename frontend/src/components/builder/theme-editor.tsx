'use client';

import React from 'react';
import { SiteTheme } from '@/types/site';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ThemeEditorProps {
  theme: SiteTheme;
  onChange: (theme: SiteTheme) => void;
}

import { Palette, Type, Paintbrush, TextSelect } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange }) => {
  const handleChange = (field: keyof SiteTheme, value: string) => {
    onChange({ ...theme, [field]: value });
  };

  const fonts = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Outfit', value: 'Outfit' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'System Sans', value: 'sans-serif' },
    { name: 'Modern Serif', value: 'serif' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Desain Website</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Paintbrush className="h-3 w-3" />
              Warna Utama
            </label>
            <span className="text-[10px] font-mono text-muted-foreground">{theme.primaryColor}</span>
          </div>
          <div className="flex gap-2">
            <div 
              className="h-10 w-10 rounded-lg border shadow-sm shrink-0 overflow-hidden relative"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <input 
                type="color" 
                value={theme.primaryColor} 
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer scale-150"
              />
            </div>
            <Input 
              value={theme.primaryColor} 
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="h-10 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Type className="h-3 w-3" />
            Tipografi
          </label>
          <div className="grid grid-cols-1 gap-2">
            {fonts.map((f) => (
              <button
                key={f.value}
                onClick={() => handleChange('font', f.value)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all",
                  theme.font === f.value 
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                    : "border-border hover:border-primary/50 hover:bg-muted"
                )}
                style={{ fontFamily: f.value }}
              >
                {f.name}
                {theme.font === f.value && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm border border-border bg-white" />
              Latar
            </label>
            <div className="flex gap-2">
              <div 
                className="h-10 w-full rounded-lg border shadow-sm relative overflow-hidden"
                style={{ backgroundColor: theme.backgroundColor }}
              >
                <input 
                  type="color" 
                  value={theme.backgroundColor} 
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <TextSelect className="h-3 w-3" />
              Teks
            </label>
            <div className="flex gap-2">
              <div 
                className="h-10 w-full rounded-lg border shadow-sm relative overflow-hidden"
                style={{ backgroundColor: theme.textColor }}
              >
                <input 
                  type="color" 
                  value={theme.textColor} 
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
