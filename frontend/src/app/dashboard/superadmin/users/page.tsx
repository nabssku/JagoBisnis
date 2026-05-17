'use client';

import React, { useEffect, useState } from 'react';
import { superAdminService, AdminUser } from '@/services/superadmin.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserMinus, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Store
} from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingUserId, setMutatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await superAdminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load user directory', err);
      toast.error('Gagal mengambil data direktori pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user: AdminUser) => {
    const targetRole = user.role === 'SUPERADMIN' ? 'USER' : 'SUPERADMIN';
    const confirmMessage = user.role === 'SUPERADMIN' 
      ? `Apakah Anda yakin ingin menurunkan ${user.name} menjadi User biasa?`
      : `Apakah Anda yakin ingin menaikkan ${user.name} menjadi SuperAdmin?`;
      
    if (!window.confirm(confirmMessage)) return;

    setMutatingUserId(user.id);
    try {
      await superAdminService.updateUserRole(user.id, targetRole);
      toast.success(`Berhasil mengubah peran ${user.name} menjadi ${targetRole}!`);
      fetchUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Gagal mengubah peran pengguna.';
      toast.error(errorMsg);
    } finally {
      setMutatingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          Direktori Pengguna
        </h1>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
          Lihat semua akun terdaftar, berikan wewenang administrator, dan pantau profil bisnis mereka.
        </p>
      </div>

      {/* Control Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari pengguna berdasarkan nama, email, atau telepon..."
            className="rounded-xl h-11 pl-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-[#e8aa20] focus:ring-2 focus:ring-[#e8aa20]/15"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 shadow-sm">
          <Users className="h-4.5 w-4.5 text-[#e8aa20]" />
          <span>Total Pengguna Ditemukan: <span className="text-zinc-900 dark:text-white font-black">{filteredUsers.length}</span></span>
        </div>
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-2 border-zinc-200 dark:border-zinc-800 text-center py-16">
          <CardContent className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Pengguna tidak ditemukan</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Coba ganti kata kunci pencarian Anda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((u) => {
            const isCoreAdmin = u.email === 'jagobisnis@jago-bisnis.my.id';
            const hasBusinesses = u.BusinessUser.length > 0;
            
            return (
              <Card 
                key={u.id} 
                className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* User Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-sm text-zinc-800 dark:text-zinc-200">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-zinc-950 dark:text-white leading-tight">
                          {u.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                          u.role === 'SUPERADMIN'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/15'
                            : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {u.role === 'SUPERADMIN' && <ShieldCheck className="h-3 w-3" />}
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mt-6 border-t border-zinc-100 dark:border-zinc-850 pt-4">
                    <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Mail className="h-4 w-4 text-zinc-400" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    {u.phone && (
                      <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <Phone className="h-4 w-4 text-zinc-400" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <span>Bergabung {formatDate(u.createdAt)}</span>
                    </div>
                  </div>

                  {/* Business Associations */}
                  <div className="mt-4 pt-3 border-t border-dashed border-zinc-150 dark:border-zinc-850">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-2">
                      Profil Bisnis Tertaut ({u.BusinessUser.length})
                    </span>
                    {hasBusinesses ? (
                      <div className="flex flex-wrap gap-2">
                        {u.BusinessUser.map((bu) => (
                          <div 
                            key={bu.business.id} 
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                          >
                            <Store className="h-3.5 w-3.5 text-[#e8aa20]" />
                            <span>{bu.business.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 italic block">
                        Belum mendirikan bisnis.
                      </span>
                    )}
                  </div>
                </div>

                {/* Account role toggle controls */}
                <div className="bg-zinc-50 dark:bg-zinc-850/60 p-4 border-t border-zinc-100 dark:border-zinc-850 flex justify-end">
                  {isCoreAdmin ? (
                    <span className="text-[10px] font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest leading-none py-2 px-1">
                      Sistem Administrator Utama (Terkunci)
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleRoleToggle(u)}
                      disabled={mutatingUserId === u.id}
                      className={`h-9 rounded-xl font-extrabold text-xs px-4 py-2 border transition-all cursor-pointer ${
                        u.role === 'SUPERADMIN'
                          ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border-zinc-200 dark:border-zinc-750'
                          : 'bg-[#e8aa20]/15 hover:bg-[#e8aa20]/25 text-[#e8aa20] border-[#e8aa20]/30 hover:scale-[1.01]'
                      }`}
                    >
                      {mutatingUserId === u.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e8aa20] border-t-transparent" />
                      ) : u.role === 'SUPERADMIN' ? (
                        <>
                          <UserMinus className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                          Demote ke User
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                          Promote ke Admin
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
