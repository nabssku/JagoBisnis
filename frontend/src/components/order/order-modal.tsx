import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Minus, Plus, ShoppingCart, MessageSquare, CreditCard, ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { Site } from '@/types/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { orderService } from '@/services/order.service';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  site: Site;
  onSuccess?: (orderId: string, paymentUrl?: string) => void;
}

const PAYMENT_CHANNELS = [
  { id: 'qris', name: 'QRIS (Gopay, OVO, Dana, LinkAja, dll)', badge: 'Instan' },
  { id: 'bri_va', name: 'BRI Virtual Account (BRIVA)' },
  { id: 'bni_va', name: 'BNI Virtual Account' },
  { id: 'permata_va', name: 'Permata Virtual Account' },
  { id: 'cimb_niaga_va', name: 'CIMB Niaga Virtual Account' },
  { id: 'bnc_va', name: 'BNC Virtual Account' },
  { id: 'maybank_va', name: 'Maybank Virtual Account' },
];

export function OrderModal({ isOpen, onClose, product, site, onSuccess }: OrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'MANUAL' | 'PAKASIR'>('MANUAL');
  const [paymentChannel, setPaymentChannel] = useState('qris');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  const isPakasirConnected = site.integrations?.pakasir?.connected || false;
  const totalPrice = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Nama pelanggan wajib diisi');
      return;
    }
    if (!customerPhone.trim()) {
      setError('Nomor WhatsApp wajib diisi');
      return;
    }
    if (!shippingAddress.trim()) {
      setError('Alamat pengiriman wajib diisi');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: any = {
        productId: product.id,
        quantity,
        customerName,
        customerPhone,
        customerAddress: shippingAddress,
        notes,
        paymentMethod,
      };

      if (paymentMethod === 'PAKASIR') {
        payload.paymentChannel = paymentChannel;
      }

      const res = await orderService.createOrder(site.slug, payload);

      if (onSuccess) {
        onSuccess(res.id, res.pakasirPaymentUrl || undefined);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-900 flex justify-between items-center shrink-0 bg-gray-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ backgroundColor: site.theme.primaryColor }}>
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">Formulir Pemesanan</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Silakan isi detail pengiriman Anda</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-gray-250/20 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product Summary */}
              <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-zinc-900/30 border border-border/40 flex gap-4 text-left">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted dark:bg-zinc-950 shrink-0 border border-border/20">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-10">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[8px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{product.category || 'PRODUK'}</span>
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">{product.name}</h4>
                  <div className="font-bold text-xs" style={{ color: site.theme.primaryColor }}>
                    Rp{product.price.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950 text-left">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold"
                    style={{ '--primary': site.theme.primaryColor } as any}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold"
                    style={{ '--primary': site.theme.primaryColor } as any}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">Alamat Lengkap Pengiriman</label>
                  <textarea
                    required
                    placeholder="Tulis alamat rumah, jalan, RT/RW, kecamatan, kota, dan kode pos"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={2.5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold resize-none"
                    style={{ '--primary': site.theme.primaryColor } as any}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Warna merah, ukuran L, dll."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold"
                    style={{ '--primary': site.theme.primaryColor } as any}
                  />
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between py-2.5 border-t border-b border-gray-100 dark:border-zinc-900/60 my-2">
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">Kuantitas</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="h-8 w-8 rounded-lg border border-gray-250/20 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="h-8 w-8 rounded-lg border border-gray-250/20 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Payment Method Option */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider block">Metode Pembayaran</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MANUAL')}
                      className={cn(
                        "p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer flex flex-col justify-center",
                        paymentMethod === 'MANUAL'
                          ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 shadow-sm"
                          : "border-border hover:border-gray-300 dark:hover:border-zinc-800"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
                          WhatsApp Manual
                        </span>
                        {paymentMethod === 'MANUAL' && <Check className="h-4 w-4 text-emerald-500" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium leading-normal">Checkout manual via pesan WhatsApp pribadi.</p>
                    </button>

                    {/* Pakasir (if connected) */}
                    {isPakasirConnected && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PAKASIR')}
                        className={cn(
                          "p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer flex flex-col justify-center",
                          paymentMethod === 'PAKASIR'
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                            : "border-border hover:border-gray-300 dark:hover:border-zinc-800"
                        )}
                        style={{ borderColor: paymentMethod === 'PAKASIR' ? site.theme.primaryColor : undefined }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5" style={{ color: site.theme.primaryColor }} />
                            Pakasir Checkout
                          </span>
                          {paymentMethod === 'PAKASIR' && <Check className="h-4 w-4" style={{ color: site.theme.primaryColor }} />}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium leading-normal">Pembayaran QRIS & VA otomatis terverifikasi.</p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Pakasir payment channel option if PAKASIR method is chosen */}
                {paymentMethod === 'PAKASIR' && (
                  <div className="space-y-1.5 animate-fade-in pt-1">
                    <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">Pilih Saluran Pembayaran</label>
                    <div className="relative">
                      <select
                        value={paymentChannel}
                        onChange={(e) => setPaymentChannel(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-bold focus:outline-none appearance-none cursor-pointer"
                      >
                        {PAYMENT_CHANNELS.map(ch => (
                          <option key={ch.id} value={ch.id}>
                            {ch.name} {ch.badge ? `(${ch.badge})` : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Total Summary & Submit */}
              <div className="pt-6 border-t border-gray-100 dark:border-zinc-900/60 flex items-center justify-between gap-6 shrink-0">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-0.5">Total Bayar</span>
                  <div className="text-base font-extrabold tracking-tight" style={{ color: site.theme.primaryColor }}>
                    Rp{totalPrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl px-6 h-11 font-bold text-xs text-white border-none shadow-md hover:scale-[1.01] active:scale-95 transition-transform shrink-0"
                  style={{ backgroundColor: site.theme.primaryColor }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Pesan Sekarang
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
