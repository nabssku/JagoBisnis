"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { useEffect, useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export function InlineRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Klik untuk menulis...", 
  className, 
  multiline = false 
}: InlineRichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // If singleline, restrict headings and lists to keep layout clean
        heading: multiline ? undefined : false,
        bulletList: multiline ? { keepMarks: true, keepAttributes: false } : false,
        orderedList: multiline ? { keepMarks: true, keepAttributes: false } : false,
        codeBlock: false,
        blockquote: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:opacity-85 cursor-pointer',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: cn(
          "focus:outline-none prose max-w-none dark:prose-invert font-inherit text-inherit",
          // Reset default tiptap prose paddings to make it inline layout friendly
          "prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0",
          multiline ? "min-h-[60px]" : "inline-block min-w-[50px] w-full"
        ),
      },
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: ({ editor }) => {
      setIsFocused(false);
      // Immediately save when leaving focus
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onChange(editor.getHTML());
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        onChange(html);
      }, 500); // 500ms debounce
    },
  });

  // Sync value from parent if it changes outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  // Cleanup debouncing timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!editor) {
    return <span className={className}>{value}</span>;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL Link:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg transition-all duration-200 group/inline-editor cursor-text",
        isFocused 
          ? "ring-2 ring-primary/40 dark:ring-amber-400/40 bg-primary/[0.02] dark:bg-amber-400/[0.01] px-1 py-0.5" 
          : "hover:ring-1 hover:ring-dashed hover:ring-primary/40 dark:hover:ring-amber-400/40 hover:bg-primary/[0.01] dark:hover:bg-amber-400/[0.005] px-1 py-0.5"
      )}
    >
      {/* Visual hint indicator for non-technical users */}
      {!isFocused && !value && (
        <span className="absolute left-1 top-0.5 text-xs text-muted-foreground/60 select-none pointer-events-none flex items-center gap-1 font-medium">
          <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
          {placeholder}
        </span>
      )}

      {/* Floating Formatting Bubble Toolbar */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          options={{ placement: 'top' }}
          className="flex items-center gap-0.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl rounded-2xl p-1 animate-in fade-in zoom-in-95 duration-150 select-none z-[99999]"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive('bold') && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 font-bold"
            )}
            title="Tebal (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive('italic') && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 italic"
            )}
            title="Miring (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive('underline') && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 underline"
            )}
            title="Garis Bawah (Ctrl+U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive({ textAlign: 'left' }) && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400"
            )}
            title="Rata Kiri"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive({ textAlign: 'center' }) && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400"
            )}
            title="Rata Tengah"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive({ textAlign: 'right' }) && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400"
            )}
            title="Rata Kanan"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

          <button
            type="button"
            onClick={setLink}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer",
              editor.isActive('link') && "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400"
            )}
            title="Tambah Link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-all cursor-pointer"
              title="Hapus Link"
            >
              <Unlink className="h-3.5 w-3.5" />
            </button>
          )}
        </BubbleMenu>
      )}

      {/* Editor Prose Content */}
      <EditorContent 
        editor={editor} 
        className={cn("bg-transparent focus:outline-none w-full", className)} 
      />
    </div>
  );
}
