'use client';

import React, { useState } from 'react';
import { Section } from '@/types/site';
import { Button } from '@/components/ui/button';
import { 
  ChevronUp, 
  ChevronDown, 
  Edit2, 
  Trash2, 
  Layout, 
  Type, 
  Package, 
  MessageSquare, 
  GripVertical,
  FileText
} from 'lucide-react';
import { HeroSectionEditor } from './hero-section-editor';
import { AboutSectionEditor } from './about-section-editor';
import { ProductsSectionEditor } from './products-section-editor';
import { ContactSectionEditor } from './contact-section-editor';
import { BlogSectionEditor } from './blog-section-editor';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionListEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export const SectionListEditor: React.FC<SectionListEditorProps> = ({ sections, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((s, i) => s.order = i + 1);
    onChange(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    newSections.forEach((s, i) => s.order = i + 1);
    onChange(newSections);
  };

  const updateSectionContent = (id: string, content: any) => {
    const newSections = sections.map(s => s.id === id ? { ...s, content } : s);
    onChange(newSections);
  };

  const sectionIcons: Record<string, any> = {
    hero: Type,
    about: Layout,
    products: Package,
    contact: MessageSquare,
    blog: FileText,
  };

  const renderEditor = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return <HeroSectionEditor content={section.content} onChange={(c) => updateSectionContent(section.id, c)} />;
      case 'about':
        return <AboutSectionEditor content={section.content} onChange={(c) => updateSectionContent(section.id, c)} />;
      case 'products':
        return <ProductsSectionEditor content={section.content} onChange={(c) => updateSectionContent(section.id, c)} />;
      case 'contact':
        return <ContactSectionEditor content={section.content} onChange={(c) => updateSectionContent(section.id, c)} />;
      case 'blog':
        return <BlogSectionEditor content={section.content} onChange={(c) => updateSectionContent(section.id, c)} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Layout className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Struktur Halaman</h3>
      </div>
      
      <div className="space-y-3">
        {sections.sort((a, b) => a.order - b.order).map((section, index) => {
          const Icon = sectionIcons[section.type] || Layout;
          const isEditing = editingId === section.id;

          return (
            <div 
              key={section.id} 
              className={cn(
                "rounded-xl border bg-white dark:bg-zinc-900 transition-all overflow-hidden",
                isEditing ? "border-primary dark:border-amber-400 shadow-lg ring-1 ring-primary/20 dark:ring-amber-400/20" : "border-border dark:border-zinc-850 hover:border-primary/40 shadow-sm"
              )}
            >
              <div className={cn(
                "flex items-center justify-between px-3 py-2.5",
                isEditing ? "bg-primary/5 dark:bg-zinc-800" : "bg-muted/30 dark:bg-zinc-950/40"
              )}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm">
                    <Icon className="h-4 w-4 text-primary dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">
                      Seksyen {index + 1}
                    </p>
                    <p className="text-xs font-bold text-foreground dark:text-white capitalize leading-none">
                      {section.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center mr-2 border-r dark:border-zinc-800 pr-2 gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => moveUp(index)} 
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => moveDown(index)} 
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant={isEditing ? 'primary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setEditingId(isEditing ? null : section.id)}
                  >
                    <Edit2 className={cn("h-4 w-4", isEditing ? "text-white dark:text-zinc-900" : "text-muted-foreground dark:text-zinc-400")} />
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      {renderEditor(section)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
;
