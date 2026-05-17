'use client';

import React from 'react';
import { Store, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Sidebar } from './sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
  businessId?: string;
  user?: { id?: string; name: string; email: string } | null;
}

export function DashboardShell({ children, businessId, user }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const getPageTitle = () => {
    if (pathname.includes('/settings')) return 'Profil Usaha';
    if (pathname.includes('/products')) return 'Katalog Produk';
    if (pathname.includes('/website')) return 'Website Builder';
    return 'Ringkasan';
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
      <Sidebar businessId={businessId} />
      
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between border-b bg-white/80 backdrop-blur-md px-10">
          <h1 className="text-xl font-black tracking-tight text-gray-900">
            {getPageTitle()}
          </h1>
          
          <div className="flex items-center gap-6">
            {/* User ID Tag */}
            <div className="hidden sm:flex items-center gap-4 border-r pr-6 border-gray-100">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID User</span>
                <span className="text-xs font-black text-gray-900 font-mono">{user?.id?.slice(0, 8) || '24_357_Jago'}</span>
              </div>
            </div>
            
            {/* Profile Dropdown Placeholder */}
            <div className="flex items-center gap-4 group cursor-pointer" onClick={handleLogout}>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-gray-900 group-hover:text-amber-500 transition-colors">{user?.name}</span>
                <span className="text-[10px] font-medium text-gray-400">{user?.email}</span>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 shadow-sm flex items-center justify-center overflow-hidden transition-all group-hover:scale-105 group-hover:border-amber-100">
                <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-black text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-10">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
