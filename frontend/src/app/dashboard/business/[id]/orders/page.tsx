'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { orderService } from '@/services/order.service';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardShell } from '@/components/dashboard-shell';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Phone, 
  MapPin, 
  MessageSquare, 
  AlertCircle,
  Truck,
  XCircle,
  Calendar,
  CreditCard,
  DollarSign
} from 'lucide-react';

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
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

const orderStatusColors = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40',
  COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/40',
};

const orderStatusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Dikonfirmasi',
  COMPLETED: 'Selesai',
  CANCELLED: 'Batal',
};

const paymentStatusColors = {
  UNPAID: 'bg-gray-100 text-gray-800 dark:bg-zinc-800/40 dark:text-zinc-400 border border-gray-200 dark:border-zinc-850',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-900/40',
  EXPIRED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/40',
};

const paymentStatusLabels = {
  UNPAID: 'Belum Bayar',
  PENDING: 'Pending',
  PAID: 'Lunas',
  EXPIRED: 'Expired',
  FAILED: 'Gagal',
};

export default function OrderListPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const [ordersData, userData] = await Promise.all([
        orderService.getMerchantOrders(businessId),
        authService.getMe()
      ]);
      setOrders(ordersData || []);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch orders data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [businessId]);

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateOrderStatus(businessId, orderId, { orderStatus: newStatus });
      // Local state update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus as any } : o));
    } catch (err) {
      alert('Gagal memperbarui status pesanan.');
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateOrderStatus(businessId, orderId, { paymentStatus: newStatus });
      // Local state update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus as any } : o));
    } catch (err) {
      alert('Gagal memperbarui status pembayaran.');
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Compute stats
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDING').length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'COMPLETED').length;
  const totalEarnings = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.subtotal, 0);

  if (isLoading) {
    return (
      <DashboardShell businessId={businessId} user={null}>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
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
        className="space-y-8 text-left"
      >
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Kelola Pesanan</h1>
          <p className="text-sm font-medium text-gray-400 dark:text-zinc-400">Pantau dan kelola transaksi pemesanan dari pelanggan Anda.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-[2rem] border-gray-150 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center border border-blue-100 dark:border-blue-950 shrink-0">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">Total Pesanan</span>
                <p className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{totalOrdersCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-gray-150 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-950 shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">Pending</span>
                <p className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{pendingOrdersCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-gray-150 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-950/20 text-green-500 flex items-center justify-center border border-green-100 dark:border-green-950 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">Selesai</span>
                <p className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{completedOrdersCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-gray-150 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-950 shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">Total Pendapatan</span>
                <p className="text-lg font-black tracking-tight text-gray-900 dark:text-white truncate">
                  Rp{totalEarnings.toLocaleString('id-ID')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table Container */}
        <Card className="rounded-[2rem] border-gray-150 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
          <CardContent className="p-0">
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/10 text-left">
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">No. Pesanan / Tanggal</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Produk / Qty</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Metode</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status Pesanan</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status Pembayaran</th>
                      <th className="px-6 py-4.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Kelola Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                        {/* No. Pesanan & Tanggal */}
                        <td className="px-6 py-4 space-y-1">
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white block truncate max-w-[120px]">{order.id}</span>
                          <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="px-6 py-4 space-y-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-white block">{order.customerName}</span>
                          <div className="flex flex-col gap-0.5 text-[10px] font-semibold text-gray-400 dark:text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </span>
                            <span className="flex items-center gap-1 truncate max-w-[180px]">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {order.customerAddress || '-'}
                            </span>
                          </div>
                        </td>

                        {/* Product Detail */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 overflow-hidden shrink-0">
                              {order.product?.imageUrl ? (
                                <img src={order.product.imageUrl} alt={order.product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center opacity-10">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-extrabold text-gray-900 dark:text-white block truncate max-w-[160px]">{order.product?.name || 'Produk'}</span>
                              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">{order.quantity} pcs</span>
                            </div>
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            Rp{order.subtotal.toLocaleString('id-ID')}
                          </span>
                        </td>

                        {/* Payment Method */}
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1",
                            order.paymentMethod === 'PAKASIR'
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60"
                          )}>
                            {order.paymentMethod === 'PAKASIR' ? (
                              <>
                                <CreditCard className="h-3 w-3" />
                                Pakasir
                              </>
                            ) : (
                              <>
                                <MessageSquare className="h-3 w-3" />
                                WA Manual
                              </>
                            )}
                          </span>
                        </td>

                        {/* Order Status Badge */}
                        <td className="px-6 py-4">
                          <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border block text-center max-w-[120px]", orderStatusColors[order.orderStatus])}>
                            {orderStatusLabels[order.orderStatus]}
                          </span>
                        </td>

                        {/* Payment Status Badge */}
                        <td className="px-6 py-4">
                          <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border block text-center max-w-[120px]", paymentStatusColors[order.paymentStatus])}>
                            {paymentStatusLabels[order.paymentStatus]}
                          </span>
                        </td>

                        {/* Update Status Dropdowns */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col gap-1.5 items-end justify-end">
                            <select
                              disabled={updatingOrderId === order.id}
                              value={order.orderStatus}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold px-2.5 py-1.5 focus:outline-none cursor-pointer w-[120px]"
                            >
                              <option value="PENDING">Set Pending</option>
                              <option value="CONFIRMED">Set Konfirmasi</option>
                              <option value="COMPLETED">Set Selesai</option>
                              <option value="CANCELLED">Set Batal</option>
                            </select>

                            <select
                              disabled={updatingOrderId === order.id}
                              value={order.paymentStatus}
                              onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                              className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold px-2.5 py-1.5 focus:outline-none cursor-pointer w-[120px]"
                            >
                              <option value="UNPAID">Set Belum Bayar</option>
                              <option value="PENDING">Set Pending</option>
                              <option value="PAID">Set Lunas</option>
                              <option value="EXPIRED">Set Expired</option>
                              <option value="FAILED">Set Gagal</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-zinc-900/40 border border-border flex items-center justify-center shadow-inner">
                  <AlertCircle className="h-6 w-6 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Belum Ada Pesanan</h3>
                  <p className="text-xs text-muted-foreground font-semibold max-w-[280px]">Semua transaksi pesanan masuk akan ditampilkan secara rinci di sini.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  );
}
