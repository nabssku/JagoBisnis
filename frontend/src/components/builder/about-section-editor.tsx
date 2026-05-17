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
        <label className="text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};
