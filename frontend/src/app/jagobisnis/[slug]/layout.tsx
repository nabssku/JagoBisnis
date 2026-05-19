import type { Metadata } from 'next';

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function getPublicSite(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${apiUrl}/public/sites/${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching site SEO details:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getPublicSite(slug);

  if (!site) {
    return {
      title: 'Halaman Tidak Ditemukan - JagoBisnis',
      description: 'Halaman yang Anda tuju tidak ditemukan atau belum dipublikasikan.',
    };
  }

  // Read SEO settings from theme object
  const { theme, title, business } = site;
  const seoTitle = theme?.seoTitle || title || `${business?.name || 'Bisnis'} - JagoBisnis`;
  const seoDescription = theme?.seoDescription || 'Kunjungi website bisnis resmi kami untuk info produk, promo, dan penawaran terbaik.';
  const seoKeywords = theme?.seoKeywords || `${title}, website bisnis, JagoBisnis`;
  const seoImage = theme?.seoImage || theme?.logoUrl || '/favicon.ico';

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      url: `https://jagobisnis.id/jagobisnis/${slug}`,
      images: [
        {
          url: seoImage,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
    },
    alternates: {
      canonical: `/jagobisnis/${slug}`,
    },
  };
}

export default function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
