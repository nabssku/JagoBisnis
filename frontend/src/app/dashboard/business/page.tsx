'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { businessService } from '@/services/business.service';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Settings, Building2 } from 'lucide-react';

export default function BusinessListPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await businessService.getAll();
        setBusinesses(data);
      } catch (err) {
        console.error('Failed to fetch businesses', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleSelectBusiness = (id: string) => {
    localStorage.setItem('activeBusinessId', id);
    // You could also update a global state/context here
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bisnis Saya</h1>
          <p className="text-sm text-gray-500">Kelola profil bisnis Anda di sini.</p>
        </div>
        <Link href="/dashboard/business/create">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Bisnis
          </Button>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mb-4" />
          <CardTitle>Belum ada bisnis</CardTitle>
          <CardDescription className="max-w-xs mt-2">
            Anda belum mendaftarkan bisnis apa pun. Mulai dengan membuat bisnis pertama Anda.
          </CardDescription>
          <Link href="/dashboard/business/create" className="mt-6">
            <Button>Buat Bisnis Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="group relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <CardDescription>{business.category || 'Tanpa kategori'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                  {business.description || 'Tidak ada deskripsi.'}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSelectBusiness(business.id)}
                  >
                    Pilih Bisnis
                  </Button>
                  <Link href={`/dashboard/business/${business.id}/settings`}>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Pengaturan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
