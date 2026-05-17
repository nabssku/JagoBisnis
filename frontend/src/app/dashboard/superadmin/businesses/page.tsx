'use client';

import React, { useEffect, useState } from 'react';
import { superAdminService, AdminBusiness } from '@/services/superadmin.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Store, 
  Search, 
  Trash2, 
  ExternalLink, 
  Phone, 
  MapPin, 
  Package, 
  Receipt,
  User,
  Compass,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingBusinessId, setDeletingBusinessId] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      const data = await superAdminService.getBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error('Failed to load businesses', err);
      toast.error('Gagal mengambil data direktori bisnis.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDeleteBusiness = async (business: AdminBusiness) => {
    const confirmMessage = `PERINGATAN KRITIKAL:
Apakah Anda yakin ingin menghapus bisnis "${business.name}" secara permanen?

Tindakan ini akan menghapus seluruh data produk, pesanan, integrasi, website builder, dan media milik toko ini secara permanen dari server database. Tindakan ini TIDAK DAPAT DIBATALKAN.`;
      
    if (!window.confirm(confirmMessage)) return;

    setDeletingBusinessId(business.id);
    try {
      await superAdminService.deleteBusiness(business.id);
      toast.success(`Profil bisnis "${business.name}" telah dihapus secara permanen dari platform.`);
      fetchBusinesses();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Gagal menghapus bisnis.';
      toast.error(errorMsg);
    } finally {
      setDeletingBusinessId(null);
    }
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return 'Lainnya';
    const mapping: Record<string, string> = {
      fnb: 'Kuliner',
      fashion: 'Fashion',
      retail: 'Retail',
      electronics: 'Elektronik',
      services: 'Jasa',
      health: 'Kesehatan/Kecantikan',
      automotive: 'Otomotif',
    };
    return mapping[category.toLowerCase()] || category;
  };

  const filteredBusinesses = businesses.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.slug.toLowerCase().includes(query) ||
      (b.owner && b.owner.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          Direktori Profil Bisnis
        </h1>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
          Review profil usaha UMKM terdaftar, kunjungi tautan katalog publik, dan moderasi konten jika diperlukan.
        </p>
      </div>

      {/* Control Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari bisnis berdasarkan nama, slug, atau pemilik..."
            className="rounded-xl h-11 pl-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/15"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 shadow-sm">
          <Store className="h-4.5 w-4.5 text-[#e8aa20]" />
          <span>Total Bisnis Aktif: <span className="text-zinc-900 dark:text-white font-black">{filteredBusinesses.length}</span></span>
        </div>
      </div>

      {/* Warning Box */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            Panduan Moderasi Konten
          </h4>
          <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-550 leading-relaxed">
            Menghapus bisnis akan melakukan cascade delete pada seluruh relasi tabel (Product, Order, Media, Site, Posts, dan Integrasi). Silakan verifikasi keluhan dari customer atau pemilik sebelum menekan tombol hapus permanen.
          </p>
        </div>
      </div>

      {/* Grid of Businesses */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-2 border-zinc-200 dark:border-zinc-800 text-center py-16">
          <CardContent className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
              <Store className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Profil bisnis tidak ditemukan</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Coba ganti kata kunci pencarian Anda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBusinesses.map((b) => (
            <Card 
              key={b.id} 
              className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {getCategoryLabel(b.category)}
                    </span>
                    <h3 className="text-base font-black text-zinc-950 dark:text-white pt-1">
                      {b.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#e8aa20]">
                      jago/{b.slug}
                    </span>
                  </div>

                  <a 
                    href={`/jago/${b.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
                    title="Kunjungi Catalog Publik"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-150 dark:border-zinc-850">
                  {/* Left sub-column */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                      Informasi Kontak & Lokasi
                    </span>
                    {b.phone && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{b.phone}</span>
                      </div>
                    )}
                    {b.address ? (
                      <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{b.address}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-550 italic">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>Alamat belum ditentukan</span>
                      </div>
                    )}
                    
                    {/* Owner detail */}
                    {b.owner && (
                      <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-100 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                          <User className="h-3.5 w-3.5 text-[#e8aa20]" />
                          <span>Pemilik Toko</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{b.owner.name}</p>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{b.owner.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Right sub-column: Stats & Volumes */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                      Volume Katalog & Transaksi
                    </span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Products card */}
                      <div className="rounded-xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 text-center">
                        <Package className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
                        <span className="text-[10px] font-bold text-zinc-400 block">Produk</span>
                        <span className="text-base font-black text-zinc-900 dark:text-white mt-1 block">
                          {b.productsCount}
                        </span>
                      </div>

                      {/* Orders card */}
                      <div className="rounded-xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 text-center">
                        <Receipt className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
                        <span className="text-[10px] font-bold text-zinc-400 block">Pesanan</span>
                        <span className="text-base font-black text-zinc-900 dark:text-white mt-1 block">
                          {b.ordersCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 justify-end">
                      <span>Dibuat pada {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Operations Action Panel */}
              <div className="bg-zinc-50 dark:bg-zinc-850/60 p-4 border-t border-zinc-100 dark:border-zinc-850 flex justify-end">
                <Button
                  onClick={() => handleDeleteBusiness(b)}
                  disabled={deletingBusinessId === b.id}
                  className="h-9 rounded-xl font-extrabold text-xs px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  {deletingBusinessId === b.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  ) : (
                    <>
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Hapus Toko Permanen
                    </>
                  )}
                </Button>
              </div>

            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
