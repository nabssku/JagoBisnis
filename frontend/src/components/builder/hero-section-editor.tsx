'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

interface HeroSectionEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ content, onChange }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4 pt-2">
      <Input 
        label="Headline" 
        value={content.headline} 
        onChange={(e) => handleChange('headline', e.target.value)} 
      />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Subheadline</label>
        <textarea
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content.subheadline}
          onChange={(e) => handleChange('subheadline', e.target.value)}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input 
          label="Teks Tombol" 
          value={content.buttonText} 
          onChange={(e) => handleChange('buttonText', e.target.value)} 
        />
        <Input 
          label="URL Tombol" 
          value={content.buttonUrl} 
          onChange={(e) => handleChange('buttonUrl', e.target.value)} 
        />
      </div>
    </div>
  );
};
