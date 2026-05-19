import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan Layanan',
  description: 'Baca syarat dan ketentuan penggunaan platform JagoBisnis untuk pengelolaan website dan POS kasir UMKM.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
