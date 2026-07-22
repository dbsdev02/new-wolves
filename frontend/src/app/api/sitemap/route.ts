import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wolvesintl.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}${endpoint}?page_size=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || data).map((item: any) => item.slug || item.id);
  } catch {
    return [];
  }
}

export async function GET() {
  const [properties, projects, developers, communities, blogs, agents] = await Promise.all([
    fetchSlugs('/properties/'),
    fetchSlugs('/projects/'),
    fetchSlugs('/developers/'),
    fetchSlugs('/communities/'),
    fetchSlugs('/blogs/'),
    fetchSlugs('/agents/'),
  ]);

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/properties', priority: '0.9', changefreq: 'daily' },
    { url: '/projects', priority: '0.9', changefreq: 'daily' },
    { url: '/developers', priority: '0.8', changefreq: 'weekly' },
    { url: '/communities', priority: '0.8', changefreq: 'weekly' },
    { url: '/agents', priority: '0.7', changefreq: 'weekly' },
    { url: '/blogs', priority: '0.8', changefreq: 'daily' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/services', priority: '0.7', changefreq: 'monthly' },
    { url: '/careers', priority: '0.6', changefreq: 'weekly' },
  ];

  const dynamicPages = [
    ...properties.map(slug => ({ url: `/properties/${slug}`, priority: '0.8', changefreq: 'weekly' })),
    ...projects.map(slug => ({ url: `/projects/${slug}`, priority: '0.8', changefreq: 'weekly' })),
    ...developers.map(slug => ({ url: `/developers/${slug}`, priority: '0.7', changefreq: 'monthly' })),
    ...communities.map(slug => ({ url: `/communities/${slug}`, priority: '0.7', changefreq: 'monthly' })),
    ...blogs.map(slug => ({ url: `/blogs/${slug}`, priority: '0.7', changefreq: 'monthly' })),
    ...agents.map(id => ({ url: `/agents/${id}`, priority: '0.6', changefreq: 'monthly' })),
  ];

  const allPages = [...staticPages, ...dynamicPages];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
