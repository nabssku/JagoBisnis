'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

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
        <RichTextEditor
          value={content.description || ''}
          onChange={(value) => handleChange('description', value)}
          placeholder="Tulis deskripsi tentang kami di sini..."
        />
      </div>
    </div>
  );
};
