"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-white dark:bg-zinc-950",
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync value from parent if it changes outside (e.g., block switch)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL Link:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-border dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-1.5 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive('bold') && "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
          )}
          title="Tebal (Bold)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive('italic') && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 italic"
          )}
          title="Miring (Italic)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive('underline') && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 underline"
          )}
          title="Garis Bawah (Underline)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-border dark:bg-zinc-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive({ textAlign: 'left' }) && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400"
          )}
          title="Rata Kiri (Align Left)"
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive({ textAlign: 'center' }) && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400"
          )}
          title="Rata Tengah (Align Center)"
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive({ textAlign: 'right' }) && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400"
          )}
          title="Rata Kanan (Align Right)"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-border dark:bg-zinc-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive('bulletList') && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400"
          )}
          title="Daftar Simbol (Bullet List)"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive('orderedList') && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400"
          )}
          title="Daftar Angka (Ordered List)"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-border dark:bg-zinc-800 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer",
            editor.isActive('link') && "bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400"
          )}
          title="Tambah Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-550 transition-all active:scale-90 cursor-pointer"
            title="Hapus Link"
          >
            <Unlink className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="min-h-[120px] bg-white dark:bg-zinc-950 focus:outline-none" />
    </div>
  );
}
