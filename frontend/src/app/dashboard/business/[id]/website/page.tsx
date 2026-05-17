'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { productService } from '@/services/product.service';
import { Site, SiteTheme, Section, SectionType } from '@/types/site';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { WebsitePreview } from '@/components/builder/website-preview';
import { 
  ChevronLeft, 
  Save, 
  Globe, 
  Eye, 
  Layout, 
  Palette, 
  Settings, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Sparkles, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Type, 
  Package, 
  Users, 
  Image as ImageIcon, 
  Award, 
  Clock, 
  Shield, 
  HelpCircle, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Plus, 
  Check, 
  Upload, 
  Link2, 
  PlusCircle, 
  Smile,
  Star 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const AVAILABLE_BLOCKS = [
  { 
    type: 'hero', 
    name: 'Hero Banner', 
    description: 'Headline utama, subheadline, & tombol aksi kustom', 
    defaultContent: { 
      headline: 'Selamat Datang di Bisnis Kami', 
      subheadline: 'Kami menyediakan produk dan layanan terbaik khusus untuk kebutuhan Anda.', 
      buttonText: 'Pelajari Selengkapnya', 
      buttonUrl: '#', 
      backgroundImage: '',
      buttons: { custom: true, catalog: false, whatsapp: false, maps: false } 
    } 
  },
  { 
    type: 'products', 
    name: 'Katalog Produk', 
    description: 'Etalase produk otomatis terhubung database', 
    defaultContent: { 
      title: 'Layanan & Produk Pilihan', 
      showProducts: true 
    } 
  },
  { 
    type: 'about', 
    name: 'Tentang Kami', 
    description: 'Profil singkat usaha dan misi utama', 
    defaultContent: { 
      title: 'Misi Utama Bisnis Kami', 
      description: 'Kami bertekad menyajikan produk berstandar tinggi yang mendukung kegiatan UMKM.' 
    } 
  },
  { 
    type: 'gallery', 
    name: 'Galeri Foto', 
    description: 'Kumpulan foto dokumentasi produk dan toko', 
    defaultContent: { 
      title: 'Galeri Bisnis', 
      subtitle: 'Dokumentasi visual portofolio dan outlet kami.', 
      images: [] 
    } 
  },
  { 
    type: 'logos', 
    name: 'Deretan Logo', 
    description: 'Trust bar mitra atau keunggulan usaha', 
    defaultContent: { 
      items: ['Maju Bersama', 'Kemitraan UMKM', 'Kualitas Ekspor', 'Jago Kuliner'] 
    } 
  },
  { 
    type: 'stats', 
    name: 'Statistik Kunci', 
    description: 'Pencapaian angka-angka penting bisnis', 
    defaultContent: { 
      stats: [
        { value: '500+', label: 'Pelanggan Setia' }, 
        { value: '100%', label: 'Bahan Pilihan' }, 
        { value: '5★', label: 'Rating Rata-Rata' }
      ] 
    } 
  },
  { 
    type: 'features-grid', 
    name: 'Fitur Grid 2x2', 
    description: '4 keunggulan utama layanan / produk', 
    defaultContent: { 
      title: 'Mengapa Memilih Kami?', 
      features: [
        { title: 'Bahan Premium', desc: 'Kualitas bahan pilihan terbaik.' }, 
        { title: 'Layanan Kilat', desc: 'Respon cepat ke seluruh penjuru.' }, 
        { title: '100% Higienis', desc: 'Proses higienis terstandar.' }, 
        { title: 'Harga Bersaing', desc: 'Kualitas premium harga bersahabat.' }
      ] 
    } 
  },
  { 
    type: 'features-cards', 
    name: 'Fitur Kartu', 
    description: 'Hingga 8 kartu penawaran / layanan kustom', 
    defaultContent: { 
      title: 'Layanan Unggulan Kami', 
      subtitle: 'Jelajahi paket layanan yang kami rancang khusus.', 
      cards: [
        { title: 'Paket Pemula', desc: 'Hemat esensial.' }, 
        { title: 'Paket Bisnis', desc: 'Lengkap dan populer.' }, 
        { title: 'Paket Premium', desc: 'Lengkap tanpa batas.' }
      ] 
    } 
  },
  { 
    type: 'cta', 
    name: 'Aksi CTA', 
    description: 'Banner ajakan bertindak / promosi spesial', 
    defaultContent: { 
      title: 'Siap Meningkatkan Bisnis Anda?', 
      subtitle: 'Hubungi kami sekarang untuk penawaran spesial.', 
      buttonText: 'Mulai Sekarang', 
      buttonUrl: '#' 
    } 
  },
  { 
    type: 'faq', 
    name: 'Pertanyaan Umum', 
    description: 'Daftar tanya jawab FAQ collapsible', 
    defaultContent: { 
      title: 'Pertanyaan Umum (FAQ)', 
      faqs: [
        { q: 'Bagaimana cara memesan?', a: 'Pilih produk dari katalog lalu hubungi CS WhatsApp kami.' }, 
        { q: 'Apakah ada pengiriman luar kota?', a: 'Ya, kami mengirim ke seluruh wilayah Indonesia.' }
      ] 
    } 
  },
  { 
    type: 'contact', 
    name: 'Kontak Detail', 
    description: 'Peta, alamat, phone, & WhatsApp cepat', 
    defaultContent: { 
      title: 'Hubungi Kami', 
      phone: '', 
      address: '', 
      whatsappText: 'Halo! Saya ingin menghubungi Anda.' 
    } 
  }
];

const PRESET_PALETTES = [
  { name: 'Amber Gold (Hangat)', primary: '#F59E0B', bg: '#FDF8F0', text: '#1F2937' },
  { name: 'Forest Green (Segar)', primary: '#10B981', bg: '#F0FDF4', text: '#064E3B' },
  { name: 'Sleek Navy (Profesional)', primary: '#3B82F6', bg: '#F0F9FF', text: '#0F172A' },
  { name: 'Deep Violet (Modern)', primary: '#8B5CF6', bg: '#F5F3FF', text: '#1E1B4B' },
  { name: 'Coral Red (Berani)', primary: '#EF4444', bg: '#FEF2F2', text: '#450A0A' },
  { name: 'Rose Pink (Estetis)', primary: '#EC4899', bg: '#FDF2F8', text: '#4D052E' }
];

const FONTS = [
  { name: 'Inter (Bersih & Standar)', value: 'Inter, sans-serif' },
  { name: 'Outfit (Modern & Bulat)', value: 'Outfit, sans-serif' },
  { name: 'Space Grotesk (Tech & Geometris)', value: 'Space Grotesk, sans-serif' },
  { name: 'Plus Jakarta Sans (Premium SaaS)', value: 'Plus Jakarta Sans, sans-serif' },
  { name: 'Playfair Display (Klasik & Mewah)', value: 'Playfair Display, serif' },
  { name: 'Fraunces (Vintage & Artistik)', value: 'Fraunces, serif' }
];

const LOGO_ICONS = [
  { name: 'Globe', value: 'globe' },
  { name: 'Coffee', value: 'coffee' },
  { name: 'Store', value: 'store' },
  { name: 'Shopping Bag', value: 'shopping-bag' },
  { name: 'Laptop', value: 'laptop' },
  { name: 'Heart', value: 'heart' },
  { name: 'Sparkles', value: 'sparkles' },
  { name: 'Award', value: 'award' },
  { name: 'Smile', value: 'smile' }
];

export default function WebsiteBuilderPage() {
  const params = useParams();
  const businessId = params.id as string;
  const router = useRouter();

  const [site, setSite] = useState<Site | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Builder layout states
  const [activeTab, setActiveTab] = useState<'site' | 'block'>('site');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  
  // File upload pointer refs
  const logoUploadRef = useRef<HTMLInputElement>(null);
  const bgUploadRef = useRef<HTMLInputElement>(null);
  const galleryUploadRef = useRef<HTMLInputElement>(null);
  const cardUploadRefs = useRef<Record<number, HTMLInputElement>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteData = await siteService.getSite(businessId);
        
        // Fetch raw products
        const rawProducts = await productService.getAll(businessId);
        setProducts(rawProducts);

        // Normalize site sections data
        let normalizedSite = siteData;
        if (siteData && (!siteData.sections || siteData.sections.length === 0)) {
          normalizedSite = {
            ...siteData,
            sections: [
              {
                id: 'hero-default',
                type: 'hero',
                order: 1,
                content: { ...AVAILABLE_BLOCKS[0].defaultContent }
              },
              {
                id: 'products-default',
                type: 'products',
                order: 2,
                content: { ...AVAILABLE_BLOCKS[1].defaultContent }
              }
            ]
          };
        }
        setSite(normalizedSite);
      } catch (err) {
        console.error('Failed to fetch data', err);
        toast.error('Gagal memuat data website');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  const handleSave = async () => {
    if (!site) return;
    setIsSaving(true);
    try {
      await Promise.all([
        siteService.updateTheme(businessId, site.theme),
        siteService.updateSections(businessId, site.sections),
        siteService.updateSite(businessId, { title: site.title, slug: site.slug })
      ]);
      toast.success('Website berhasil disimpan!');
    } catch (err) {
      toast.error('Gagal menyimpan website');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!site) return;
    setIsPublishing(true);
    try {
      if (site.isPublished) {
        await siteService.unpublish(businessId);
        setSite({ ...site, isPublished: false });
        toast.success('Website telah ditarik dari publikasi');
      } else {
        await siteService.publish(businessId);
        setSite({ ...site, isPublished: true });
        toast.success('Website berhasil dipublikasikan!');
      }
    } catch (err) {
      toast.error('Gagal mengubah status publikasi');
    } finally {
      setIsPublishing(false);
    }
  };

  // Append a section block to site.sections
  const handleAddSection = (type: string) => {
    if (!site) return;
    const defaultBlock = AVAILABLE_BLOCKS.find(b => b.type === type);
    if (!defaultBlock) return;

    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      order: site.sections.length + 1,
      content: JSON.parse(JSON.stringify(defaultBlock.defaultContent))
    };

    const updatedSections = [...site.sections, newSection];
    setSite({ ...site, sections: updatedSections });
    setActiveSectionId(newSection.id);
    setActiveTab('block');
    toast.success(`Blok ${defaultBlock.name} berhasil ditambahkan!`);
  };

  // Reorder sections in middle canvas
  const moveUp = (index: number) => {
    if (!site || index === 0) return;
    const newSections = [...site.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((s, i) => s.order = i + 1);
    setSite({ ...site, sections: newSections });
  };

  const moveDown = (index: number) => {
    if (!site || index === site.sections.length - 1) return;
    const newSections = [...site.sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    newSections.forEach((s, i) => s.order = i + 1);
    setSite({ ...site, sections: newSections });
  };

  const handleDeleteSection = (id: string) => {
    if (!site) return;
    const newSections = site.sections.filter(s => s.id !== id);
    newSections.forEach((s, i) => s.order = i + 1);
    setSite({ ...site, sections: newSections });
    if (activeSectionId === id) {
      setActiveSectionId(null);
    }
    toast.success('Blok berhasil dihapus');
  };

  // Handle local file uploads using productService.uploadImage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'hero-bg' | 'gallery' | 'card', extraIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file || !site) return;

    try {
      const res = await productService.uploadImage(businessId, file);
      toast.success('Media berhasil diunggah!');
      
      if (type === 'logo') {
        setSite({
          ...site,
          theme: {
            ...site.theme,
            logoUrl: res.url,
            logoIcon: undefined
          }
        });
      } else if (type === 'hero-bg') {
        const newSections = site.sections.map(s => {
          if (s.id === activeSectionId) {
            return {
              ...s,
              content: {
                ...s.content,
                backgroundImage: res.url
              }
            };
          }
          return s;
        });
        setSite({ ...site, sections: newSections });
      } else if (type === 'gallery') {
        const newSections = site.sections.map(s => {
          if (s.id === activeSectionId) {
            const currentImages = s.content.images || [];
            return {
              ...s,
              content: {
                ...s.content,
                images: [...currentImages, res.url]
              }
            };
          }
          return s;
        });
        setSite({ ...site, sections: newSections });
      } else if (type === 'card' && extraIndex !== undefined) {
        const newSections = site.sections.map(s => {
          if (s.id === activeSectionId) {
            const cards = [...(s.content.cards || [])];
            cards[extraIndex] = {
              ...cards[extraIndex],
              imageUrl: res.url
            };
            return {
              ...s,
              content: {
                ...s.content,
                cards
              }
            };
          }
          return s;
        });
        setSite({ ...site, sections: newSections });
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunggah media');
    }
  };

  // Update dynamic content fields for active section
  const updateActiveSectionContent = (key: string, value: any) => {
    if (!site || !activeSectionId) return;
    const newSections = site.sections.map(s => {
      if (s.id === activeSectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            [key]: value
          }
        };
      }
      return s;
    });
    setSite({ ...site, sections: newSections });
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return Type;
      case 'products': return Package;
      case 'about': return Users;
      case 'gallery': return ImageIcon;
      case 'logos': return Award;
      case 'stats': return Clock;
      case 'features-grid': return Shield;
      case 'features-cards': return Sparkles;
      case 'cta': return Star;
      case 'faq': return HelpCircle;
      case 'contact': return Phone;
      default: return Layout;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Menyiapkan Canvas Workspace...</p>
        </div>
      </div>
    );
  }

  if (!site) return <div className="p-8 text-center">Website tidak ditemukan.</div>;

  const activeSection = site.sections.find(s => s.id === activeSectionId);
  const renderCanvasMockup = (section: Section) => {
    switch (section.type) {
      case 'hero': {
        const headline = section.content.headline || 'Onderstroom - Toko Baju Online dan Offline';
        const subheadline = section.content.subheadline || 'Kami menyediakan berbagai pilihan baju untuk pria dan wanita dengan kualitas terbaik';
        const bgImg = section.content.backgroundImage || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80';
        return (
          <div 
            className="w-full h-56 rounded-none relative overflow-hidden bg-cover bg-center flex flex-col justify-end p-6 text-white shadow-inner bg-zinc-800"
            style={{ backgroundImage: `url(${bgImg})` }}
          >
            {/* Dark gradient overlay for extreme readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
            
            <div className="relative z-10 space-y-2 text-left">
              <h4 className="text-sm md:text-base font-black tracking-tight leading-snug drop-shadow-md">
                {headline}
              </h4>
              <p className="text-[10px] text-zinc-300 font-medium leading-relaxed max-w-md line-clamp-3 drop-shadow">
                {subheadline}
              </p>
            </div>
          </div>
        );
      }
      
      case 'features-cards': {
        // This is "Pembaruan" or news/cards block as seen in user's request screenshot!
        const title = section.content.title || 'Pembaruan & Berita';
        const cards = section.content.cards || [
          { title: 'Item 1', desc: 'Description 1' },
          { title: 'Item 2', desc: 'Description 2' },
          { title: 'Item 3', desc: 'Description 3' }
        ];
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left space-y-4 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-gray-150 dark:border-zinc-800/80 rounded-xl p-3 bg-white dark:bg-zinc-950/20 space-y-3.5 flex flex-col shadow-sm">
                  {/* Gray skeleton image block */}
                  <div className="w-full aspect-[4/3] rounded-lg bg-[#EAEAEA] dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <ImageIcon className="h-4 w-4 text-gray-400 dark:text-zinc-550" />
                  </div>
                  {/* Two grey skeleton text lines */}
                  <div className="space-y-2 pt-0.5">
                    <div className="h-2.5 w-3/4 bg-gray-200 dark:bg-zinc-850 rounded-full" />
                    <div className="h-2 w-1/2 bg-gray-150 dark:bg-zinc-900 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'products': {
        const title = section.content.title || 'Produk & Layanan';
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-gray-100 dark:bg-zinc-850 px-2 py-0.5 rounded">GRID</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {products.length > 0 ? (
                products.slice(0, 4).map((p) => (
                  <div key={p.id} className="border border-gray-100 dark:border-zinc-800 rounded-lg p-2 bg-gray-55/50 dark:bg-zinc-950/20 space-y-2">
                    <div className="w-full aspect-square rounded bg-cover bg-center shrink-0 bg-zinc-150" style={{ backgroundImage: `url(${p.imageUrl || ''})` }} />
                    <div className="space-y-1">
                      <p className="text-[9px] font-black truncate text-gray-800 dark:text-zinc-200">{p.name}</p>
                      <p className="text-[8px] text-blue-600 dark:text-blue-400 font-extrabold">Rp {p.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-gray-150 dark:border-zinc-800 rounded-lg p-2 bg-gray-55/50 dark:bg-zinc-950/20 space-y-2">
                    <div className="w-full aspect-square rounded bg-gray-200 dark:bg-zinc-800" />
                    <div className="space-y-1">
                      <div className="h-2 w-12 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                      <div className="h-1.5 w-8 bg-gray-150 dark:bg-zinc-850 rounded-full" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      case 'about': {
        const title = section.content.title || 'Tentang Kami';
        const desc = section.content.description || 'Kami adalah sebuah toko baju yang melayani pada offline store dan online store pada Shopee dan Tokopedia dengan merek Onderstroom.\n\nKami berkomitmen untuk menyediakan pakaian yang nyaman, stylish, dan berkualitas tinggi untuk pelanggan kami.';
        const paragraphs = desc.split('\n\n');
        const primaryColor = site.theme?.primaryColor || '#2563eb';
        
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left shadow-sm">
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-7 space-y-3">
                <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
                <div className="text-[9px] text-muted-foreground font-medium leading-relaxed space-y-2">
                  {paragraphs.map((p: string, index: number) => (
                    <p key={index}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="col-span-5 aspect-square max-w-[150px] mx-auto rounded-xl bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-3 border dark:border-zinc-850 shrink-0">
                <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Matching Fashion Shop SVG Mockup */}
                  <circle cx="200" cy="200" r="140" className="fill-gray-200/30 dark:fill-zinc-800/30" />
                  <path d="M120,150 Q160,110 240,130 T300,220 Q320,290 230,300 T110,230 Q80,180 120,150 Z" className="fill-blue-500/5 dark:fill-amber-400/5" style={{ fill: `${primaryColor}15` }} />
                  
                  {/* Floor Line */}
                  <path d="M80,310 L320,310" className="stroke-gray-200 dark:stroke-zinc-800" strokeWidth="2" strokeLinecap="round" />

                  {/* Character 1 (Left) */}
                  <circle cx="135" cy="130" r="15" className="fill-[#F0D5C6] dark:fill-[#DDA894]" />
                  <path d="M120,145 L115,280 C115,285 120,290 126,290 L144,290 C150,290 155,285 155,280 L150,145 Z" className="fill-amber-600/80 dark:fill-amber-500/70" />
                  <line x1="122" y1="205" x2="148" y2="205" className="stroke-amber-900/30 dark:stroke-zinc-900/30" strokeWidth="3" />
                  <path d="M130,290 L130,310 M140,290 L140,310" className="stroke-zinc-800 dark:stroke-zinc-400" strokeWidth="4.5" strokeLinecap="round" />

                  {/* Character 2 (Center) */}
                  <circle cx="200" cy="115" r="16" className="fill-[#E6C2AC] dark:fill-[#D2A992]" />
                  <path d="M185,131 C180,140 180,160 182,180 L218,180 C220,160 220,140 215,131 Z" className="fill-blue-600 dark:fill-amber-400/90" style={{ fill: primaryColor }} />
                  <path d="M190,131 L200,148 L210,131" className="stroke-white/30 dark:stroke-zinc-950/20" strokeWidth="2" strokeLinecap="round" />
                  <path d="M188,180 L188,310 M212,180 L212,310" className="stroke-zinc-850 dark:stroke-zinc-300" strokeWidth="5.5" strokeLinecap="round" />

                  {/* Character 3 (Right) */}
                  <circle cx="265" cy="125" r="15.5" className="fill-[#EAD2C6] dark:fill-[#CFA490]" />
                  <path d="M250,140 C248,150 248,180 252,215 L278,215 C282,180 282,150 280,140 Z" className="fill-zinc-700 dark:fill-zinc-450" />
                  <path d="M248,215 L238,285 C238,288 242,290 245,290 L285,290 C288,290 292,288 292,285 L282,215 Z" className="fill-zinc-400/90 dark:fill-zinc-600" />
                  <path d="M258,290 L258,310 M272,290 L272,310" className="stroke-zinc-800 dark:stroke-zinc-400" strokeWidth="4.5" strokeLinecap="round" />
                  
                  {/* Shopping Bag */}
                  <path d="M280,165 Q305,185 305,210" className="stroke-[#EAD2C6] dark:stroke-[#CFA490]" strokeWidth="4.5" strokeLinecap="round" />
                  <rect x="290" y="210" width="30" height="35" rx="3" className="fill-blue-500/80 dark:fill-amber-400/80" style={{ fill: `${primaryColor}c0` }} />

                  {/* Sparkles */}
                  <path d="M100,90 L102,94 L106,95 L102,96 L100,100 L98,96 L94,95 L98,94 Z" className="fill-amber-400 dark:fill-amber-300" />
                  <path d="M305,100 L307,104 L311,105 L307,106 L305,110 L303,106 L299,105 L303,104 Z" className="fill-amber-400 dark:fill-amber-300" />
                </svg>
              </div>
            </div>
          </div>
        );
      }

      case 'gallery': {
        const title = section.content.title || 'Galeri Bisnis';
        const images = section.content.images || [];
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left space-y-3 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
            <div className="grid grid-cols-6 gap-2">
              {images.length > 0 ? (
                (images as string[]).slice(0, 6).map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-lg bg-cover bg-center border dark:border-zinc-800" style={{ backgroundImage: `url(${img})` }} />
                ))
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-200 dark:bg-zinc-800 flex items-center justify-center border dark:border-zinc-800">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      case 'logos': {
        const items = section.content.items || [];
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-4 flex justify-center items-center gap-4 shadow-sm overflow-hidden">
            {items.map((item: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-gray-50 dark:bg-zinc-800 text-[9px] font-bold text-muted-foreground border dark:border-zinc-800 whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        );
      }

      case 'stats': {
        const stats = section.content.stats || [
          { value: '100+', label: 'Pilihan baju untuk pria dan wanita' },
          { value: '5+', label: 'Tahun pengalaman di industri fashion' },
          { value: '1000+', label: 'Pelanggan yang telah mempercayai kami' }
        ];
        return (
          <div className="w-full bg-[#FFF0F0] dark:bg-rose-950/10 border border-zinc-100 dark:border-rose-950/20 rounded-none py-6 px-4 grid grid-cols-3 gap-4 text-center shadow-sm">
            {stats.map((s: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <p className="text-base font-black text-gray-900 dark:text-rose-400">{s.value}</p>
                <p className="text-[8.5px] text-muted-foreground font-medium leading-relaxed max-w-[120px] mx-auto">{s.label}</p>
              </div>
            ))}
          </div>
        );
      }

      case 'features-grid': {
        const title = section.content.title || 'Mengapa Memilih Kami?';
        const features = section.content.features || [];
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left space-y-3.5 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((f: any, i: number) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded bg-blue-50 dark:bg-zinc-850 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-800 dark:text-zinc-200 truncate">{f.title}</p>
                    <p className="text-[8.5px] text-muted-foreground font-medium leading-normal line-clamp-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'cta': {
        const title = section.content.title || 'Siap Meningkatkan Bisnis Anda?';
        const buttonText = section.content.buttonText || 'Mulai Sekarang';
        return (
          <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-zinc-800 dark:to-zinc-900 rounded-none p-6 text-center text-white space-y-3 shadow-md">
            <h4 className="text-xs md:text-sm font-black tracking-tight leading-tight">{title}</h4>
            <span className="inline-block px-4 py-1 rounded-lg bg-white/20 text-[9px] font-black uppercase tracking-widest">
              {buttonText}
            </span>
          </div>
        );
      }

      case 'faq': {
        const title = section.content.title || 'Pertanyaan Umum';
        const faqs = section.content.faqs || [];
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left space-y-3 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
            <div className="space-y-2">
              {faqs.slice(0, 2).map((faq: any, i: number) => (
                <div key={i} className="p-2 rounded-lg bg-gray-55/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-850 flex justify-between items-center">
                  <p className="text-[9px] font-bold text-gray-700 dark:text-zinc-300 truncate">{faq.q}</p>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'contact': {
        const title = section.content.title || 'Hubungi Kami';
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-none p-6 text-left space-y-3.5 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-100 tracking-tight">{title}</h4>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Call Center</span>
                </div>
                <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Lokasi UMKM</span>
                </div>
              </div>
              <div className="h-16 rounded bg-gray-150 dark:bg-zinc-800 flex items-center justify-center border dark:border-zinc-850 overflow-hidden relative shadow-inner">
                <MapPin className="h-4 w-4 text-blue-500/80 absolute" />
                <div className="w-full h-full opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]" />
              </div>
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className="w-full bg-white dark:bg-zinc-900 border border-dashed rounded-none p-6 text-center text-[10px] text-muted-foreground">
            Slices Preview {section.type}
          </div>
        );
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] dark:bg-zinc-950 overflow-hidden transition-colors duration-200">
      {/* Top Bar */}
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-border dark:border-zinc-850 px-6 flex items-center justify-between z-30 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard`}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted dark:hover:bg-zinc-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-foreground dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {site.title}
            </h1>
            <p className="text-[10px] text-muted-foreground dark:text-zinc-500 font-bold uppercase tracking-widest">Kanvas Live Editor</p>
          </div>
        </div>

        {/* Global Live Preview Panel Toggle */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsLivePreviewOpen(!isLivePreviewOpen)}
            className={cn("h-9 rounded-xl text-xs font-bold gap-2", isLivePreviewOpen && "bg-primary/5 text-primary border-primary")}
          >
            <Eye className="h-4 w-4" />
            {isLivePreviewOpen ? 'Tutup Preview' : 'Preview Langsung'}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className={cn("h-9 px-4 font-bold rounded-xl text-xs", site.isPublished && "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30")}
            onClick={handleTogglePublish}
            disabled={isPublishing}
          >
            {site.isPublished ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> : <Globe className="h-3.5 w-3.5 mr-1.5" />}
            {site.isPublished ? 'Live' : 'Publish'}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="h-9 px-5 font-black rounded-xl text-xs shadow-lg shadow-primary/20 dark:shadow-none text-white bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Simpan
          </Button>
        </div>
      </header>

      {/* Editor Layout: 3 Columns */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* COLUMN 1 (LEFT): Available Blocks Panel */}
        <aside className="w-[280px] bg-white dark:bg-zinc-900 border-r border-border dark:border-zinc-850 p-4 overflow-y-auto flex flex-col gap-4 shrink-0 transition-colors duration-200">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Blok Tersedia</h3>
            <p className="text-[10px] text-muted-foreground">Klik blok di bawah untuk menambahkannya ke kanvas tengah</p>
          </div>
          
          <div className="flex flex-col gap-2.5">
            {AVAILABLE_BLOCKS.map((block) => {
              const Icon = getSectionIcon(block.type);
              return (
                <button
                  key={block.type}
                  onClick={() => handleAddSection(block.type)}
                  className="w-full text-left p-3 rounded-xl border border-border dark:border-zinc-850 hover:border-primary/50 dark:hover:border-amber-400/50 bg-white dark:bg-zinc-900 hover:bg-gray-50/50 dark:hover:bg-zinc-850/50 transition-all shadow-sm hover:scale-[1.01] active:scale-95 group flex items-start gap-3"
                >
                  <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-zinc-850 border dark:border-zinc-800 shadow-inner group-hover:bg-primary/5 dark:group-hover:bg-amber-400/5 group-hover:text-primary dark:group-hover:text-amber-400 transition-colors">
                    <Icon className="h-4 w-4 text-gray-500 dark:text-zinc-400 group-hover:text-primary dark:group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-amber-400 transition-colors truncate">
                      {block.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground dark:text-zinc-500 font-medium leading-normal line-clamp-1">
                      {block.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* COLUMN 2 (MIDDLE): The Canvas (visual high-fidelity mockups stack) */}
        <main className={cn(
          "flex-1 bg-[#F5F5F7] dark:bg-zinc-950 p-8 overflow-y-auto flex flex-col items-center gap-6 transition-all duration-300",
          isLivePreviewOpen ? "hidden lg:flex" : "flex"
        )}>
          {/* Canvas Mode Indicator */}
          <div className="w-full max-w-xl flex items-center justify-between pb-1 border-b dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-black text-foreground dark:text-white uppercase tracking-widest">Kanvas Struktur</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-bold">Susun potongan blok secara visual</span>
          </div>

          {/* Visual Canvas Stack */}
          <div className="w-full max-w-xl flex flex-col gap-6 pt-2 pb-16">
            {site.sections.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-zinc-900 border border-dashed border-border dark:border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4">
                <Layout className="h-12 w-12 text-muted-foreground/30 animate-bounce" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Kanvas Kosong</p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">Tambahkan blok dari menu sebelah kiri untuk menyusun desain landing page bisnis Anda.</p>
                </div>
              </div>
            ) : (
              [...site.sections].sort((a, b) => a.order - b.order).map((section, idx) => {
                const isActive = activeSectionId === section.id;
                return (
                  <div key={section.id} className="relative w-full group">
                    {/* Floating Side Action Controls on Hover/Active */}
                    {isActive && (
                      <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20 animate-in fade-in slide-in-from-left-2 duration-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveUp(idx); }}
                          disabled={idx === 0}
                          className="h-8 w-8 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg flex items-center justify-center shadow-md disabled:opacity-30 disabled:hover:bg-zinc-200 transition-all border border-zinc-300 dark:border-zinc-750"
                          title="Pindahkan ke Atas"
                        >
                          <ChevronUp className="h-4.5 w-4.5" />
                        </button>
                        
                        <div className="h-8 w-8 bg-zinc-900 dark:bg-zinc-850 text-zinc-450 rounded-lg flex items-center justify-center shadow-md border border-zinc-800 dark:border-zinc-800 cursor-grab active:cursor-grabbing">
                          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-90">
                            <circle cx="3" cy="3" r="1" fill="currentColor"/>
                            <circle cx="7" cy="3" r="1" fill="currentColor"/>
                            <circle cx="3" cy="7" r="1" fill="currentColor"/>
                            <circle cx="7" cy="7" r="1" fill="currentColor"/>
                            <circle cx="3" cy="11" r="1" fill="currentColor"/>
                            <circle cx="7" cy="11" r="1" fill="currentColor"/>
                          </svg>
                        </div>
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); moveDown(idx); }}
                          disabled={idx === site.sections.length - 1}
                          className="h-8 w-8 bg-zinc-900 hover:bg-zinc-950 dark:bg-zinc-850 dark:hover:bg-zinc-900 text-white rounded-lg flex items-center justify-center shadow-md disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all border border-zinc-800 dark:border-zinc-800"
                          title="Pindahkan ke Bawah"
                        >
                          <ChevronDown className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    )}

                    {/* Block Slice Frame */}
                    <div
                      onClick={() => {
                        setActiveSectionId(section.id);
                        setActiveTab('block');
                      }}
                      className={cn(
                        "w-full rounded-none border transition-all cursor-pointer relative select-none p-1.5",
                        isActive 
                          ? "border-amber-500 dark:border-amber-400 bg-amber-50/10 dark:bg-amber-950/5" 
                          : "border-transparent bg-transparent hover:border-gray-200 dark:hover:border-zinc-800/60"
                      )}
                    >
                      {/* Labeled Top Ribbon */}
                      <div className="flex items-center justify-between pb-1.5 px-2">
                        <span className="text-[10px] font-black text-muted-foreground/80 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                          {section.type.replace('-', ' ')}
                          {section.type === 'hero' && <span className="text-xs">🔒</span>}
                        </span>
                        {section.type !== 'hero' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                            title="Hapus Blok"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Mockup Frame Content */}
                      <div className="w-full bg-white dark:bg-zinc-900 rounded-none overflow-hidden shadow-sm border border-border dark:border-zinc-850">
                        {renderCanvasMockup(section)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* INTEGRATED LIVE PREVIEW DRAWER (OPENS VIA EYE TOGGLE) */}
        {isLivePreviewOpen && (
          <aside className="flex-1 bg-[#F0F2F5] dark:bg-zinc-950/60 p-6 overflow-hidden flex flex-col items-center border-r border-border dark:border-zinc-850 shrink-0 z-10 transition-all duration-300">
            {/* Device Toggles inside preview drawer */}
            <div className="w-full max-w-4xl flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground dark:text-white uppercase tracking-wider">Tampilan Langsung</span>
              </div>
              <div className="flex items-center bg-muted/50 dark:bg-zinc-850 rounded-xl p-1 border dark:border-zinc-800">
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={cn("p-1.5 rounded-lg transition-all", previewMode === 'desktop' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary dark:text-white" : "text-muted-foreground dark:text-zinc-500 hover:text-foreground")}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setPreviewMode('tablet')}
                  className={cn("p-1.5 rounded-lg transition-all", previewMode === 'tablet' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary dark:text-white" : "text-muted-foreground dark:text-zinc-500 hover:text-foreground")}
                >
                  <Laptop className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={cn("p-1.5 rounded-lg transition-all", previewMode === 'mobile' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary dark:text-white" : "text-muted-foreground dark:text-zinc-500 hover:text-foreground")}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div 
              className={cn(
                "flex-1 w-full bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-border dark:border-zinc-850 overflow-hidden transition-all duration-300",
                previewMode === 'mobile' ? "max-w-[360px] ring-4 ring-gray-900 dark:ring-zinc-800" : 
                previewMode === 'tablet' ? "max-w-[700px] ring-4 ring-gray-800 dark:ring-zinc-800" : "max-w-4xl"
              )}
            >
              <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                <WebsitePreview site={site} products={products} />
              </div>
            </div>
          </aside>
        )}

        {/* COLUMN 3 (RIGHT): Settings Panel (Site & Active Block tabs) */}
        <aside className="w-[360px] bg-white dark:bg-zinc-900 border-l border-border dark:border-zinc-850 overflow-hidden flex flex-col shrink-0 transition-colors duration-200">
          <nav className="flex border-b border-border dark:border-zinc-850 p-2 bg-muted/20 dark:bg-zinc-950/20">
            <button 
              onClick={() => setActiveTab('site')}
              className={cn(
                "flex-1 flex items-center justify-center py-2 rounded-lg gap-2 transition-all font-bold text-[10px] uppercase tracking-wider",
                activeTab === 'site' ? "bg-white dark:bg-zinc-800 shadow-sm text-primary dark:text-white border dark:border-zinc-750" : "text-muted-foreground dark:text-zinc-500 hover:bg-muted dark:hover:bg-zinc-800/50"
              )}
            >
              <Settings className="h-4 w-4" />
              Site
            </button>
            <button 
              onClick={() => setActiveTab('block')}
              className={cn(
                "flex-1 flex items-center justify-center py-2 rounded-lg gap-2 transition-all font-bold text-[10px] uppercase tracking-wider",
                activeTab === 'block' ? "bg-white dark:bg-zinc-800 shadow-sm text-primary dark:text-white border dark:border-zinc-750" : "text-muted-foreground dark:text-zinc-500 hover:bg-muted dark:hover:bg-zinc-800/50"
              )}
            >
              <Layout className="h-4 w-4" />
              Block
            </button>
          </nav>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
              >
                
                {/* SITE SETTINGS TAB */}
                {activeTab === 'site' && (
                  <div className="space-y-6">
                    {/* Site Title */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Nama Usaha / Website</label>
                      <input 
                        className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/30 dark:bg-zinc-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                        value={site.title}
                        onChange={(e) => setSite({ ...site, title: e.target.value })}
                        placeholder="Contoh: Toko Kopi Jago"
                      />
                    </div>

                    {/* Site Slug */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">URL Slug</label>
                      <div className="flex items-center group">
                        <div className="rounded-l-xl border border-r-0 border-border dark:border-zinc-800 bg-muted dark:bg-zinc-800 px-3 py-2.5 text-xs font-bold text-muted-foreground dark:text-zinc-450 select-none">
                          /jagobisnis/
                        </div>
                        <input 
                          className="flex-1 rounded-r-xl border border-border dark:border-zinc-800 bg-muted/30 dark:bg-zinc-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-primary dark:text-amber-400"
                          value={site.slug}
                          onChange={(e) => setSite({ ...site, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        />
                      </div>
                    </div>

                    {/* Logo Section: Upload or Pick Icon */}
                    <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                      <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider block">Logo & Identitas Bisnis</label>
                      
                      <div className="space-y-4">
                        {/* File Upload Zone */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Unggah Berkas Logo</label>
                          <div 
                            onClick={() => logoUploadRef.current?.click()}
                            className="border-2 border-dashed border-border dark:border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-primary dark:hover:border-amber-400 bg-gray-50/20 dark:bg-zinc-950/20 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex flex-col items-center justify-center gap-1.5 group"
                          >
                            <input 
                              type="file" 
                              ref={logoUploadRef} 
                              onChange={(e) => handleFileUpload(e, 'logo')} 
                              className="hidden" 
                              accept="image/*" 
                            />
                            {site.theme.logoUrl ? (
                              <div className="space-y-2">
                                <img src={site.theme.logoUrl} alt="Logo" className="h-10 mx-auto object-contain rounded" />
                                <p className="text-[9px] text-green-500 font-bold">✓ Logo Berhasil Diunggah</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">Pilih Berkas Gambar</p>
                                <p className="text-[9px] text-muted-foreground">Format JPG, PNG, atau SVG (Maks. 2MB)</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Pick Icon Dropdown */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Atau Pilih Simbol / Icon</label>
                          <select
                            className="w-full rounded-xl border border-border dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={site.theme.logoIcon || ''}
                            onChange={(e) => {
                              setSite({
                                ...site,
                                theme: {
                                  ...site.theme,
                                  logoIcon: e.target.value || undefined,
                                  logoUrl: undefined // Clear uploaded logo if icon chosen
                                }
                              });
                            }}
                          >
                            <option value="">-- Tanpa Icon / Gunakan Teks Saja --</option>
                            {LOGO_ICONS.map((icon) => (
                              <option key={icon.value} value={icon.value}>{icon.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Color Palette Theme Selector */}
                    <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                      <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider block">Tema Warna Bisnis</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESET_PALETTES.map((preset) => {
                          const isSelected = site.theme.primaryColor === preset.primary;
                          return (
                            <button
                              key={preset.name}
                              onClick={() => {
                                setSite({
                                  ...site,
                                  theme: {
                                    ...site.theme,
                                    primaryColor: preset.primary,
                                    backgroundColor: preset.bg,
                                    textColor: preset.text
                                  }
                                });
                                toast.success(`Tema ${preset.name} berhasil diterapkan!`);
                              }}
                              className={cn(
                                "p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5",
                                isSelected 
                                  ? "border-primary dark:border-amber-400 bg-white dark:bg-zinc-900 ring-2 ring-primary/10" 
                                  : "border-border dark:border-zinc-850 bg-gray-50/30 hover:bg-white dark:hover:bg-zinc-900"
                              )}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="h-3.5 w-3.5 rounded-full border border-black/5" style={{ backgroundColor: preset.primary }} />
                                <span className="text-[9px] font-black text-gray-900 dark:text-white truncate">{preset.name.split(' ')[0]}</span>
                              </div>
                              <div className="flex gap-1">
                                <div className="h-2 w-full rounded" style={{ backgroundColor: preset.bg }} />
                                <div className="h-2 w-full rounded" style={{ backgroundColor: preset.text }} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Typography/Font selector with example previews */}
                    <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                      <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider block">Tipografi & Font</label>
                      <select
                        className="w-full rounded-xl border border-border dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        value={site.theme.font}
                        onChange={(e) => {
                          setSite({
                            ...site,
                            theme: {
                              ...site.theme,
                              font: e.target.value
                            }
                          });
                        }}
                      >
                        {FONTS.map((font) => (
                          <option key={font.value} value={font.value}>{font.name}</option>
                        ))}
                      </select>

                      {/* Live typography example block */}
                      <div className="p-3.5 bg-muted/20 dark:bg-zinc-950/20 rounded-xl border border-dashed border-border dark:border-zinc-800 text-center space-y-1">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest">Contoh Preview Font</p>
                        <p style={{ fontFamily: site.theme.font }} className="text-sm font-extrabold text-foreground dark:text-white">
                          Abc123 - Toko Kopi Jago
                        </p>
                        <p style={{ fontFamily: site.theme.font }} className="text-xs text-muted-foreground leading-normal max-w-xs mx-auto">
                          Menyediakan seduhan terbaik dari biji kopi pilihan Nusantara langsung ke cangkir Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* DYNAMIC ACTIVE BLOCK EDITORS TAB */}
                {activeTab === 'block' && (
                  <div className="space-y-6">
                    {!activeSection ? (
                      <div className="py-20 text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-muted dark:bg-zinc-850 flex items-center justify-center mx-auto">
                          <Layout className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-tight">Tidak Ada Blok Aktif</p>
                          <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">Silakan pilih salah satu blok di kanvas tengah untuk mulai mengedit isi konten dan tombol aksinya secara dinamis.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        {/* Section Header Details */}
                        <div className="flex items-center gap-3 pb-3 border-b border-border dark:border-zinc-850">
                          <div className="h-9 w-9 rounded-xl bg-primary/5 dark:bg-amber-400/5 flex items-center justify-center text-primary dark:text-amber-400">
                            {React.createElement(getSectionIcon(activeSection.type), { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Tipe Blok</p>
                            <h4 className="text-xs font-black text-gray-900 dark:text-white capitalize">{activeSection.type.replace('-', ' ')}</h4>
                          </div>
                        </div>

                        {/* HERO BLOCK DYNAMIC FIELDS */}
                        {activeSection.type === 'hero' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Headline Utama (Judul)</label>
                              <textarea
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold min-h-[60px]"
                                value={activeSection.content.headline || ''}
                                onChange={(e) => updateActiveSectionContent('headline', e.target.value)}
                                placeholder="Headline utama hero banner..."
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Subheadline (Deskripsi)</label>
                              <textarea
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[80px] leading-relaxed"
                                value={activeSection.content.subheadline || ''}
                                onChange={(e) => updateActiveSectionContent('subheadline', e.target.value)}
                                placeholder="Tuliskan penjelasan produk utama di sini..."
                              />
                            </div>

                            {/* Background Image Upload Zone */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">Unggah Gambar Latar (Background)</label>
                              <div 
                                onClick={() => bgUploadRef.current?.click()}
                                className="border-2 border-dashed border-border dark:border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-primary dark:hover:border-amber-400 bg-gray-50/20 dark:bg-zinc-950/20 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex flex-col items-center justify-center gap-1 group"
                              >
                                <input 
                                  type="file" 
                                  ref={bgUploadRef} 
                                  onChange={(e) => handleFileUpload(e, 'hero-bg')} 
                                  className="hidden" 
                                  accept="image/*" 
                                />
                                {activeSection.content.backgroundImage ? (
                                  <div className="space-y-2">
                                    <img src={activeSection.content.backgroundImage} alt="Hero BG" className="h-14 mx-auto object-cover rounded w-full aspect-[2/1]" />
                                    <p className="text-[9px] text-green-500 font-bold">✓ Gambar Latar Ditambahkan</p>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <p className="text-[11px] font-bold text-gray-700 dark:text-zinc-300">Pilih Berkas Latar</p>
                                    <p className="text-[8px] text-muted-foreground">Dimensi disarankan 1920x1080 (Maks. 2MB)</p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* BUTTONS CONFIGURATION CHECKLIST */}
                            <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                              <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider block">Aksi Tombol Hero</label>
                              
                              <div className="flex flex-col gap-2.5">
                                {/* Checklist Switches */}
                                {[
                                  { key: 'custom', label: 'Tombol Kustom' },
                                  { key: 'catalog', label: 'Lihat Katalog (Produk Bisnis)' },
                                  { key: 'whatsapp', label: 'WhatsApp (Hubungi CS)' },
                                  { key: 'maps', label: 'Peta (Petunjuk Lokasi)' }
                                ].map((btn) => {
                                  const currentButtons = activeSection.content.buttons || {};
                                  const isChecked = !!currentButtons[btn.key];
                                  return (
                                    <div key={btn.key} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 dark:bg-zinc-950/20 border border-border/40">
                                      <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{btn.label}</span>
                                      <input 
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const newButtons = { ...currentButtons, [btn.key]: e.target.checked };
                                          updateActiveSectionContent('buttons', newButtons);
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                                      />
                                    </div>
                                  );
                                })}

                                {/* Custom Button Details Fields (visible if custom button checked) */}
                                {activeSection.content.buttons?.custom && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="p-3 bg-gray-50/50 dark:bg-zinc-850/50 rounded-xl border border-border/60 dark:border-zinc-800 space-y-2 mt-1"
                                  >
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Teks Tombol Kustom</label>
                                      <input
                                        type="text"
                                        className="w-full rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-900 dark:text-white font-bold"
                                        value={activeSection.content.buttonText || ''}
                                        onChange={(e) => updateActiveSectionContent('buttonText', e.target.value)}
                                        placeholder="Hubungi Kami"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Teks URL Tombol</label>
                                      <input
                                        type="text"
                                        className="w-full rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-900 dark:text-white font-medium"
                                        value={activeSection.content.buttonUrl || ''}
                                        onChange={(e) => updateActiveSectionContent('buttonUrl', e.target.value)}
                                        placeholder="https://example.com"
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* DYNAMIC FITUR KARTU EDITOR (SUPPORT UP TO 8 CARDS) */}
                        {activeSection.type === 'features-cards' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Judul Seksyen</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                value={activeSection.content.title || ''}
                                onChange={(e) => updateActiveSectionContent('title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Subtitle Seksyen</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-medium"
                                value={activeSection.content.subtitle || ''}
                                onChange={(e) => updateActiveSectionContent('subtitle', e.target.value)}
                              />
                            </div>

                            {/* List of cards editor */}
                            <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Daftar Kartu Fitur ({activeSection.content.cards?.length || 0}/8)</label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={(activeSection.content.cards?.length || 0) >= 8}
                                  onClick={() => {
                                    const cards = [...(activeSection.content.cards || [])];
                                    cards.push({ title: `Fitur ${cards.length + 1}`, desc: 'Deskripsi singkat layanan baru.' });
                                    updateActiveSectionContent('cards', cards);
                                  }}
                                  className="h-8 rounded-lg text-primary text-[10px] font-bold p-1 gap-1"
                                >
                                  <PlusCircle className="h-4 w-4" />
                                  Tambah
                                </Button>
                              </div>

                              <div className="flex flex-col gap-3">
                                {(activeSection.content.cards || []).map((card: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-muted/20 dark:bg-zinc-950/20 border border-border/40 rounded-xl space-y-2 relative">
                                    <button
                                      onClick={() => {
                                        const cards = (activeSection.content.cards || []).filter((_: any, i: number) => i !== idx);
                                        updateActiveSectionContent('cards', cards);
                                      }}
                                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 rounded transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>

                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">KARTU {idx + 1}</span>
                                    
                                    <div className="space-y-1.5">
                                      <input
                                        type="text"
                                        className="w-11/12 rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
                                        value={card.title || ''}
                                        onChange={(e) => {
                                          const cards = [...activeSection.content.cards];
                                          cards[idx] = { ...cards[idx], title: e.target.value };
                                          updateActiveSectionContent('cards', cards);
                                        }}
                                        placeholder="Nama Fitur/Layanan"
                                      />
                                      <textarea
                                        className="w-full rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 min-h-[50px]"
                                        value={card.desc || ''}
                                        onChange={(e) => {
                                          const cards = [...activeSection.content.cards];
                                          cards[idx] = { ...cards[idx], desc: e.target.value };
                                          updateActiveSectionContent('cards', cards);
                                        }}
                                        placeholder="Penjelasan ringkas keunggulan..."
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ABOUT BLOCK DYNAMIC FIELDS */}
                        {activeSection.type === 'about' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Judul Seksyen</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                value={activeSection.content.title || ''}
                                onChange={(e) => updateActiveSectionContent('title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Penjelasan Profil Bisnis</label>
                              <textarea
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-700 dark:text-zinc-200 font-medium min-h-[140px] leading-relaxed"
                                value={activeSection.content.description || ''}
                                onChange={(e) => updateActiveSectionContent('description', e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* CATALOG PRODUCTS CONFIGURATION */}
                        {activeSection.type === 'products' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Judul Seksyen Katalog</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                value={activeSection.content.title || ''}
                                onChange={(e) => updateActiveSectionContent('title', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 dark:bg-zinc-950/20 border border-border/40">
                              <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Tampilkan Katalog Produk</span>
                              <input 
                                type="checkbox"
                                checked={activeSection.content.showProducts !== false}
                                onChange={(e) => updateActiveSectionContent('showProducts', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                              />
                            </div>
                          </div>
                        )}

                        {/* GALLERY BLOCK DYNAMIC FIELDS */}
                        {activeSection.type === 'gallery' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Judul Galeri</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                value={activeSection.content.title || ''}
                                onChange={(e) => updateActiveSectionContent('title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Deskripsi Galeri</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-700 dark:text-zinc-200 font-medium"
                                value={activeSection.content.subtitle || ''}
                                onChange={(e) => updateActiveSectionContent('subtitle', e.target.value)}
                              />
                            </div>

                            {/* Multiple image gallery upload grid */}
                            <div className="space-y-2 pt-2 border-t border-border dark:border-zinc-850">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">Unggah Foto Galeri</label>
                              <div 
                                onClick={() => galleryUploadRef.current?.click()}
                                className="border-2 border-dashed border-border dark:border-zinc-800 rounded-xl p-5 text-center cursor-pointer hover:border-primary bg-gray-50/20 dark:bg-zinc-950/20 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-1 group"
                              >
                                <input 
                                  type="file" 
                                  ref={galleryUploadRef} 
                                  onChange={(e) => handleFileUpload(e, 'gallery')} 
                                  className="hidden" 
                                  accept="image/*" 
                                />
                                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">Pilih & Tambah Foto</p>
                              </div>

                              {/* Uploaded images list with deletion */}
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                {(activeSection.content.images || []).map((imgUrl: string, imgIdx: number) => (
                                  <div key={imgIdx} className="aspect-square bg-muted dark:bg-zinc-900 rounded-lg overflow-hidden border border-border/50 relative group">
                                    <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover" />
                                    <button
                                      onClick={() => {
                                        const newImages = (activeSection.content.images || []).filter((_: any, i: number) => i !== imgIdx);
                                        updateActiveSectionContent('images', newImages);
                                      }}
                                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* FAQ BLOCK DYNAMIC FIELDS */}
                        {activeSection.type === 'faq' && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Judul FAQ</label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                value={activeSection.content.title || ''}
                                onChange={(e) => updateActiveSectionContent('title', e.target.value)}
                              />
                            </div>

                            <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Daftar Pertanyaan & Jawaban</label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const faqs = [...(activeSection.content.faqs || [])];
                                    faqs.push({ q: 'Pertanyaan Baru?', a: 'Jawaban penjelasan singkat.' });
                                    updateActiveSectionContent('faqs', faqs);
                                  }}
                                  className="h-8 rounded-lg text-primary text-[10px] font-bold p-1 gap-1"
                                >
                                  <PlusCircle className="h-4 w-4" />
                                  Tambah
                                </Button>
                              </div>

                              <div className="flex flex-col gap-3">
                                {(activeSection.content.faqs || []).map((faq: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-muted/20 dark:bg-zinc-950/20 border border-border/40 rounded-xl space-y-2 relative">
                                    <button
                                      onClick={() => {
                                        const faqs = (activeSection.content.faqs || []).filter((_: any, i: number) => i !== idx);
                                        updateActiveSectionContent('faqs', faqs);
                                      }}
                                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 rounded transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>

                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">TANYA JAWAB {idx + 1}</span>
                                    
                                    <div className="space-y-1.5">
                                      <input
                                        type="text"
                                        className="w-11/12 rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white"
                                        value={faq.q || ''}
                                        onChange={(e) => {
                                          const faqs = [...activeSection.content.faqs];
                                          faqs[idx] = { ...faqs[idx], q: e.target.value };
                                          updateActiveSectionContent('faqs', faqs);
                                        }}
                                        placeholder="Pertanyaan Anda"
                                      />
                                      <textarea
                                        className="w-full rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 min-h-[60px]"
                                        value={faq.a || ''}
                                        onChange={(e) => {
                                          const faqs = [...activeSection.content.faqs];
                                          faqs[idx] = { ...faqs[idx], a: e.target.value };
                                          updateActiveSectionContent('faqs', faqs);
                                        }}
                                        placeholder="Tuliskan jawaban penjelasan..."
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* OTHER BLOCKS DYNAMIC FIELDS FALLBACKS */}
                        {!['hero', 'features-cards', 'about', 'products', 'gallery', 'faq'].includes(activeSection.type) && (
                          <div className="space-y-4">
                            {/* Generic Title */}
                            {activeSection.content.title !== undefined && (
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Judul Blok</label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                  value={activeSection.content.title || ''}
                                  onChange={(e) => updateActiveSectionContent('title', e.target.value)}
                                />
                              </div>
                            )}
                            
                            {/* Generic Subtitle */}
                            {activeSection.content.subtitle !== undefined && (
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider">Subtitle</label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-medium"
                                  value={activeSection.content.subtitle || ''}
                                  onChange={(e) => updateActiveSectionContent('subtitle', e.target.value)}
                                />
                              </div>
                            )}

                            {/* Contact Custom Fields */}
                            {activeSection.type === 'contact' && (
                              <div className="space-y-4 pt-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">Nomor Telepon Kontak</label>
                                  <input
                                    type="text"
                                    className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                                    value={activeSection.content.phone || ''}
                                    onChange={(e) => updateActiveSectionContent('phone', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">Alamat Usaha</label>
                                  <input
                                    type="text"
                                    className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                                    value={activeSection.content.address || ''}
                                    onChange={(e) => updateActiveSectionContent('address', e.target.value)}
                                    placeholder="Contoh: Jl. Diponegoro No. 12"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">Pesan Otomatis WhatsApp</label>
                                  <textarea
                                    className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs font-medium text-gray-900 dark:text-white"
                                    value={activeSection.content.whatsappText || ''}
                                    onChange={(e) => updateActiveSectionContent('whatsappText', e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Logos commas items */}
                            {activeSection.type === 'logos' && (
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-muted-foreground dark:text-zinc-550 uppercase tracking-wider block">Deretan Logo (Pisahkan dengan Koma)</label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-border dark:border-zinc-800 bg-muted/20 dark:bg-zinc-950 px-3 py-2 text-xs text-gray-900 dark:text-white font-bold"
                                  value={activeSection.content.items?.join(', ') || ''}
                                  onChange={(e) => {
                                    const items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                                    updateActiveSectionContent('items', items);
                                  }}
                                />
                              </div>
                            )}

                            {/* Generic Action Buttons details */}
                            {activeSection.content.buttonText !== undefined && (
                              <div className="space-y-3 pt-3 border-t border-border dark:border-zinc-850">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Teks Tombol Aksi</label>
                                  <input
                                    type="text"
                                    className="w-full rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-900 dark:text-white font-bold"
                                    value={activeSection.content.buttonText || ''}
                                    onChange={(e) => updateActiveSectionContent('buttonText', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">URL Tujuan Tombol</label>
                                  <input
                                    type="text"
                                    className="w-full rounded-lg border border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-900 dark:text-white font-medium"
                                    value={activeSection.content.buttonUrl || ''}
                                    onChange={(e) => updateActiveSectionContent('buttonUrl', e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
}
