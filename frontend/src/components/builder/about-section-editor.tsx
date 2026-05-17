'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

interface AboutSectionEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export const AboutSectionEditor: React.FC<AboutSectionEditorProps> = ({ content, onChange }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4 pt-2">
      <Input 
        label="Judul" 
        value={content.title} 
        onChange={(e) => handleChange('title', e.target.value)} 
      />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Deskripsi</label>
        <textarea
          className="w-full rounded-xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
          value={content.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};
