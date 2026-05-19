import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jago-bisnis.my.id';

  const txt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/jagobisnis/${slug}/sitemap.xml
`;

  return new NextResponse(txt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
