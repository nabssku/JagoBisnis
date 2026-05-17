'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { DashboardShell } from '@/components/dashboard-shell';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ProductListPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, userData] = await Promise.all([
          productService.getAll(businessId),
          authService.getMe()
        ]);
        setProducts(productsData);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  const confirmDelete = (id: string) => {
    setDeleteProductId(id);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    setIsDeleting(true);
    try {
      await productService.delete(businessId, deleteProductId);
      setProducts(products.filter((p) => p.id !== deleteProductId));
      setDeleteProductId(null);
    } catch {
      alert('Gagal menghapus produk.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell businessId={businessId} user={null}>
        <div className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell businessId={businessId} user={user}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Katalog Produk</h1>
            <p className="text-sm font-medium text-gray-400 dark:text-zinc-400">Kelola daftar jualan dan inventaris Anda.</p>
          </div>
          <Link href={`/dashboard/business/${businessId}/products/create`}>
            <Button className="h-12 rounded-xl bg-gray-900 dark:bg-zinc-100 px-6 font-black text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-lg transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              Tambah Produk
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden border-gray-100 dark:border-zinc-800 shadow-xl rounded-[2rem] bg-white dark:bg-zinc-900">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Produk</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Kategori</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Harga</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Stok</th>
                    <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-16 w-16 rounded-3xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-black text-gray-900 dark:text-white">Belum ada produk</p>
                            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">Mulai tambahkan produk pertama Anda untuk berjualan.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 shadow-sm transition-transform group-hover:scale-105">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-black uppercase text-gray-300 dark:text-zinc-600">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-gray-900 dark:text-white">{product.name}</span>
                              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">ID: {product.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-zinc-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                            {product.category || 'Umum'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="font-black text-gray-900 dark:text-white">Rp {product.price.toLocaleString('id-ID')}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "font-black",
                            product.stock > 10 ? "text-green-600 dark:text-green-400" : "text-amber-500 dark:text-amber-400"
                          )}>
                            {product.stock} <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase ml-1">Unit</span>
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/dashboard/business/${businessId}/products/${product.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-zinc-850 hover:shadow-md dark:hover:shadow-none">
                                <Edit className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 hover:shadow-md"
                              onClick={() => confirmDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Modal
        isOpen={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        title="Hapus Produk?"
        description="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setDeleteProductId(null)}>
              Batal
            </Button>
            <Button variant="danger" className="flex-1 h-12 rounded-xl font-black bg-red-600 text-white" onClick={handleDelete} isLoading={isDeleting}>
              Ya, Hapus
            </Button>
          </div>
        }
      />
    </DashboardShell>
  );
}
