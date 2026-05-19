import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding Bisnis Baru',
  description: 'Siapkan profil bisnis UMKM baru Anda untuk meluncurkan website andalan Anda di JagoBisnis.',
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
