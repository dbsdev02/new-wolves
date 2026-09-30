import type { SiteSettings } from '@/types';
import { getMediaUrl } from './utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wolvesint.ae';

// Sitewide JSON-LD: identifies Wolves International as the business
// operating this site, and separately credits DBS Media Tech as the
// website's creator via schema.org's `creator` property — not `sameAs`,
// which would incorrectly assert the two are the same entity. Rendered as
// metadata only (a <script type="application/ld+json"> tag), never as
// visible page content.
export function buildWebsiteJsonLd(settings: SiteSettings | null) {
  const sameAs = [
    settings?.instagram,
    settings?.facebook,
    settings?.linkedin,
    settings?.youtube,
    settings?.tiktok,
    settings?.twitter,
  ].filter((url): url is string => Boolean(url) && url !== '#');

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: settings?.company_name || 'Wolves International',
    url: SITE_URL,
    ...(settings?.logo ? { logo: getMediaUrl(settings.logo) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.address,
            addressLocality: settings.city || 'Dubai',
            addressCountry: settings.country || 'AE',
          },
        }
      : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings?.company_name || 'Wolves International',
    publisher: { '@id': `${SITE_URL}/#organization` },
    creator: {
      '@type': 'Organization',
      name: 'DBS Media Tech',
      url: 'https://dbsmediatech.com/',
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  };
}
