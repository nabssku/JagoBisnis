import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Akun Baru',
  description: 'Mulai buat website profil UMKM Anda dan sistem POS kasir Anda gratis dengan mendaftar di JagoBisnis.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
