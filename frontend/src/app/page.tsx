'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Store, Globe, ArrowRight, Check, ShieldCheck, Zap, Smartphone,
  ShoppingBag, MessageSquare, ChevronDown, HelpCircle, Sparkles,
  MousePointerClick, QrCode, CheckCircle2, Lock, X, Eye, EyeOff,
  Loader2, ChefHat, Shirt, WashingMachine, Scissors, Briefcase,
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { businessService } from '@/services/business.service';
import { toast } from 'sonner';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Category = 'kuliner' | 'fashion' | 'laundry' | 'barber' | 'jasa';

interface CategoryConfig {
  label: string;
  emoji: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  hero: string;
  sub: string;
  previewBg: string;
  previewAccent: string;
  products: { emoji: string; name: string; price: string }[];
}

// ─── CATEGORY CONFIGS ────────────────────────────────────────────────────────

const CATEGORIES: Record<Category, CategoryConfig> = {
  kuliner: {
    label: 'Kuliner / F&B',
    emoji: '🍔',
    icon: <ChefHat className="h-4 w-4" />,
    accent: '#e8aa20',
    bg: 'from-amber-50 to-orange-50',
    hero: 'Cita Rasa Terbaik, Dipesan Langsung dari Genggaman!',
    sub: 'Menu spesial kami tersedia setiap hari. Order via WhatsApp, siap dalam hitungan menit.',
    previewBg: 'bg-amber-950',
    previewAccent: 'text-amber-400',
    products: [
      { emoji: '🍜', name: 'Mie Ayam Spesial', price: 'Rp 22.000' },
      { emoji: '🥤', name: 'Es Teh Jumbo', price: 'Rp 8.000' },
    ],
  },
  fashion: {
    label: 'Fashion / Toko Baju',
    emoji: '👗',
    icon: <Shirt className="h-4 w-4" />,
    accent: '#7c3aed',
    bg: 'from-violet-50 to-purple-50',
    hero: 'Tampil Stylish Setiap Hari, Koleksi Terbaru Menantimu!',
    sub: 'Pilihan busana modern dan elegan untuk segala kesempatan.',
    previewBg: 'bg-zinc-900',
    previewAccent: 'text-violet-400',
    products: [
      { emoji: '👔', name: 'Kemeja Oversized', price: 'Rp 185.000' },
      { emoji: '👗', name: 'Midi Dress Batik', price: 'Rp 240.000' },
    ],
  },
  laundry: {
    label: 'Laundry / Kebersihan',
    emoji: '🧺',
    icon: <WashingMachine className="h-4 w-4" />,
    accent: '#0284c7',
    bg: 'from-sky-50 to-blue-50',
    hero: 'Bersih, Wangi, dan Tepat Waktu — Dijamin!',
    sub: 'Layanan laundry kilat antar-jemput tanpa ribet. Harga transparan, hasil memuaskan.',
    previewBg: 'bg-sky-950',
    previewAccent: 'text-sky-400',
    products: [
      { emoji: '👕', name: 'Cuci Kiloan', price: 'Rp 7.000/kg' },
      { emoji: '🥻', name: 'Cuci Setrika', price: 'Rp 12.000/kg' },
    ],
  },
  barber: {
    label: 'Barbershop / Salon',
    emoji: '💈',
    icon: <Scissors className="h-4 w-4" />,
    accent: '#d97706',
    bg: 'from-stone-50 to-zinc-50',
    hero: 'Tampil Keren Setiap Hari — Barbershop Terpercaya!',
    sub: 'Potong rambut stylish oleh barber profesional. Booking mudah, hasil kece!',
    previewBg: 'bg-stone-950',
    previewAccent: 'text-amber-500',
    products: [
      { emoji: '✂️', name: 'Potong Reguler', price: 'Rp 25.000' },
      { emoji: '🪒', name: 'Cukur + Keramas', price: 'Rp 45.000' },
    ],
  },
  jasa: {
    label: 'Jasa / Layanan Umum',
    emoji: '💼',
    icon: <Briefcase className="h-4 w-4" />,
    accent: '#059669',
    bg: 'from-emerald-50 to-teal-50',
    hero: 'Solusi Profesional untuk Setiap Kebutuhanmu!',
    sub: 'Layanan terpercaya dengan tim berpengalaman. Hubungi kami sekarang!',
    previewBg: 'bg-emerald-950',
    previewAccent: 'text-emerald-400',
    products: [
      { emoji: '🔧', name: 'Servis Reguler', price: 'Rp 75.000' },
      { emoji: '📦', name: 'Paket Premium', price: 'Rp 150.000' },
    ],
  },
};

const AI_STEPS = [
  '🔍 Menganalisis industri bisnismu...',
  '✍️  Menulis copywriting profesional...',
  '🎨 Menentukan tema warna terbaik...',
  '⚙️  Menyusun layout komponen...',
  '✅ Website siap! Klaim sekarang!',
];

const FAQ_ITEMS = [
  {
    q: 'Apakah JagoBisnis benar-benar gratis?',
    a: 'Ya! JagoBisnis menyediakan paket gratis selamanya yang mencakup 1 Profil Bisnis, Website Builder instan, checkout WhatsApp, dan hosting subdomain jagobisnis.id.',
  },
  {
    q: 'Apakah saya membutuhkan keahlian coding?',
    a: 'Sama sekali tidak! JagoBisnis dirancang khusus untuk pelaku UMKM. Anda hanya perlu mengisi formulir, drag-and-drop bagian website yang disukai, dan website toko online Anda langsung siap dipakai.',
  },
  {
    q: 'Bagaimana cara menerima pembayaran pelanggan?',
    a: 'Kami menyediakan integrasi checkout dengan pembayaran digital terintegrasi (QRIS, Transfer Bank, E-Wallet) sehingga pelanggan bisa langsung membayar, dan notifikasi dikirim ke WhatsApp Anda.',
  },
  {
    q: 'Berapa banyak produk yang bisa saya upload?',
    a: 'Pada paket dasar gratis, Anda dapat mengupload hingga 50 produk lengkap dengan foto, deskripsi, dan varian harga.',
  },
  {
    q: 'Apakah saya bisa menggunakan nama domain sendiri?',
    a: 'Tentu saja! Anda bisa menghubungkan domain custom (seperti namatokomu.com) ke website JagoBisnis Anda di menu pengaturan integrasi.',
  },
];

// ─── DYNAMIC CANVAS PREVIEW ───────────────────────────────────────────────────

function DynamicCanvasPreview({
  businessName,
  category,
  hasGenerated,
}: {
  businessName: string;
  category: Category;
  hasGenerated: boolean;
}) {
  const cfg = CATEGORIES[category];
  const displayName = businessName.trim() || cfg.label;

  return (
    <div className="relative rounded-[2rem] bg-zinc-900 p-2.5 shadow-2xl border-4 border-zinc-800">
      {/* Browser Chrome */}
      <div className="bg-zinc-950 rounded-[1.6rem] overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="rounded-md bg-zinc-950 px-4 py-1 text-[10px] font-mono text-zinc-500 tracking-wider truncate max-w-[200px]">
            jago-bisnis.my.id/jagobisnis/{displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'toko-saya'}
          </div>
          <Globe className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
        </div>

        {/* Website Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category + hasGenerated}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`${cfg.previewBg} min-h-[320px] p-5 space-y-4`}
          >
            {/* Preview Header */}
            <div className="flex justify-between items-center">
              <span className="font-black text-white text-sm flex items-center gap-1.5">
                <Store className="h-4 w-4" style={{ color: cfg.accent }} />
                {displayName}
              </span>
              <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded-md">
                Online
              </span>
            </div>

            {/* Hero Block */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ backgroundColor: `${cfg.accent}20`, border: `1px solid ${cfg.accent}40` }}
            >
              <p className="text-[11px] font-black text-white leading-snug">
                {cfg.hero}
              </p>
              <p className="text-[9px] text-white/50">{cfg.sub}</p>
              <button
                className="mt-1 px-3 py-1.5 rounded-lg text-[10px] font-black text-black"
                style={{ backgroundColor: cfg.accent }}
              >
                Pesan via WhatsApp ✉️
              </button>
            </div>

            {/* Products Grid */}
            {hasGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {cfg.products.map((p, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    <div className="h-14 bg-white/10 rounded-lg flex items-center justify-center text-2xl">{p.emoji}</div>
                    <p className="text-[10px] font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] font-black" style={{ color: cfg.accent }}>{p.price}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {!hasGenerated && (
              <div className="flex items-center justify-center h-20 opacity-30">
                <p className="text-[10px] text-white/50 text-center">Masukkan nama bisnis di atas<br />untuk melihat preview website</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating WhatsApp Badge */}
      {hasGenerated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-5 -left-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-[200px]"
        >
          <div className="h-8 w-8 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase">Notif WhatsApp</p>
            <p className="text-[11px] font-black text-gray-800 dark:text-white leading-tight">Order Masuk! 🎉</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── REGISTER MODAL ───────────────────────────────────────────────────────────

function RegisterModal({
  isOpen,
  onClose,
  businessName,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  category: Category;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const slug = businessName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'toko-saya';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Semua kolom wajib diisi!');
      return;
    }
    setIsLoading(true);
    try {
      // 1. Register
      await authService.register({ name, email, password });
      // 2. Login & simpan token
      const loginRes = await authService.login({ email, password });
      localStorage.setItem('accessToken', loginRes.accessToken);
      // 3. Buat profil bisnis otomatis
      const biz = await businessService.create({
        name: businessName.trim() || 'Toko Saya',
        slug,
        category: category.toUpperCase(),
      });
      toast.success('Website bisnismu sudah siap! 🎉');
      router.push(`/dashboard/business/${biz.id}/website`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[#e8aa20] rounded-xl flex items-center justify-center">
                  <Store className="h-4 w-4 text-black" />
                </div>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  Klaim Website Gratis
                </span>
              </div>
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">
                Website <span className="font-black text-[#e8aa20]">"{businessName || 'Bisnismu'}"</span> sudah siap — tinggal buat akun!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Budi Santoso"
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8aa20] transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@contoh.com"
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8aa20] transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full h-12 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 pr-12 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8aa20] transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Membuat website bisnismu...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Buat Akun & Klaim Website
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-zinc-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-black text-[#e8aa20] hover:underline" onClick={onClose}>
              Masuk di sini
            </Link>
          </p>

          <p className="text-center text-[10px] text-gray-300 dark:text-zinc-600">
            Dengan mendaftar, kamu menyetujui{' '}
            <Link href="/terms" className="underline hover:text-[#e8aa20]" target="_blank">Syarat & Ketentuan</Link>
            {' '}dan{' '}
            <Link href="/privacy" className="underline hover:text-[#e8aa20]" target="_blank">Kebijakan Privasi</Link>.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

// ─── TEMPLATE SHOWCASE ────────────────────────────────────────────────────────

function TemplateShowcase({ onUse }: { onUse: (cat: Category) => void }) {
  const [activeTab, setActiveTab] = useState<Category>('kuliner');
  const cfg = CATEGORIES[activeTab];

  return (
    <section className="py-20 lg:py-28 bg-gray-50/50 dark:bg-zinc-900/20 border-t border-gray-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#e8aa20]">
            <MousePointerClick className="h-3.5 w-3.5" />
            Template Siap Pakai
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white">
            Pilih template, langsung jadi.
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 max-w-lg mx-auto">
            Kami sudah menyiapkan template premium untuk berbagai jenis usaha. Tinggal pilih, isi nama bisnis, dan website langsung live.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
            const c = CATEGORIES[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === cat
                    ? 'bg-[#e8aa20] text-black shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-[#e8aa20]/50'
                }`}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Template Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            {/* Preview */}
            <div className={`rounded-3xl p-8 bg-gradient-to-br ${cfg.bg} dark:from-zinc-900 dark:to-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl`}>
              <div className={`${cfg.previewBg} rounded-2xl p-5 space-y-4`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-white flex items-center gap-2">
                    <Store className="h-4 w-4" style={{ color: cfg.accent }} />
                    Contoh {cfg.label}
                  </span>
                  <span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded-md">Live</span>
                </div>
                <div className="rounded-xl p-4 space-y-2" style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}40` }}>
                  <p className="text-[11px] font-black text-white">{cfg.hero}</p>
                  <p className="text-[9px] text-white/50">{cfg.sub}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {cfg.products.map((p, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
                      <div className="h-12 bg-white/10 rounded-lg flex items-center justify-center text-xl">{p.emoji}</div>
                      <p className="text-[10px] font-bold text-white truncate">{p.name}</p>
                      <p className="text-[10px] font-black" style={{ color: cfg.accent }}>{p.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-4xl">{cfg.emoji}</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  Template {cfg.label}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Sudah dilengkapi dengan desain premium, tata letak produk yang memukau, dan tombol order WhatsApp yang langsung terhubung ke nomor bisnis Anda.
                </p>
              </div>
              <ul className="space-y-2.5">
                {['Warna dan desain khas industri', 'Copywriting otomatis AI', 'Checkout WhatsApp terintegrasi', 'Optimasi SEO built-in'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-zinc-300">
                    <div className="h-5 w-5 rounded-full bg-[#e8aa20]/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-[#e8aa20] stroke-[3]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onUse(activeTab)}
                className="h-12 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] px-7 text-sm font-black text-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="h-4 w-4" />
                Gunakan Template {cfg.emoji}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<Category>('kuliner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!businessName.trim()) {
      toast.error('Masukkan nama bisnis terlebih dahulu!');
      return;
    }
    setIsGenerating(true);
    setHasGenerated(false);
    setGenerationStep(0);

    for (let i = 0; i < AI_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 750));
      setGenerationStep(i);
    }

    setIsGenerating(false);
    setHasGenerated(true);
  }, [businessName]);

  const handleUseTemplate = (cat: Category) => {
    setCategory(cat);
    setShowRegisterModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 font-sans">

      {/* ── REGISTER MODAL ── */}
      <AnimatePresence>
        {showRegisterModal && (
          <RegisterModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            businessName={businessName}
            category={category}
          />
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8aa20] shadow-md shadow-amber-500/10">
              <Store className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">
              Jago<span className="text-[#e8aa20]">Bisnis</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#template" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] transition-colors">Template</a>
            <a href="#fitur" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] transition-colors">Fitur</a>
            <a href="#faq" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-black text-gray-700 dark:text-zinc-300 hover:text-[#e8aa20] transition-colors px-3 py-2">
              Masuk
            </Link>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="h-11 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] px-5 text-sm font-black text-black shadow-md shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Mulai Gratis
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO: AI SIMULATOR ── */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e8aa20]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#e8aa20]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 items-center">

            {/* Left: Control Panel */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 dark:bg-[#e8aa20]/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#e8aa20]">
                <Sparkles className="h-3.5 w-3.5 fill-[#e8aa20]" />
                AI Website Generator — Gratis!
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-950 dark:text-white leading-[1.05]">
                  Website bisnismu<br />
                  <span className="text-[#e8aa20]">1 menit jadi.</span>
                </h1>
                <p className="max-w-lg text-base sm:text-lg font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Ketik nama usahamu, pilih kategori, dan AI kami langsung membuat website bisnis yang profesional — lengkap dengan copywriting, desain, dan checkout WhatsApp.
                </p>
              </div>

              {/* AI Input Form */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Nama Usahamu
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); setHasGenerated(false); }}
                    placeholder="contoh: Warung Makan Sederhana"
                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#e8aa20] transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Jenis Bisnis
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
                      const c = CATEGORIES[cat];
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { setCategory(cat); setHasGenerated(false); }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                            category === cat
                              ? 'bg-[#e8aa20] text-black shadow-sm'
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <span>{c.emoji}</span>
                          {c.label.split(' / ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                {!hasGenerated ? (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !businessName.trim()}
                    className="w-full h-13 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/20"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="min-w-[220px] text-left">{AI_STEPS[generationStep]}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Bikin Website dengan AI ⚡
                      </>
                    )}
                  </button>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full h-13 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-zinc-100 text-white dark:text-black font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-400 dark:text-green-600" />
                    Klaim Website &ldquo;{businessName}&rdquo; Sekarang (Gratis) 🎉
                  </motion.button>
                )}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#e8aa20]" />
                  Gratis Selamanya
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  Website Live dalam 1 Menit
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  Tanpa Coding
                </div>
              </div>
            </div>

            {/* Right: Dynamic Preview */}
            <div>
              <DynamicCanvasPreview
                businessName={businessName}
                category={category}
                hasGenerated={hasGenerated}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── TEMPLATE GALLERY ── */}
      <div id="template">
        <TemplateShowcase onUse={handleUseTemplate} />
      </div>

      {/* ── FITUR: WEBSITE BUILDER ── */}
      <section id="fitur" className="py-20 lg:py-32 border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 px-4 py-1 text-xs font-black uppercase text-[#e8aa20]">
                Website Builder Instan
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Bikin website,<br />se-instan minum kopi.
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                Tidak butuh coding, tidak butuh pusing memikirkan server. Cukup drag & drop bagian yang diinginkan, pasang produk, dan klik publish!
              </p>
              <ul className="space-y-3.5">
                {[
                  '11 jenis block siap pakai (Banner, Produk, Testimoni, FAQ, dll)',
                  'Drag & Drop visual editor termudah, cocok untuk pemula',
                  'URL gratis (jago-bisnis.my.id/jagobisnis/namabisnismu)',
                  'Optimasi SEO otomatis agar mudah dicari di Google',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8aa20]/10 text-[#e8aa20]">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-2 text-sm font-black text-[#e8aa20] hover:text-[#d4991c] group"
              >
                Coba Buat Website Pertama Anda
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Builder mockup */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                <span className="text-xs font-black uppercase text-gray-400">Visual Editor — Kanvas Blok</span>
                <div className="px-2 py-0.5 rounded bg-[#e8aa20]/10 text-[10px] font-bold text-[#e8aa20]">Live Editor</div>
              </div>
              {['🏠 Header Banner Hero — Tagline & promo utama', '🛍️ Katalog Produk — Pajang daftar harga & produk', '💬 Tombol WhatsApp — Chat langsung dengan pelanggan', '📍 Peta Google Maps — Tampilkan lokasi usahamu'].map((block, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center gap-3 hover:border-[#e8aa20]/40 hover:bg-[#e8aa20]/5 transition-all cursor-pointer">
                  <span className="text-base">{block.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">{block.split(' — ')[0].slice(2)}</span>
                  <span className="ml-auto text-[10px] text-gray-400">{block.split(' — ')[1]}</span>
                </div>
              ))}
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-950 p-3 border border-dashed border-gray-200 dark:border-zinc-800 text-center text-xs font-bold text-gray-400">
                ⚡ Perubahan tersimpan otomatis secara real-time!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 lg:py-32 bg-gray-50/50 dark:bg-zinc-900/20 border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 px-4 py-1 text-xs font-black uppercase text-[#e8aa20]">
                Tanya Jawab
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Sebelum kamu<br />klik daftar.
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                Punya pertanyaan? Temukan jawabannya di sini, atau hubungi kami langsung via WhatsApp.
              </p>
              <a
                href="https://wa.me/6285930258437"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 hover:bg-green-600 px-6 text-sm font-black text-white hover:scale-105 transition-all gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Hubungi Tim JagoBisnis
              </a>
            </div>
            <div className="lg:col-span-8 space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-base font-black text-gray-900 dark:text-white pr-4">{item.q}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#e8aa20]' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="p-6 pt-0 border-t border-gray-50 dark:border-zinc-800 text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed bg-gray-50/30 dark:bg-zinc-900/40">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 lg:py-32 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative rounded-[2.5rem] bg-[#1F2937] p-10 md:p-16 text-center text-white overflow-hidden shadow-2xl border border-zinc-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8aa20]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Mulai bangun bisnismu<br />tanpa batasan coding.
              </h2>
              <p className="text-base font-medium text-zinc-400 leading-relaxed">
                Bergabung bersama UMKM Indonesia yang sudah Go-Digital dengan JagoBisnis. Instan, mudah, dan gratis selamanya.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full sm:w-auto h-14 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] px-8 text-base font-black text-black hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Buat Website Sekarang
                  <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto h-14 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 px-8 text-base font-black text-white hover:scale-105 transition-all flex items-center justify-center"
                >
                  Masuk ke Dashboard
                </Link>
              </div>
            </div>
            <Store className="absolute -right-16 -bottom-16 h-80 w-80 text-white/5 rotate-12" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8aa20]">
              <Store className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              Jago<span className="text-[#e8aa20]">Bisnis</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-gray-500 dark:text-zinc-400">
            <Link href="/terms" className="hover:text-[#e8aa20] transition-colors">Syarat & Ketentuan</Link>
            <Link href="/privacy" className="hover:text-[#e8aa20] transition-colors">Kebijakan Privasi</Link>
            <span className="text-gray-300 dark:text-zinc-800">|</span>
            <span>&copy; {new Date().getFullYear()} JagoBisnis. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
