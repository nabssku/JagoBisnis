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
import { useTheme } from '@/components/theme-provider';

interface SidebarProps {
  businessId?: string;
}

export function Sidebar({ businessId }: SidebarProps) {
  const pathname = usePathname();
  const [business, setBusiness] = useState<Business | null>(null);
  const { theme, setTheme } = useTheme();
  const [hostUrl, setHostUrl] = useState('jagobisnis.id');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostUrl(window.location.host);
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      businessService.getById(businessId).then(setBusiness).catch(console.error);
    }
  }, [businessId]);

  const routes = [
    { label: 'Ringkasan', icon: LayoutDashboard, href: '/dashboard', active: pathname === '/dashboard' },
    { label: 'Kelola Bisnis', icon: Store, href: businessId ? `/dashboard/business/${businessId}/settings` : '#', active: pathname.includes('/settings') },
    { label: 'Konten', icon: FileText, href: businessId ? `/dashboard/business/${businessId}/posts` : '#', active: pathname.includes('/posts') },
    { label: 'Inbox', icon: Mail, href: '#', active: false },
    { label: 'Sosial Media', icon: Send, href: businessId ? `/dashboard/business/${businessId}/social-posts` : '#', active: pathname.includes('/social-posts') },
    { label: 'Katalog', icon: LayoutList, href: businessId ? `/dashboard/business/${businessId}/products` : '#', active: pathname.includes('/products') },
    { label: 'Media', icon: ImageIcon, href: businessId ? `/dashboard/business/${businessId}/media` : '#', active: pathname.includes('/media') },
    { label: 'Pesanan', icon: ShoppingBag, href: businessId ? `/dashboard/business/${businessId}/orders` : '#', active: pathname.includes('/orders') },
    { label: 'Kustomisasi', icon: Edit, href: businessId ? `/dashboard/business/${businessId}/website` : '#', active: pathname.includes('/website') },
    { label: 'Integrasi', icon: Share2, href: businessId ? `/dashboard/business/${businessId}/integrations` : '#', active: pathname.includes('/integrations') },
    { label: 'Tools', icon: Wrench, href: '#', active: false },
    { label: 'Penghasilan', icon: DollarSign, href: '#', active: false },
    { label: 'Materi Promosi', icon: Speaker, href: '#', active: false },
    { label: 'Langganan', icon: CreditCard, href: '#', active: false },
    { label: 'Pengaturan', icon: Settings, href: '#', active: false },
    { label: 'Bantuan', icon: HelpCircle, href: '#', active: false },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] font-sans flex flex-col shrink-0 transition-colors duration-200">
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 shadow-sm">
            <LayoutDashboard className="h-5 w-5 text-black" strokeWidth={3} />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">JagoBisnis</span>
        </div>
      </div>

      {/* Site URL Box */}
      {business && (
        <div className="px-4 mb-4 shrink-0">
          <div 
            onClick={() => window.open(`/jagobisnis/${business.slug}`, '_blank')}
            className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/80 p-3 group hover:border-gray-200 dark:hover:border-zinc-700 transition-all cursor-pointer"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">Website URL</span>
              <span className="truncate text-xs font-bold text-gray-600 dark:text-zinc-300">{hostUrl}/jagobisnis/{business.slug}</span>
            </div>
            <ExternalLink className="h-3 w-3 text-gray-300 dark:text-zinc-600 group-hover:text-gray-500 dark:group-hover:text-zinc-400" />
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
                  ? 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 hover:text-gray-900 dark:hover:text-white',
                route.href === '#' && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3">
                <route.icon className={cn('h-4 w-4 transition-colors', route.active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300')} />
                <span className={cn(route.active ? 'font-bold' : 'font-medium')}>{route.label}</span>
              </div>
              {route.active && <div className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-900 shrink-0 space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 dark:bg-zinc-900/50 p-1.5 border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <button 
            onClick={() => setTheme('light')}
            className={cn(
              "flex h-8 flex-1 items-center justify-center rounded-xl transition-all hover:scale-[1.02]",
              theme === 'light'
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
            )}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={cn(
              "flex h-8 flex-1 items-center justify-center rounded-xl transition-all hover:scale-[1.02]",
              theme === 'dark'
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
            )}
          >
            <Moon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={cn(
              "flex h-8 flex-1 items-center justify-center rounded-xl transition-all hover:scale-[1.02]",
              theme === 'system'
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
            )}
          >
            <Monitor className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
