import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jago-bisnis.my.id';

  try {
    // 1. Fetch site & products
    const siteRes = await fetch(`${apiUrl}/public/sites/${slug}`);
    if (!siteRes.ok) {
      return new NextResponse('Site Not Found', { status: 404 });
    }
    const site = await siteRes.json();

    // 2. Fetch posts
    let posts = [];
    try {
      const postsRes = await fetch(`${apiUrl}/public/sites/${slug}/posts`);
      if (postsRes.ok) {
        posts = await postsRes.json();
      }
    } catch (e) {
      console.error('Error fetching posts for sitemap:', e);
    }

    const lastmod = site.updatedAt ? new Date(site.updatedAt).toISOString() : new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>${siteUrl}/jagobisnis/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add products
    const products = site.business?.Product || [];
    products.forEach((prod: any) => {
      const prodLastmod = prod.updatedAt ? new Date(prod.updatedAt).toISOString() : lastmod;
      xml += `
  <url>
    <loc>${siteUrl}/jagobisnis/${slug}/product/${prod.id}</loc>
    <lastmod>${prodLastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add posts
    posts.forEach((post: any) => {
      const postLastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : lastmod;
      xml += `
  <url>
    <loc>${siteUrl}/jagobisnis/${slug}/posts/${post.slug}</loc>
    <lastmod>${postLastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
