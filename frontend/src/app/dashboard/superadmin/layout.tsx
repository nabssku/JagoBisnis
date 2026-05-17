'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { 
  ShieldAlert, 
  Users, 
  Store, 
  Activity, 
  LogOut, 
  Settings, 
  ChevronRight, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const me = await authService.getMe();
        if (me.role !== 'SUPERADMIN') {
          toast.error('Akses ditolak: Area ini dikhususkan untuk SuperAdmin.');
          router.push('/dashboard');
          return;
        }
        setUser(me);
      } catch (err) {
        console.error('SuperAdmin authentication failed', err);
        localStorage.removeItem('accessToken');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  // Click outside handler for profile dropdown
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
    if (pathname === '/dashboard/superadmin/users') return 'Kelola Pengguna';
    if (pathname === '/dashboard/superadmin/businesses') return 'Kelola Bisnis';
    if (pathname === '/dashboard/superadmin/system') return 'Status & Kinerja Sistem';
    return 'Panel Utama SuperAdmin';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-[#e8aa20]" />
          <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Memuat konsol SuperAdmin...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: 'Konsol Utama',
      href: '/dashboard/superadmin',
      icon: ShieldAlert,
    },
    {
      label: 'Kelola Pengguna',
      href: '/dashboard/superadmin/users',
      icon: Users,
    },
    {
      label: 'Kelola Profil Bisnis',
      href: '/dashboard/superadmin/businesses',
      icon: Store,
    },
    {
      label: 'Status Sistem',
      href: '/dashboard/superadmin/system',
      icon: Activity,
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      
      {/* SuperAdmin Specific Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300",
        isSidebarMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-850">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-500 shadow-sm border border-red-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                Jago<span className="text-[#e8aa20]">Admin</span>
              </span>
              <span className="text-[9px] font-bold text-red-500 dark:text-red-400 uppercase tracking-widest leading-none">
                Platform Console
              </span>
            </div>
          </div>
          
          <button 
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            onClick={() => setIsSidebarMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all group",
                  isActive
                    ? "bg-[#e8aa20] text-black shadow-md shadow-amber-500/5 dark:shadow-none"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850/60"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-105",
                    isActive ? "text-black" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                  )} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 opacity-0 transition-all",
                  isActive ? "opacity-100 text-black translate-x-0.5" : "group-hover:opacity-40 group-hover:translate-x-0.5"
                )} />
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Landing Page</span>
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-72">
        
        {/* Header bar */}
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between border-b border-zinc-200/60 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 md:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 border border-zinc-250 dark:border-zinc-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg md:text-xl font-black tracking-tight text-zinc-950 dark:text-white">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* System Administrator badge */}
            <div className="hidden sm:flex flex-col items-end border-r pr-6 border-zinc-200 dark:border-zinc-800">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Otoritas</span>
              <span className="text-xs font-black text-red-500 dark:text-red-400 uppercase tracking-wider animate-pulse">SuperAdmin</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-3 group cursor-pointer select-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-black text-zinc-900 dark:text-white group-hover:text-[#e8aa20] transition-colors">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {user?.email}
                  </span>
                </div>
                <div className={cn(
                  "h-10 w-10 rounded-xl border-2 bg-zinc-150 dark:bg-zinc-800 flex items-center justify-center overflow-hidden transition-all group-hover:scale-[1.03]",
                  isDropdownOpen 
                    ? "border-[#e8aa20]" 
                    : "border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                )}>
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-red-500 flex items-center justify-center text-white font-black text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Dropdown Content */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-30">
                  <div className="px-3.5 py-3 border-b border-zinc-100 dark:border-zinc-850 md:hidden">
                    <p className="text-xs font-black text-zinc-900 dark:text-white">{user?.name}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all text-left"
                  >
                    <Settings className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    <span>Profil Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-500 dark:text-red-450" />
                    <span>Keluar Konsol</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content area */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-zinc-950/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarMobileOpen(false)}
        />
      )}
    </div>
  );
}
