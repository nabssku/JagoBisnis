'use client';

import React from 'react';
import Link from 'next/link';
import { Store, ArrowLeft, ShieldCheck, EyeOff, Lock, Server } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Navbar */}
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

          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-black text-gray-600 dark:text-zinc-400 hover:text-[#e8aa20] dark:hover:text-[#e8aa20] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        
        {/* Banner Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8aa20]/10 text-[#e8aa20] dark:bg-[#e8aa20]/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Kebijakan Privasi & Data
          </h1>
          <p className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content Details */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-8 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">1</span>
              Informasi yang Kami Kumpulkan
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              JagoBisnis berkomitmen melindungi privasi data pribadi Anda serta pelanggan toko Anda. Kami mengumpulkan beberapa informasi dasar saat Anda mendaftar: nama lengkap, alamat email, kata sandi ter-enkripsi, data nama bisnis/toko, slug unik, deskripsi bisnis, nomor kontak WhatsApp, dan alamat fisik toko Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">2</span>
              Bagaimana Kami Menggunakan Data Anda
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Kami menggunakan informasi yang dikumpulkan untuk keperluan operasional platform, di antaranya:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-zinc-400 space-y-1.5">
              <li>Membuat, mengelola, dan mempublikasikan website toko online instan Anda.</li>
              <li>Memproses checkout belanjaan pelanggan Anda dan meneruskan detail pesanan ke kontak WhatsApp Anda.</li>
              <li>Mengirimkan notifikasi tagihan transaksi, verifikasi email, maupun pembaruan sistem yang penting.</li>
              <li>Menganalisis performa kunjungan website toko Anda (seperti klik tautan WA, klik rincian alamat) guna meningkatkan konversi penjualan Anda.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">3</span>
              Keamanan Data & Enkripsi
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Keamanan adalah prioritas kami. Seluruh password merchant JagoBisnis di-hash menggunakan algoritma modern satu arah sebelum disimpan di database PostgreSQL kami. Komunikasi API antara frontend dan backend berjalan penuh melalui protokol aman HTTPS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">4</span>
              Pembagian Data Pihak Ketiga
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              JagoBisnis tidak akan pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak eksternal untuk keperluan periklanan/marketing tanpa persetujuan eksplisit Anda. Kami hanya membagikan data yang mutlak diperlukan kepada mitra gerbang pembayaran terpercaya kami (seperti Xendit/Pakasir) demi kesuksesan pemrosesan transaksi belanja pelanggan Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">5</span>
              Hak Akses Data Anda
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Sebagai pemilik data, Anda memiliki kontrol penuh. Anda dapat mengubah detail informasi toko, menghapus produk, memperbarui nomor WhatsApp, atau mengajukan penutupan akun secara permanen melalui menu pengaturan di dalam dashboard JagoBisnis.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-zinc-950/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-[#e8aa20]" />
              <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">Keamanan data Anda dilindungi sepenuhnya secara end-to-end.</span>
            </div>
            <a 
              href="mailto:privacy@jagobisnis.id" 
              className="text-xs font-black text-[#e8aa20] underline hover:text-[#d4991c]"
            >
              Hubungi Tim Privasi
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 py-12">
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
            <span className="text-gray-300 dark:text-zinc-800">|</span>
            <span>&copy; {new Date().getFullYear()} JagoBisnis. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
