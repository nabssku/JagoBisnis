import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk Akun',
  description: 'Masuk ke dashboard JagoBisnis Anda dan kelola POS kasir serta website bisnis Anda.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
