'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { orderService } from '@/services/order.service';
import { Site } from '@/types/site';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Package, 
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Store,
  Coffee,
  ShoppingBag,
  Laptop,
  Heart,
  Sparkles,
  Award,
  Smile,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
  quantity: number;
  subtotal: number;
  paymentMethod: 'MANUAL' | 'PAKASIR';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  pakasirPaymentUrl?: string;
  createdAt: string;
  productName: string;
  productPrice: number;
}

export default function PublicOrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const orderId = params.orderId as string;

  const [site, setSite] = useState<Site | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('24:00:00');

  // Load site and order details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteData, orderData] = await Promise.all([
          siteService.getPublicSite(slug),
          orderService.getOrder(slug, orderId),
        ]);
        setSite(siteData);
        setOrder(orderData);
      } catch (err: any) {
        console.error(err);
        setError('Gagal memuat detail pesanan. Pastikan ID pesanan benar.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug && orderId) {
      fetchData();
    }
  }, [slug, orderId]);

  // Countdown timer for PENDING Pakasir payments
  useEffect(() => {
    if (!order || order.orderStatus !== 'PENDING' || order.paymentMethod !== 'PAKASIR') return;

    const calculateTimeLeft = () => {
      const orderTime = new Date(order.createdAt).getTime();
      const expireTime = orderTime + 24 * 60 * 60 * 1000; // 24 hours expiry
      const now = new Date().getTime();
      const difference = expireTime - now;

      if (difference <= 0) {
        return 'Expired';
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const pad = (num: number) => num.toString().padStart(2, '0');
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 'Expired') {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-base font-black tracking-tight text-gray-900 dark:text-white">Memuat Status Pesanan</h2>
            <p className="text-[10px] font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Sinkronisasi Data Transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="relative inline-block">
            <div className="text-9xl font-black text-gray-100 dark:text-zinc-900 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-20 w-20 text-primary opacity-20" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Pesanan Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
              {error || 'Detail pesanan ini tidak dapat ditemukan atau tidak terdaftar di sistem kami.'}
            </p>
          </div>
          <Button onClick={() => router.push(`/jagobisnis/${slug}`)} size="lg" className="rounded-2xl px-10 font-black h-12 shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-none">
            Kembali ke Toko
          </Button>
        </motion.div>
      </div>
    );
  }

  const { theme } = site;
  const businessPhone = site.business?.phone || '';

  // WhatsApp checkout message generator
  const getWhatsAppMessage = () => {
    const text = `Halo! Saya ingin konfirmasi pesanan berikut:\n\n` +
      `📦 *Pesanan:* ${order.productName}\n` +
      `🔢 *Jumlah:* ${order.quantity} pcs\n` +
      `💰 *Total Bayar:* Rp ${order.subtotal.toLocaleString('id-ID')}\n\n` +
      `👤 *Detail Pembeli:*\n` +
      `- *Nama:* ${order.customerName}\n` +
      `- *No. WhatsApp:* ${order.customerPhone}\n` +
      `- *Alamat:* ${order.customerAddress || '-'}\n` +
      `- *Catatan:* ${order.notes || '-'}\n\n` +
      `Metode pembayaran: WhatsApp Manual\n\n` +
      `Mohon instruksi selanjutnya untuk pembayaran dan pengiriman. Terima kasih!`;
    return `https://wa.me/${businessPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-850 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60',
    CONFIRMED: 'bg-green-100 text-green-850 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-900/60',
    CANCELLED: 'bg-red-100 text-red-850 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/60',
    COMPLETED: 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60',
  };

  const statusLabels = {
    PENDING: 'Menunggu Pembayaran',
    CONFIRMED: 'Telah Dikonfirmasi',
    CANCELLED: 'Dibatalkan',
    COMPLETED: 'Selesai',
  };

  return (
    <div 
      className="min-h-screen selection:bg-primary selection:text-white bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white transition-colors duration-200"
      style={{ fontFamily: theme.font }}
    >
      {/* Header */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="py-3.5 px-6 flex justify-between items-center bg-white/80 dark:bg-zinc-950/80 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push(`/jagobisnis/${slug}`)}>
          {(() => {
            if (theme.logoUrl) {
              return <img src={theme.logoUrl} alt={site.title} className="h-8 max-w-[140px] object-contain rounded" />;
            }
            const iconMap: Record<string, React.ComponentType<any>> = {
              globe: Globe,
              store: Store,
              coffee: Coffee,
              'shopping-bag': ShoppingBag,
              laptop: Laptop,
              heart: Heart,
              sparkles: Sparkles,
              award: Award,
              smile: Smile
            };
            const SelectedIcon = theme.logoIcon && iconMap[theme.logoIcon] ? iconMap[theme.logoIcon] : Globe;
            return (
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                <SelectedIcon className="h-4 w-4" />
              </div>
            );
          })()}
          <span className="text-base font-black tracking-tight" style={{ color: theme.textColor }}>
            {site.title}
          </span>
        </div>
        <Button 
          onClick={() => router.push(`/jagobisnis/${slug}`)}
          size="sm" 
          className="rounded-xl px-5 h-9 font-bold text-white text-xs border-none shadow-sm hover:scale-[1.01] transition-transform active:scale-95" 
          style={{ backgroundColor: theme.primaryColor }}
        >
          Kembali ke Toko
        </Button>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        {/* Success / Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800/80 p-8 shadow-xl text-center space-y-6"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-500 border border-green-100 dark:border-green-950/50">
            <CheckCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Pesanan Anda Berhasil Dibuat!</h1>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">ID Pesanan: {order.id}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold shrink-0", statusColors[order.orderStatus])}>
              {statusLabels[order.orderStatus]}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-850 shrink-0 text-gray-700 dark:text-zinc-300">
              {order.paymentMethod === 'PAKASIR' ? 'Pakasir Checkout' : 'WhatsApp Manual'}
            </span>
          </div>

          {/* Action Trigger Card */}
          {order.orderStatus === 'PENDING' && (
            <div className="border-t border-gray-100 dark:border-zinc-900 pt-6">
              {order.paymentMethod === 'PAKASIR' ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-950/30 flex items-center gap-3 text-left">
                    <Clock className="h-5 w-5 text-amber-600 shrink-0 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Selesaikan Pembayaran</p>
                      <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                        Batas waktu pembayaran Anda: <span className="font-extrabold text-amber-600 dark:text-amber-400">{timeLeft}</span>
                      </p>
                    </div>
                  </div>
                  {order.pakasirPaymentUrl && (
                    <Button 
                      onClick={() => window.open(order.pakasirPaymentUrl, '_blank')}
                      className="w-full h-11 rounded-xl font-bold text-xs shadow-md text-white transition-all hover:scale-[1.01] active:scale-95 bg-blue-600 hover:bg-blue-700 border-none flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Bayar Sekarang
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/30 flex items-center gap-3 text-left">
                    <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Konfirmasi Pembayaran</p>
                      <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                        Silakan hubungi admin toko via WhatsApp untuk instruksi pembayaran manual dan pengiriman.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open(getWhatsAppMessage(), '_blank')}
                    className="w-full h-11 rounded-xl font-bold text-xs shadow-md text-white transition-all hover:scale-[1.01] active:scale-95 bg-emerald-500 hover:bg-emerald-600 border-none flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4 fill-current" />
                    Hubungi via WhatsApp
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Order Details & Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800/80 p-8 shadow-xl space-y-6"
        >
          <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white text-left">Ringkasan Pesanan</h2>

          {/* Product Info Block */}
          <div className="flex gap-4 text-left p-4 rounded-2xl bg-gray-50/60 dark:bg-zinc-900/30 border border-border/40">
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted dark:bg-zinc-950 shrink-0 border border-border/20 flex items-center justify-center opacity-40 bg-gray-100 dark:bg-zinc-800">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[8px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">PRODUK</span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">{order.productName}</h4>
              <div className="text-xs text-muted-foreground font-semibold">
                {order.quantity} pcs x Rp {order.productPrice.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Breakdown Fields */}
          <div className="space-y-4 text-left border-t border-gray-100 dark:border-zinc-900/60 pt-6">
            <div className="grid grid-cols-2 py-1.5 border-b border-gray-50 dark:border-zinc-900/40 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">Nama Pelanggan</span>
              <span className="text-gray-900 dark:text-zinc-200 font-semibold text-right">{order.customerName}</span>
            </div>
            <div className="grid grid-cols-2 py-1.5 border-b border-gray-50 dark:border-zinc-900/40 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">No. WhatsApp</span>
              <span className="text-gray-900 dark:text-zinc-200 font-semibold text-right">{order.customerPhone}</span>
            </div>
            <div className="grid grid-cols-2 py-1.5 border-b border-gray-50 dark:border-zinc-900/40 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">Alamat Pengiriman</span>
              <span className="text-gray-900 dark:text-zinc-200 font-semibold text-right leading-relaxed max-w-[240px] ml-auto">{order.customerAddress || '-'}</span>
            </div>
            <div className="grid grid-cols-2 py-1.5 border-b border-gray-50 dark:border-zinc-900/40 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">Catatan Tambahan</span>
              <span className="text-gray-900 dark:text-zinc-200 font-semibold text-right italic">{order.notes || '-'}</span>
            </div>
            <div className="grid grid-cols-2 py-1.5 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">Metode Pembayaran</span>
              <span className="text-gray-900 dark:text-zinc-200 font-semibold text-right">
                {order.paymentMethod === 'PAKASIR' ? 'Pakasir Payment Gateway' : 'WhatsApp Manual'}
              </span>
            </div>

            {/* Total Payment Box */}
            <div className="mt-6 p-4 rounded-2xl bg-gray-50/60 dark:bg-zinc-900/30 border border-border/40 flex justify-between items-center">
              <span className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-widest">Total Pembayaran</span>
              <span className="text-base font-extrabold tracking-tight" style={{ color: theme.primaryColor }}>
                Rp{order.subtotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100 dark:border-zinc-900 bg-gray-50/30 dark:bg-zinc-950/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-lg font-bold tracking-tight">{site.title}</h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">© 2024 Semua Hak Dilindungi.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Platform Web Oleh</p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary flex items-center justify-center text-white text-[8px] font-black">JB</div>
              <span className="font-bold text-sm tracking-tighter text-blue-600">JagoBisnis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
