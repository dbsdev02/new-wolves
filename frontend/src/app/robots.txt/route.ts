import { NextResponse } from 'next/server';

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wolvesintl.com';
  const content = `User-agent: *\nAllow: /\n\nDisallow: /admin/\nDisallow: /api/\nDisallow: /login/\nDisallow: /forgot-password/\nDisallow: /reset-password/\nDisallow: /wishlist/\nDisallow: /compare/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } });
}
