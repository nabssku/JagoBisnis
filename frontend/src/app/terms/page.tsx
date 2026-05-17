'use client';

import React from 'react';
import Link from 'next/link';
import { Store, ArrowLeft, Shield, Scale, Scroll, HelpCircle } from 'lucide-react';

export default function TermsPage() {
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
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Syarat & Ketentuan Penggunaan
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
              Ketentuan Umum
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Selamat datang di JagoBisnis. Dengan mengakses dan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi dalam Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian, mohon untuk tidak melanjutkan penggunaan platform kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">2</span>
              Registrasi Akun & Batasan Profil
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Untuk menikmati seluruh fitur JagoBisnis, Anda wajib melakukan registrasi akun menggunakan email aktif yang sah. 
              Sebagai bagian dari kebijakan platform kami untuk memaksimalkan dukungan kualitas UMKM, kami memberlakukan batasan ketat: **Maksimal 1 (satu) Akun hanya diperbolehkan memiliki 1 (satu) Profil Bisnis aktif**. Pembuatan akun palsu atau pemanfaatan celah untuk melanggar aturan ini dapat berakibat pada penangguhan akun secara permanen.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">3</span>
              Penggunaan Layanan & Konten
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Anda bertanggung jawab penuh atas segala bentuk konten, gambar produk, tautan WhatsApp, dan deskripsi bisnis yang Anda upload ke platform kami. JagoBisnis berhak untuk menghapus konten yang dinilai melanggar hukum di Indonesia, mengandung unsur SARA, pornografi, maupun pelanggaran hak cipta pihak lain tanpa pemberitahuan terlebih dahulu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">4</span>
              Sistem Pembayaran Pakasir
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              JagoBisnis memfasilitasi transaksi online pelanggan toko Anda melalui gerbang pembayaran terintegrasi Pakasir & Xendit. 
              Seluruh ketentuan biaya layanan penarikan saldo, limitasi transfer, dan verifikasi merchant tunduk pada ketentuan hukum perbankan digital serta partner finansial kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8aa20]/10 text-xs font-black text-[#e8aa20]">5</span>
              Batasan Tanggung Jawab
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              JagoBisnis tidak bertanggung jawab atas segala bentuk kerugian finansial atau sengketa transaksi yang terjadi antara Anda sebagai pemilik toko dan pelanggan Anda. Platform kami hanyalah penyedia infrastruktur website dan checkout instan.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-zinc-950/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <Scroll className="h-5 w-5 text-[#e8aa20]" />
              <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">Punya kendala mengenai aturan penggunaan?</span>
            </div>
            <a 
              href="mailto:support@jagobisnis.id" 
              className="text-xs font-black text-[#e8aa20] underline hover:text-[#d4991c]"
            >
              Hubungi Tim Support
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
            <Link href="/privacy" className="hover:text-[#e8aa20] transition-colors">Kebijakan Privasi</Link>
            <span className="text-gray-300 dark:text-zinc-800">|</span>
            <span>&copy; {new Date().getFullYear()} JagoBisnis. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
