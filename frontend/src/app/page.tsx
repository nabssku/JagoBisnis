'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  Globe, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  ShoppingBag, 
  MessageSquare, 
  ChevronDown, 
  HelpCircle,
  Play,
  Layers,
  Sparkles,
  MousePointerClick,
  QrCode,
  CheckCircle2,
  Lock
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Apakah JagoBisnis benar-benar gratis?',
    a: 'Ya! JagoBisnis menyediakan paket gratis selamanya yang mencakup 1 Profil Bisnis, Website Builder instan, checkout WhatsApp, dan hosting subdomain jagobisnis.id. Anda bisa mulai sekarang tanpa biaya sama sekali.'
  },
  {
    q: 'Apakah saya membutuhkan keahlian coding?',
    a: 'Sama sekali tidak! JagoBisnis dirancang khusus untuk pelaku UMKM. Anda hanya perlu mengisi formulir, drag-and-drop bagian website yang disukai, dan website toko online Anda langsung siap dipakai.'
  },
  {
    q: 'Bagaimana cara menerima pembayaran pelanggan?',
    a: 'Kami menyediakan integrasi checkout dengan pembayaran digital terintegrasi (QRIS, Transfer Bank, E-Wallet) sehingga pelanggan Anda bisa langsung membayar tanpa repot, dan notifikasi akan dikirim langsung ke WhatsApp Anda.'
  },
  {
    q: 'Berapa banyak produk yang bisa saya upload?',
    a: 'Pada paket dasar gratis, Anda dapat mengupload hingga 50 produk lengkap dengan foto, deskripsi, dan varian harga. Sangat cukup untuk memulai bisnis retail maupun kuliner.'
  },
  {
    q: 'Apakah saya bisa menggunakan nama domain sendiri?',
    a: 'Tentu saja! Anda bisa menghubungkan domain custom (seperti namatokomu.com) ke website JagoBisnis Anda di menu pengaturan integrasi.'
  }
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Showcase States
  const [showcaseCategory, setShowcaseCategory] = useState<'kopi' | 'camilan'>('kopi');
  const [builderActiveBlock, setBuilderActiveBlock] = useState<string>('hero');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 font-sans transition-colors duration-300">
      
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8aa20] shadow-md shadow-amber-500/10">
              <Store className="h-5.5 w-5.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">
              Jago<span className="text-[#e8aa20]">Bisnis</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] dark:hover:text-[#e8aa20] transition-colors">Fitur</a>
            <a href="#toko" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] dark:hover:text-[#e8aa20] transition-colors">Toko Online</a>
            <a href="#faq" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] dark:hover:text-[#e8aa20] transition-colors">FAQ</a>
            <Link href="/terms" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] dark:hover:text-[#e8aa20] transition-colors">Syarat & Ketentuan</Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-black text-gray-700 dark:text-zinc-300 hover:text-[#e8aa20] transition-colors px-3 py-2"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="h-11 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] px-5 text-sm font-black text-black shadow-md shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8aa20]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e8aa20]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 dark:bg-[#e8aa20]/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#e8aa20]">
                <Sparkles className="h-3.5 w-3.5 fill-[#e8aa20]" />
                All-in-One Platform UMKM Indonesia
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-950 dark:text-white leading-[1.05]">
                  Bangun bisnismu <br />
                  <span className="text-[#e8aa20]">tanpa ribet.</span>
                </h1>
                <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Bikin website profile, pajang katalog produk, terima orderan checkout otomatis via WhatsApp & Pembayaran QRIS. Semua dikelola dalam satu aplikasi premium.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/register" 
                  className="w-full sm:w-auto h-14 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] px-8 text-base font-black text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#fitur" 
                  className="w-full sm:w-auto h-14 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-100 px-8 text-base font-black text-gray-800 dark:text-zinc-200 hover:scale-105 transition-all flex items-center justify-center"
                >
                  Lihat Fitur
                </a>
              </div>

              {/* Badges/Trust */}
              <div className="pt-6 border-t border-gray-100 dark:border-zinc-900 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#e8aa20]" />
                  Maks 1 Bisnis Per Akun
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  Website Instan 3 Menit
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  Mendukung Checkout QRIS
                </div>
              </div>
            </div>

            {/* Right Showcase: Interactive Editor Mockup */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[2.5rem] bg-zinc-900 p-3 shadow-2xl border-4 border-zinc-800">
                
                {/* Mock Website Bar */}
                <div className="bg-zinc-950 rounded-[2rem] overflow-hidden border border-zinc-800">
                  <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-850 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="rounded-lg bg-zinc-950 px-6 py-1 text-[10px] font-mono text-zinc-500 tracking-wider">
                      jago-bisnis.my.id/jago/kopi-sedap
                    </div>
                    <Globe className="h-4 w-4 text-zinc-600" />
                  </div>

                  {/* Mock Site Content */}
                  <div className="p-6 space-y-6 max-h-[350px] overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                      <span className="font-black text-white text-sm tracking-tight flex items-center gap-1.5">
                        <Store className="h-4 w-4 text-[#e8aa20]" />
                        Kopi Sedap
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                        Online
                      </span>
                    </div>

                    {/* Banner Block */}
                    <div className="rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 p-5 relative overflow-hidden border border-zinc-750">
                      <div className="space-y-2 relative z-10">
                        <h4 className="text-base font-black text-white leading-tight">Rasakan Kopi Premium Asli Indonesia</h4>
                        <p className="text-[10px] text-zinc-400 max-w-[200px]">Diseduh dengan cinta dari biji kopi pilihan nusantara.</p>
                      </div>
                      <div className="absolute right-4 bottom-2 text-5xl">☕</div>
                    </div>

                    {/* Filter Category */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowcaseCategory('kopi')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showcaseCategory === 'kopi' ? 'bg-[#e8aa20] text-black' : 'bg-zinc-800 text-zinc-400'}`}
                      >
                        Varian Kopi
                      </button>
                      <button 
                        onClick={() => setShowcaseCategory('camilan')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showcaseCategory === 'camilan' ? 'bg-[#e8aa20] text-black' : 'bg-zinc-800 text-zinc-400'}`}
                      >
                        Camilan Pendamping
                      </button>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {showcaseCategory === 'kopi' ? (
                        <>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2 hover:border-zinc-700 transition-colors">
                            <div className="h-24 bg-zinc-800 rounded-lg flex items-center justify-center text-3xl">☕</div>
                            <h5 className="text-xs font-bold text-white">Es Kopi Susu Aren</h5>
                            <p className="text-[11px] font-black text-[#e8aa20]">Rp 18.000</p>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2 hover:border-zinc-700 transition-colors">
                            <div className="h-24 bg-zinc-800 rounded-lg flex items-center justify-center text-3xl">🥤</div>
                            <h5 className="text-xs font-bold text-white">Caramel Macchiato</h5>
                            <p className="text-[11px] font-black text-[#e8aa20]">Rp 24.000</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2 hover:border-zinc-700 transition-colors">
                            <div className="h-24 bg-zinc-800 rounded-lg flex items-center justify-center text-3xl">🥐</div>
                            <h5 className="text-xs font-bold text-white">Croissant Keju</h5>
                            <p className="text-[11px] font-black text-[#e8aa20]">Rp 15.000</p>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2 hover:border-zinc-700 transition-colors">
                            <div className="h-24 bg-zinc-800 rounded-lg flex items-center justify-center text-3xl">🍪</div>
                            <h5 className="text-xs font-bold text-white">Choco Soft Cookie</h5>
                            <p className="text-[11px] font-black text-[#e8aa20]">Rp 12.000</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulated Floating Tooltip */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-[220px]">
                  <div className="h-10 w-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase">Notif WhatsApp</p>
                    <p className="text-xs font-black text-gray-800 dark:text-white leading-tight">Order Masuk Lancar!</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Section 01: Website Builder */}
      <section id="fitur" className="py-20 lg:py-32 bg-gray-50/50 dark:bg-zinc-900/20 border-y border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Mockup Showcase */}
            <div className="lg:col-span-6 order-last lg:order-first">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#e8aa20]" />
                    <span className="text-xs font-black uppercase text-gray-400">Desain Blok Kanvas</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-[#e8aa20]/10 text-[10px] font-bold text-[#e8aa20]">Visual Editor</div>
                </div>

                <div className="space-y-3">
                  <div 
                    onClick={() => setBuilderActiveBlock('hero')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${builderActiveBlock === 'hero' ? 'border-[#e8aa20] bg-[#e8aa20]/5' : 'border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">🏠</div>
                      <div>
                        <h4 className="text-xs font-black">Header Banner Hero</h4>
                        <p className="text-[10px] text-gray-400">Tampilkan tagline & promo utama toko.</p>
                      </div>
                    </div>
                    {builderActiveBlock === 'hero' && <Check className="h-4 w-4 text-[#e8aa20]" />}
                  </div>

                  <div 
                    onClick={() => setBuilderActiveBlock('katalog')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${builderActiveBlock === 'katalog' ? 'border-[#e8aa20] bg-[#e8aa20]/5' : 'border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">🛍️</div>
                      <div>
                        <h4 className="text-xs font-black">Katalog Produk</h4>
                        <p className="text-[10px] text-gray-400">Pajang daftar produk & harga diskon.</p>
                      </div>
                    </div>
                    {builderActiveBlock === 'katalog' && <Check className="h-4 w-4 text-[#e8aa20]" />}
                  </div>

                  <div 
                    onClick={() => setBuilderActiveBlock('wa')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${builderActiveBlock === 'wa' ? 'border-[#e8aa20] bg-[#e8aa20]/5' : 'border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">💬</div>
                      <div>
                        <h4 className="text-xs font-black">Link WhatsApp</h4>
                        <p className="text-[10px] text-gray-400">Tombol tanya jawab langsung via chat.</p>
                      </div>
                    </div>
                    {builderActiveBlock === 'wa' && <Check className="h-4 w-4 text-[#e8aa20]" />}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-zinc-950 p-4 border border-dashed border-gray-200 dark:border-zinc-800 text-center text-xs font-bold text-gray-400">
                  ⚡ Semua perubahan tersimpan otomatis secara real-time!
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 px-4 py-1 text-xs font-black uppercase text-[#e8aa20]">
                Website Builder Instan
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Bikin website, <br />
                se-instan minum kopi.
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                Anda tidak butuh coding, tidak butuh pusing memikirkan server atau domain. Cukup drag & drop bagian yang Anda inginkan, pasang produk, dan klik publish!
              </p>

              {/* Feature checks */}
              <ul className="space-y-3.5">
                {[
                  '13 jenis block siap pakai (Banner, Produk, Testimoni, FAQ, dll)',
                  'Sistem Drag & Drop termudah sedunia, cocok untuk pemula',
                  'Slug gratis (jago-bisnis.my.id/jago/namabisnismu)',
                  'Optimasi SEO otomatis agar mudah dicari pelanggan di Google'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8aa20]/10 text-[#e8aa20]">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 text-sm font-black text-[#e8aa20] hover:text-[#d4991c] group"
                >
                  Coba Buat Website Pertama Anda
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section 02: Online Store Checkout */}
      <section id="toko" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1 text-xs font-black uppercase text-green-500">
                Katalog & Checkout
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Katalog & checkout <br />
                yang tinggal pakai.
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                Ubah pengunjung menjadi pembeli dengan alur belanja super cepat. Terima order langsung ke nomor WhatsApp bisnis Anda, lengkap dengan notifikasi rincian pembayaran.
              </p>

              {/* Feature List */}
              <ul className="space-y-3.5">
                {[
                  'Pembayaran via Pakasir terintegrasi (QRIS otomatis, Bank Transfer)',
                  'Notifikasi otomatis rincian belanja ke WhatsApp pelanggan',
                  'Kalkulator ongkos kirim otomatis yang terhubung ke kurir nasional',
                  'Sistem verifikasi order instan di dashboard bisnis Anda'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 text-sm font-black text-green-500 hover:text-green-600 group"
                >
                  Mulai Jualan dengan Katalog JagoBisnis
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Checkout Simulation */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
                
                {/* Steps indicator */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                  <span className="text-xs font-black text-gray-400 uppercase">Simulasi Checkout Pelanggan</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCheckoutStep(1)} 
                      className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${checkoutStep === 1 ? 'bg-[#e8aa20] text-black font-black' : 'bg-gray-100 dark:bg-zinc-850 text-gray-400'}`}
                    >
                      1
                    </button>
                    <button 
                      onClick={() => setCheckoutStep(2)} 
                      className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${checkoutStep === 2 ? 'bg-[#e8aa20] text-black font-black' : 'bg-gray-100 dark:bg-zinc-850 text-gray-400'}`}
                    >
                      2
                    </button>
                    <button 
                      onClick={() => setCheckoutStep(3)} 
                      className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${checkoutStep === 3 ? 'bg-[#e8aa20] text-black font-black' : 'bg-gray-100 dark:bg-zinc-850 text-gray-400'}`}
                    >
                      3
                    </button>
                  </div>
                </div>

                {/* Step content */}
                <div className="min-h-[160px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {checkoutStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-black">Keranjang Belanja</h4>
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-100 dark:border-zinc-850">
                          <span className="text-xs font-bold">1x Es Kopi Susu Aren</span>
                          <span className="text-xs font-black text-[#e8aa20]">Rp 18.000</span>
                        </div>
                        <Button 
                          onClick={() => setCheckoutStep(2)}
                          className="w-full h-11 bg-black dark:bg-white text-white dark:text-black font-black rounded-xl text-xs flex items-center justify-center gap-2"
                        >
                          Pilih Metode Pembayaran
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}

                    {checkoutStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-black">Pilih Pembayaran</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border-2 border-[#e8aa20] bg-[#e8aa20]/5 p-3 rounded-xl flex items-center gap-2 cursor-pointer">
                            <QrCode className="h-4 w-4 text-[#e8aa20]" />
                            <span className="text-xs font-black">QRIS / E-Wallet</span>
                          </div>
                          <div className="border border-gray-100 dark:border-zinc-850 p-3 rounded-xl flex items-center gap-2 opacity-50 cursor-pointer">
                            <Lock className="h-4 w-4" />
                            <span className="text-xs font-bold">Transfer Bank</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setCheckoutStep(3)}
                          className="w-full h-11 bg-[#e8aa20] text-black font-black rounded-xl text-xs flex items-center justify-center gap-2"
                        >
                          Bayar via QRIS Instan
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}

                    {checkoutStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3 text-center py-2"
                      >
                        <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <h4 className="text-sm font-black text-green-500">Pembayaran Sukses!</h4>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500">Rincian pesanan telah dikirim ke WhatsApp Pembeli & Penjual secara otomatis.</p>
                        <Button 
                          onClick={() => setCheckoutStep(1)}
                          variant="outline"
                          className="h-9 px-4 border-gray-200 dark:border-zinc-800 text-xs font-bold rounded-xl"
                        >
                          Ulangi Simulasi
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section 03: FAQ */}
      <section id="faq" className="py-20 lg:py-32 bg-gray-50/50 dark:bg-zinc-900/20 border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Left FAQ text */}
            <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8aa20]/10 px-4 py-1 text-xs font-black uppercase text-[#e8aa20]">
                Tanya Jawab
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Sebelum kamu <br />
                klik daftar.
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed">
                Punya pertanyaan mengenai fitur, biaya, atau batasan sistem? Temukan jawabannya di sini, atau hubungi kami langsung via Live Chat.
              </p>
              <div className="pt-2">
                <a 
                  href="https://wa.me/628123456789" 
                  target="_blank"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 hover:bg-green-600 px-6 text-sm font-black text-white hover:scale-105 transition-all gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  Hubungi Tim Temmu
                </a>
              </div>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-8 space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-base font-black text-gray-900 dark:text-white pr-4">
                      {item.q}
                    </span>
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
                        <div className="p-6 pt-0 border-t border-gray-50 dark:border-zinc-850 text-sm font-medium text-gray-500 dark:text-zinc-400 leading-relaxed bg-gray-50/30 dark:bg-zinc-900/40">
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

      {/* 6. Section 04: Bottom CTA Banner */}
      <section className="py-20 lg:py-32 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative rounded-[2.5rem] bg-[#1F2937] p-10 md:p-16 text-center text-white overflow-hidden shadow-2xl border border-zinc-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8aa20]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Mulai bangun bisnismu <br />
                tanpa batasan coding.
              </h2>
              <p className="text-base font-medium text-zinc-400 leading-relaxed">
                Gabung bersama ratusan UMKM Indonesia yang telah Go-Digital menggunakan aplikasi modern JagoBisnis. Instan, mudah, dan gratis selamanya.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  href="/register"
                  className="w-full sm:w-auto h-14 rounded-xl bg-[#e8aa20] hover:bg-[#d4991c] px-8 text-base font-black text-black hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Buat Profil Toko Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  href="/login"
                  className="w-full sm:w-auto h-14 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 px-8 text-base font-black text-white hover:scale-105 transition-all flex items-center justify-center"
                >
                  Masuk ke Dashboard
                </Link>
              </div>
            </div>
            {/* Background Decorative Icon */}
            <Store className="absolute -right-16 -bottom-16 h-80 w-80 text-white/5 rotate-12" />
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8aa20]">
              <Store className="h-4.5 w-4.5 text-black" strokeWidth={2.5} />
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
