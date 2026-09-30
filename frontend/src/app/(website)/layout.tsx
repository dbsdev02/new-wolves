import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { buildWebsiteJsonLd } from '@/lib/structuredData';
import type { SiteSettings } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_URL}/settings/`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings();
  const jsonLd = buildWebsiteJsonLd(settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
