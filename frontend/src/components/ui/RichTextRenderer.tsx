"use client";

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface RichTextRendererProps {
  content: string;
  className?: string;
  isInline?: boolean;
}

export function RichTextRenderer({ content, className, isInline = false }: RichTextRendererProps) {
  // Safe basic sanitization for client side rendering (without script execution risks)
  const safeHtml = useMemo(() => {
    if (!content) return '';
    
    // remove script tags, iframe, dangerous onload/onerror attributes, etc.
    return content
      .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '')
      .replace(/<iframe[^>]*>([\S\s]*?)<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '');
  }, [content]);

  const Comp = isInline ? 'span' : 'div';

  return (
    <Comp 
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none break-words text-current leading-relaxed",
        isInline ? "inline [&_p]:inline [&_p]:m-0" : "",
        // styling bullet list bullets
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:my-0.5",
        // styling ordered list numbers
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:my-0.5",
        // strong formatting
        "[&_strong]:font-bold",
        // italic
        "[&_em]:italic",
        // underline
        "[&_u]:underline",
        // paragraph alignment classes
        "[&_.text-left]:text-left [&_.text-center]:text-center [&_.text-right]:text-right",
        "[&_p.text-left]:text-left [&_p.text-center]:text-center [&_p.text-right]:text-right",
        // links
        "[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline hover:[&_a]:text-blue-800 dark:hover:[&_a]:text-blue-300",
        className
      )}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
