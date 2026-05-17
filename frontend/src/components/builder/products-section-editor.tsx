'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

interface ProductsSectionEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export const ProductsSectionEditor: React.FC<ProductsSectionEditorProps> = ({ content, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4 pt-2">
      <Input 
        label="Judul" 
        value={content.title} 
        onChange={(e) => handleChange('title', e.target.value)} 
      />
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="showProducts"
          checked={content.showProducts}
          onChange={(e) => handleChange('showProducts', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showProducts" className="text-sm font-medium text-gray-700">Tampilkan Produk dari Katalog</label>
      </div>
    </div>
  );
};
