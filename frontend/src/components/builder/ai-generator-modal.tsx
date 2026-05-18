"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Coffee, 
  Shirt, 
  Tv, 
  Users, 
  Wrench, 
  Utensils, 
  Smile, 
  RefreshCw, 
  CheckCircle2, 
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { Section, SiteTheme } from '@/types/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: { sections: Section[]; theme: SiteTheme }) => void;
}

const PRESETS = [
  { id: 'cafe', name: 'Kafe & Kopi', icon: Coffee, desc: 'Warkop, Coffee Shop, Pastry' },
  { id: 'fashion', name: 'Butik & Fashion', icon: Shirt, desc: 'Pakaian, Aksesoris, Hijab' },
  { id: 'laundry', name: 'Laundry Kiloan', icon: RefreshCw, desc: 'Cuci Sepatu, Kiloan, Satuan' },
  { id: 'tech', name: 'Teknologi & Gadget', icon: Tv, desc: 'Servis Laptop, Toko HP, Aksesoris' },
  { id: 'barber', name: 'Barbershop', icon: Users, desc: 'Pangkas Rambut, Salon Kecantikan' },
  { id: 'food', name: 'Kuliner & Makanan', icon: Utensils, desc: 'Catering, Resto, Angkringan' },
  { id: 'service', name: 'Jasa & Konsultasi', icon: Wrench, desc: 'Fotografi, Servis AC, Kontraktor' },
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate 
}) => {
  const [prompt, setPrompt] = useState('');
  const [activePreset, setActivePreset] = useState<string>('cafe');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const loadingTexts = [
    { threshold: 0, text: 'Menganalisis detail usaha Anda... 🧠' },
    { threshold: 20, text: 'Merumuskan palet warna & tipografi modern... 🎨' },
    { threshold: 45, text: 'Menyusun teks headline, deskripsi, & CTA persuasif... ✍️' },
    { threshold: 70, text: 'Merangkai struktur elemen visual & layout responsif... 🏗️' },
    { threshold: 90, text: 'Menyelesaikan rancangan visual builder... ✨' },
  ];

  useEffect(() => {
    if (!isGenerating) return;

    const currentText = loadingTexts.find(lt => progress >= lt.threshold);
    if (currentText) {
      setLoadingText(currentText.text);
    }
  }, [progress, isGenerating]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual layout structure generation based on Preset and Prompt
            const generatedData = compileNicheData(activePreset, prompt);
            onGenerate(generatedData);
            setIsGenerating(false);
            onClose();
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 4) + 2;
      });
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-850/80 shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">AI Landing Page Generator</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Rancang website UMKM otomatis dalam hitungan detik</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isGenerating}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isGenerating ? (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1.5 scrollbar-thin">
            {/* Category selection */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Pilih Kategori Bisnis (Niche Preset)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePreset(p.id)}
                      className={cn(
                        "p-3 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.97] cursor-pointer min-h-[90px]",
                        activePreset === p.id 
                          ? "border-primary bg-primary/[0.03] dark:bg-amber-400/[0.02]" 
                          : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                      )}
                    >
                      <Icon className={cn("h-4.5 w-4.5 mb-2", activePreset === p.id ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">{p.name}</div>
                        <div className="text-[9px] text-muted-foreground/80 mt-0.5 leading-normal truncate">{p.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Area */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                Tulis Deskripsi Khusus Usaha Anda (Opsional)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Toko kue premium rasa matcha dan cokelat dengan kemasan ramah lingkungan, berlokasi di Bandung dekat stasiun..."
                className="w-full min-h-[100px] p-4 text-xs font-semibold rounded-2xl border border-gray-200 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              />
              <p className="text-[9px] text-muted-foreground/80 leading-relaxed">
                * Semakin spesifik detail produk, layanan, atau lokasi yang Anda tulis, semakin akurat teks pemasaran yang akan digenerasikan oleh AI.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 rounded-xl h-11 text-xs font-bold"
              >
                Batal
              </Button>
              <Button 
                onClick={handleGenerate} 
                className="flex-[2] rounded-xl h-11 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4 fill-white" />
                Rancang Website Sekarang
              </Button>
            </div>
          </div>
        ) : (
          /* High-Fidelity Generating State */
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 space-y-6">
            <div className="relative h-20 w-20 flex items-center justify-center">
              {/* Spinning loading halo */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin" />
              <BrainCircuit className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>

            <div className="space-y-2 text-center w-full max-w-sm">
              <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{loadingText}</div>
              <div className="h-2 w-full bg-gray-100 dark:bg-zinc-850 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-100 shadow-md shadow-amber-500/30" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/80 font-bold">{progress}% Selesai</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// High-Fidelity Indonesian Copy & Layout Suggestion Compiler
function compileNicheData(niche: string, customPrompt: string): { sections: Section[]; theme: SiteTheme } {
  // Common details pulled from prompt
  const hasLocation = customPrompt.toLowerCase().includes('jakarta') ? 'Jakarta' : 
                      customPrompt.toLowerCase().includes('bandung') ? 'Bandung' : 
                      customPrompt.toLowerCase().includes('surabaya') ? 'Surabaya' : 
                      customPrompt.toLowerCase().includes('bali') ? 'Bali' : 'Kota Anda';

  let theme: SiteTheme = {
    primaryColor: '#e8aa20',
    font: 'Outfit',
    logoIcon: 'coffee',
    textColor: '#1f2937',
    backgroundColor: '#ffffff'
  };

  let sections: Section[] = [];

  switch (niche) {
    case 'cafe':
      theme = {
        primaryColor: '#8B5A2B', // Warm Brown
        font: 'Outfit',
        logoIcon: 'coffee',
        textColor: '#1e293b',
        backgroundColor: '#fafaf9',
        ...({
          secondaryColor: '#2d1a0f',
          accentColor: '#d97706',
          headingFont: 'Outfit',
          bodyFont: 'Inter',
          borderRadius: '1rem',
          shadowStyle: 'lg',
          buttonStyle: 'pill',
          linkStyle: 'hover-underline',
          spacingSystem: 'cozy'
        } as any)
      };
      sections = [
        {
          id: `hero-${Date.now()}`,
          type: 'hero',
          order: 1,
          content: {
            headline: 'Cita Rasa Kopi Autentik & Suasana Hangat yang Rileks',
            subheadline: `Nikmati racikan kopi premium dari biji nusantara pilihan terbaik langsung di ${hasLocation}. Tempat ideal untuk bekerja, santai, maupun bercengkerama.`,
            buttonText: 'Jelajahi Menu Kami',
            buttonUrl: '#products',
            buttons: { custom: true, catalog: true, whatsapp: true, maps: false }
          }
        },
        {
          id: `about-${Date.now()}`,
          type: 'about',
          order: 2,
          content: {
            title: 'Kisah Dibalik Setiap Cangkir Kopi Hangat',
            description: 'Didirikan dengan kecintaan mendalam pada cita rasa kopi nusantara asli. Kami bekerja sama secara langsung dengan petani kopi lokal untuk memastikan setiap biji dipetik sempurna dan dipanggang secara presisi oleh barista berpengalaman kami.'
          }
        },
        {
          id: `features-grid-${Date.now()}`,
          type: 'features-grid',
          order: 3,
          content: {
            title: 'Kenapa Menjadi Ruang Santai Favorit Anda?',
            features: [
              { title: 'Biji Pilihan', desc: '100% Kopi Arabica & Robusta kualitas ekspor.' },
              { title: 'Wi-Fi Cepat', desc: 'Sangat stabil untuk Work From Cafe tanpa gangguan.' },
              { title: 'Suasana Cozy', desc: 'Desain minimalis modern dengan udara bersih.' },
              { title: 'Barista Ramah', desc: 'Siap menyajikan kopi sesuai preferensi rasa Anda.' }
            ]
          }
        },
        {
          id: `products-${Date.now()}`,
          type: 'products',
          order: 4,
          content: {
            title: 'Daftar Menu Terlaris Kami',
            showProducts: true
          }
        },
        {
          id: `faq-${Date.now()}`,
          type: 'faq',
          order: 5,
          content: {
            title: 'Pertanyaan yang Sering Diajukan',
            faqs: [
              { q: 'Apakah ada menu makanan berat?', a: 'Ya, kami menyediakan hidangan pasta, nasi goreng premium, serta beragam pastry segar setiap harinya.' },
              { q: 'Apakah menyediakan biji kopi kemasan?', a: 'Ya! Kami menjual house blend dan single origin beans yang sudah digiling sesuai kebutuhan Anda.' },
              { q: 'Apakah melayani pemesanan katering?', a: 'Tentu saja! Hubungi WhatsApp kami untuk reservasi acara privat maupun katering kantor.' }
            ]
          }
        },
        {
          id: `cta-${Date.now()}`,
          type: 'cta',
          order: 6,
          content: {
            title: 'Kunjungi Kami & Dapatkan Promo Diskon 15%!',
            subtitle: 'Hanya minggu ini! Tunjukkan halaman website ini kepada kasir kami untuk mendapatkan potongan langsung pemesanan pertama.',
            buttonText: 'Hubungi Via WhatsApp',
            buttonUrl: '#contact'
          }
        },
        {
          id: `footer-${Date.now()}`,
          type: 'footer',
          order: 7,
          content: {
            address: `Jalan Raya Utama No. 42, ${hasLocation}`,
            phone: '081234567890',
            copyright: '© 2026 Aroma Kopi Nusantara. Powered by JagoBisnis.'
          }
        }
      ];
      break;

    case 'fashion':
      theme = {
        primaryColor: '#db2777', // Modern Pink / Magenta
        font: 'Outfit',
        logoIcon: 'shopping-bag',
        textColor: '#1f2937',
        backgroundColor: '#fafafa',
        ...({
          secondaryColor: '#1e1b4b',
          accentColor: '#ec4899',
          headingFont: 'Outfit',
          bodyFont: 'Inter',
          borderRadius: '0.75rem',
          shadowStyle: 'md',
          buttonStyle: 'solid',
          linkStyle: 'hover-underline',
          spacingSystem: 'cozy'
        } as any)
      };
      sections = [
        {
          id: `hero-${Date.now()}`,
          type: 'hero',
          order: 1,
          content: {
            headline: 'Tampil Lebih Percaya Diri dengan Koleksi Fashion Terkini',
            subheadline: `Temukan koleksi busana premium dengan desain elegan, bahan sejuk, dan harga terjangkau langsung di ${hasLocation}. Cocok untuk segala aktivitas Anda.`,
            buttonText: 'Lihat Koleksi Terbaru',
            buttonUrl: '#products',
            buttons: { custom: true, catalog: true, whatsapp: true, maps: false }
          }
        },
        {
          id: `about-${Date.now()}`,
          type: 'about',
          order: 2,
          content: {
            title: 'Keanggunan dalam Setiap Jahitan Halus',
            description: 'Kami percaya bahwa setiap busana memiliki jiwa dan cerita. Sejak awal berdiri, kami mendedikasikan diri untuk menyediakan fashion modern berkualitas butik dengan potongan jahitan presisi demi kenyamanan pemakaian sepanjang hari.'
          }
        },
        {
          id: `features-cards-${Date.now()}`,
          type: 'features-cards',
          order: 3,
          content: {
            title: 'Kenapa Produk Kami Begitu Istimewa?',
            subtitle: 'Layanan butik berstandar tinggi untuk gaya berbusana harian Anda.',
            cards: [
              { title: 'Bahan Premium Adem', desc: 'Menggunakan serat kain terbaik yang adem di kulit.' },
              { title: 'Jahitan Standar Butik', desc: 'Rapi, kuat, dan dikerjakan oleh penjahit profesional.' },
              { title: 'Desain Eksklusif', desc: 'Edisi terbatas, tidak pasaran, dan selalu up-to-date.' }
            ]
          }
        },
        {
          id: `products-${Date.now()}`,
          type: 'products',
          order: 4,
          content: {
            title: 'Katalog Koleksi Unggulan',
            showProducts: true
          }
        },
        {
          id: `cta-${Date.now()}`,
          type: 'cta',
          order: 5,
          content: {
            title: 'Siap Upgrade Penampilan Anda Hari Ini?',
            subtitle: 'Dapatkan gratis ongkir khusus pemesanan hari ini melalui admin WhatsApp resmi kami.',
            buttonText: 'Pesan Sekarang Via WA',
            buttonUrl: '#contact'
          }
        },
        {
          id: `footer-${Date.now()}`,
          type: 'footer',
          order: 6,
          content: {
            address: `Jalan Fashion Boulevard No. 12, ${hasLocation}`,
            phone: '081299998888',
            copyright: '© 2026 Butik Gaya Modern. Powered by JagoBisnis.'
          }
        }
      ];
      break;

    case 'laundry':
      theme = {
        primaryColor: '#0284c7', // Sky Blue
        font: 'Inter',
        logoIcon: 'sparkles',
        textColor: '#1f2937',
        backgroundColor: '#f8fafc',
        ...({
          secondaryColor: '#0f172a',
          accentColor: '#38bdf8',
          headingFont: 'Outfit',
          bodyFont: 'Inter',
          borderRadius: '0.75rem',
          shadowStyle: 'md',
          buttonStyle: 'solid',
          linkStyle: 'hover-underline',
          spacingSystem: 'cozy'
        } as any)
      };
      sections = [
        {
          id: `hero-${Date.now()}`,
          type: 'hero',
          order: 1,
          content: {
            headline: 'Cucian Bersih Higienis, Rapi Setrika & Wangi Seharian',
            subheadline: `Layanan laundry premium kiloan dan satuan di ${hasLocation}. Menggunakan detergen ramah lingkungan dan setrika uap demi menjaga serat kain tetap awet.`,
            buttonText: 'Hubungi Jemput Pakaian',
            buttonUrl: '#contact',
            buttons: { custom: true, catalog: true, whatsapp: true, maps: false }
          }
        },
        {
          id: `features-grid-${Date.now()}`,
          type: 'features-grid',
          order: 2,
          content: {
            title: 'Kelebihan Layanan Laundry Kami',
            features: [
              { title: 'Cuci Anti Bakteri', desc: 'Detergen khusus dengan sanitizer pembunuh kuman.' },
              { title: 'Setrika Uap Presisi', desc: 'Pakaian rapi sempurna tanpa takut gosong.' },
              { title: 'Antar Jemput Gratis', desc: 'Hemat waktu Anda, biar kami yang ambil cucian.' },
              { title: 'Selesai Tepat Waktu', desc: 'Garansi selesai sesuai jadwal kesepakatan.' }
            ]
          }
        },
        {
          id: `about-${Date.now()}`,
          type: 'about',
          order: 3,
          content: {
            title: 'Peduli Kebersihan & Kelembutan Serat Pakaian Anda',
            description: 'Kami memahami bahwa pakaian adalah investasi penampilan Anda. Oleh karena itu, kami menerapkan sistem cuci "One Machine One Customer" untuk menjaga privasi dan kebersihan maksimal pakaian Anda dari kontaminasi.'
          }
        },
        {
          id: `products-${Date.now()}`,
          type: 'products',
          order: 4,
          content: {
            title: 'Paket Layanan Laundry',
            showProducts: true
          }
        },
        {
          id: `faq-${Date.now()}`,
          type: 'faq',
          order: 5,
          content: {
            title: 'Informasi Laundry Kunci',
            faqs: [
              { q: 'Berapa lama proses laundry reguler?', a: 'Reguler selesai dalam 2-3 hari kerja. Kami juga menyediakan paket kilat 6 jam selesai.' },
              { q: 'Apakah ada layanan untuk sepatu & tas?', a: 'Ya! Kami memiliki treatment khusus pencucian sepatu (Deep Clean) dan tas berbahan kulit premium.' },
              { q: 'Berapa minimum order antar-jemput?', a: 'Minimum order untuk antar-jemput gratis adalah 5 kg pakaian.' }
            ]
          }
        },
        {
          id: `cta-${Date.now()}`,
          type: 'cta',
          order: 6,
          content: {
            title: 'Malas Mencuci? Biar Kami yang Ambil cucian Anda!',
            subtitle: 'Ketik pesan sekarang, kurir kami akan langsung menuju ke rumah Anda dalam 30 menit.',
            buttonText: 'Pesan Antar-Jemput Cucian',
            buttonUrl: '#contact'
          }
        },
        {
          id: `footer-${Date.now()}`,
          type: 'footer',
          order: 7,
          content: {
            address: `Jalan Resik No. 5A, ${hasLocation}`,
            phone: '081277776666',
            copyright: '© 2026 Bersih Harum Laundry. Powered by JagoBisnis.'
          }
        }
      ];
      break;

    default: // Service & General Niche fallback
      theme = {
        primaryColor: '#059669', // Emerald Green
        font: 'Outfit',
        logoIcon: 'globe',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        ...({
          secondaryColor: '#064e3b',
          accentColor: '#10b981',
          headingFont: 'Outfit',
          bodyFont: 'Inter',
          borderRadius: '0.75rem',
          shadowStyle: 'md',
          buttonStyle: 'solid',
          linkStyle: 'hover-underline',
          spacingSystem: 'cozy'
        } as any)
      };
      sections = [
        {
          id: `hero-${Date.now()}`,
          type: 'hero',
          order: 1,
          content: {
            headline: 'Solusi Profesional & Terpercaya Untuk Kebutuhan Anda',
            subheadline: `Kami menghadirkan layanan prima yang cepat, berkualitas tinggi, dan transparan untuk klien di ${hasLocation}. Dikerjakan oleh teknisi ahli tersertifikasi.`,
            buttonText: 'Konsultasi Gratis Sekarang',
            buttonUrl: '#contact',
            buttons: { custom: true, catalog: true, whatsapp: true, maps: false }
          }
        },
        {
          id: `about-${Date.now()}`,
          type: 'about',
          order: 2,
          content: {
            title: 'Berdedikasi Memberikan Hasil Terbaik',
            description: 'Didukung oleh tim profesional berpengalaman belasan tahun. Kami senantiasa berkomitmen menjaga integritas kerja, ketepatan waktu, dan kepuasan penuh dari setiap pelanggan yang mempercayakan kebutuhannya kepada kami.'
          }
        },
        {
          id: `features-grid-${Date.now()}`,
          type: 'features-grid',
          order: 3,
          content: {
            title: 'Keunggulan Utama Kemitraan Bersama Kami',
            features: [
              { title: 'Tenaga Ahli Berlisensi', desc: 'Seluruh tim memiliki sertifikasi keahlian resmi.' },
              { title: 'Garansi Hasil Kerja', desc: 'Kami menjamin kualitas pekerjaan dengan jaminan garansi.' },
              { title: 'Harga Terbuka', desc: 'Rincian biaya transparan sejak awal tanpa biaya siluman.' },
              { title: 'Respon Cepat 24/7', desc: 'Siap melayani kebutuhan darurat Anda kapan saja.' }
            ]
          }
        },
        {
          id: `products-${Date.now()}`,
          type: 'products',
          order: 4,
          content: {
            title: 'Layanan Unggulan Kami',
            showProducts: true
          }
        },
        {
          id: `faq-${Date.now()}`,
          type: 'faq',
          order: 5,
          content: {
            title: 'Frequently Asked Questions',
            faqs: [
              { q: 'Bagaimana cara melakukan pemesanan?', a: 'Anda cukup menghubungi kami via WhatsApp, lalu tim kami akan datang melakukan survei lokasi secara gratis.' },
              { q: 'Apakah ada garansi setelah pengerjaan?', a: 'Ya! Seluruh layanan kami terlindungi garansi perawatan selama 30 hari kalender.' },
              { q: 'Melayani area mana saja?', a: `Saat ini fokus utama layanan kami mencakup seluruh wilayah ${hasLocation} dan sekitarnya.` }
            ]
          }
        },
        {
          id: `cta-${Date.now()}`,
          type: 'cta',
          order: 6,
          content: {
            title: 'Dapatkan Penawaran Harga Spesial & Survei Lokasi Gratis!',
            subtitle: 'Hubungi admin kami hari ini untuk konsultasi jadwal survei langsung ke tempat Anda.',
            buttonText: 'Hubungi Teknisi Kami',
            buttonUrl: '#contact'
          }
        },
        {
          id: `footer-${Date.now()}`,
          type: 'footer',
          order: 7,
          content: {
            address: `Sentra Bisnis Terpadu No. 99, ${hasLocation}`,
            phone: '081288887777',
            copyright: '© 2026 Solusi Profesional Sukses. Powered by JagoBisnis.'
          }
        }
      ];
      break;
  }

  // Incorporate custom prompt details dynamically if provided
  if (customPrompt) {
    // Dynamic text replacement/injection based on user request keywords
    const cleanedPrompt = customPrompt.trim();
    if (cleanedPrompt.length > 5) {
      sections = sections.map(s => {
        if (s.type === 'hero') {
          return {
            ...s,
            content: {
              ...s.content,
              headline: cleanedPrompt.length < 50 ? cleanedPrompt : s.content.headline,
              subheadline: `Layanan kustom prima khusus dirancang berdasarkan kebutuhan spesifik Anda: "${cleanedPrompt}". Melayani ${hasLocation} dengan sepenuh hati.`
            }
          };
        }
        if (s.type === 'about') {
          return {
            ...s,
            content: {
              ...s.content,
              title: `Rancangan Solusi Bisnis: ${cleanedPrompt.split(' ')[0]} Terbaik`,
              description: `Misi utama kami terfokus untuk menghadirkan kualitas tinggi pada layanan kami. Melalui perpaduan teknologi dan ketelitian kerja, kami mengadaptasikan konsep kami agar sesuai dengan keinginan Anda: "${cleanedPrompt}".`
            }
          };
        }
        return s;
      });
    }
  }

  return { sections, theme };
}
