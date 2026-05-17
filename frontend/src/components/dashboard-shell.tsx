'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Store, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { User } from '@/types/auth';

interface DashboardShellProps {
  children: React.ReactNode;
  businessId?: string;
  user?: User | null;
}

export function DashboardShell({ children, businessId, user }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 font-sans transition-colors duration-200">
      <Sidebar businessId={businessId} />
      
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between border-b border-gray-100 dark:border-zinc-900 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md px-10">
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          
          <div className="flex items-center gap-6">
            {/* User ID Tag */}
            <div className="hidden sm:flex items-center gap-4 border-r pr-6 border-gray-100 dark:border-zinc-900">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">ID User</span>
                <span className="text-xs font-black text-gray-900 dark:text-white font-mono">{user?.id?.slice(0, 8) || '24_357_Jago'}</span>
              </div>
            </div>
            
            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-4 group cursor-pointer select-none" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-gray-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{user?.name}</span>
                  <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500">{user?.email}</span>
                </div>
                <div className={cn(
                  "h-10 w-10 rounded-full border-2 bg-gray-100 dark:bg-zinc-800 shadow-sm flex items-center justify-center overflow-hidden transition-all group-hover:scale-105",
                  isDropdownOpen 
                    ? "border-amber-400 dark:border-amber-400" 
                    : "border-white dark:border-zinc-900 group-hover:border-amber-100 dark:group-hover:border-zinc-800"
                )}>
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#1F2937] to-gray-900 flex items-center justify-center text-white font-black text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown Menu Box */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-[#18181B] p-2 shadow-xl shadow-gray-200/50 dark:shadow-none animate-in fade-in slide-in-from-top-2 duration-150 z-30">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                  >
                    <Settings className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                    <span>Pengaturan Akun</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-500 dark:text-red-400" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
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
