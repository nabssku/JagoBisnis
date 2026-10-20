import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jago-bisnis.my.id';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  let sites: Array<{ slug: string; updatedAt: string }> = [];

  try {
    const res = await fetch(`${apiUrl}/public/published-sites-list`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (res.ok) {
      sites = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch published sites for sitemap:', error);
  }

  // Base static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic published shop sites
  const dynamicSitePages: MetadataRoute.Sitemap = sites.map((site) => ({
    url: `${baseUrl}/jagobisnis/${site.slug}`,
    lastModified: new Date(site.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...dynamicSitePages];
}
