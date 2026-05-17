'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  FileText,
  Mail,
  Send,
  LayoutList,
  Image as ImageIcon,
  ShoppingBag,
  Edit,
  Share2,
  Wrench,
  DollarSign,
  Speaker,
  CreditCard,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Monitor,
  ChevronLeft,
  ExternalLink,
  ChevronRight,
  Store,
  Package,
  Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { businessService } from '@/services/business.service';
import { Business } from '@/types/business';

interface SidebarProps {
  businessId?: string;
}

export function Sidebar({ businessId }: SidebarProps) {
  const pathname = usePathname();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (businessId) {
      businessService.getById(businessId).then(setBusiness).catch(console.error);
    }
  }, [businessId]);

  const routes = [
    { label: 'Ringkasan', icon: LayoutDashboard, href: '/dashboard', active: pathname === '/dashboard' },
    { label: 'Profil Usaha', icon: User, href: businessId ? `/dashboard/business/${businessId}/settings` : '#', active: pathname.includes('/settings') },
    { label: 'Konten', icon: FileText, href: '#', active: false },
    { label: 'Inbox', icon: Mail, href: '#', active: false },
    { label: 'Sosial Media', icon: Send, href: '#', active: false },
    { label: 'Katalog', icon: LayoutList, href: businessId ? `/dashboard/business/${businessId}/products` : '#', active: pathname.includes('/products') },
    { label: 'Media', icon: ImageIcon, href: '#', active: false },
    { label: 'Pesanan', icon: ShoppingBag, href: '#', active: false },
    { label: 'Kustomisasi', icon: Edit, href: businessId ? `/dashboard/business/${businessId}/website` : '#', active: pathname.includes('/website') },
    { label: 'Integrasi', icon: Share2, href: '#', active: false },
    { label: 'Tools', icon: Wrench, href: '#', active: false },
    { label: 'Penghasilan', icon: DollarSign, href: '#', active: false },
    { label: 'Materi Promosi', icon: Speaker, href: '#', active: false },
    { label: 'Langganan', icon: CreditCard, href: '#', active: false },
    { label: 'Pengaturan', icon: Settings, href: '#', active: false },
    { label: 'Bantuan', icon: HelpCircle, href: '#', active: false },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 border-r bg-white font-sans flex flex-col shrink-0">
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 shadow-sm">
            <LayoutDashboard className="h-5 w-5 text-black" strokeWidth={3} />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">JagoBisnis</span>
        </div>
      </div>

      {/* Site URL Box */}
      {business && (
        <div className="px-4 mb-4 shrink-0">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 p-3 group hover:border-gray-200 transition-all cursor-pointer">
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website URL</span>
              <span className="truncate text-xs font-bold text-gray-600">jagobisnis.id/{business.slug}</span>
            </div>
            <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-gray-500" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <nav className="space-y-0.5">
          {routes.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              className={cn(
                'group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                route.active 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                route.href === '#' && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3">
                <route.icon className={cn('h-4 w-4 transition-colors', route.active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600')} />
                <span className={cn(route.active ? 'font-bold' : 'font-medium')}>{route.label}</span>
              </div>
              {route.active && <div className="h-1.5 w-1.5 rounded-full bg-gray-900" />}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-50 shrink-0 space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-1.5 border border-gray-100 shadow-sm">
          <button className="flex h-8 flex-1 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm transition-all hover:scale-[1.02]">
            <Sun className="h-4 w-4" />
          </button>
          <button className="flex h-8 flex-1 items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 transition-all hover:scale-[1.02]">
            <Moon className="h-4 w-4" />
          </button>
          <button className="flex h-8 flex-1 items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 transition-all hover:scale-[1.02]">
            <Monitor className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
