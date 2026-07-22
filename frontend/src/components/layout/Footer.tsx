'use client';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { useFeaturedCommunities } from '@/hooks/useContent';
import { useSiteSettings } from '@/hooks/useContent';

const footerLinks = {
  Properties: [
    { label: 'Buy Property', href: '/properties?purpose=sale' },
    { label: 'Rent Property', href: '/properties?purpose=rent' },
    { label: 'Off Plan', href: '/properties?purpose=off_plan' },
    { label: 'Luxury Properties', href: '/properties?is_luxury=true' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/agents' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Buying Guide', href: '/services#buying' },
    { label: 'Selling Guide', href: '/services#selling' },
    { label: 'Property Management', href: '/services#management' },
    { label: 'Golden Visa', href: '/services#golden-visa' },
    { label: 'Mortgage Advisory', href: '/services#mortgage' },
  ],
};

export function Footer() {
  const { data: communities } = useFeaturedCommunities();
  const { data: settings } = useSiteSettings();

  return (
    <footer className="bg-ink text-white">
      <div className="container-luxe py-20 md:py-24">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div>
          <img src="/logo2.png" alt="Wolves International" className="h-12 w-auto" />
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
              {settings?.description ||
                'A private Dubai real estate consultancy for discerning investors and end users. Curated inventory, quiet negotiations, long-term stewardship.'}
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/60">
              <a href={`tel:${settings?.phone || process.env.NEXT_PUBLIC_PHONE}`} className="block hover:text-gold transition-colors">
                {settings?.phone || process.env.NEXT_PUBLIC_PHONE}
              </a>
              <a href={`mailto:${settings?.email || 'hello@wolvesintl.com'}`} className="block hover:text-gold transition-colors">
                {settings?.email || 'hello@wolvesintl.com'}
              </a>
              <p>{settings?.address || 'Level 42, Emirates Towers, Sheikh Zayed Road, Dubai, UAE'}</p>
            </div>
            <div className="mt-8 flex gap-3">
              {[
                { icon: FaInstagram, href: settings?.instagram || '#' },
                { icon: FaLinkedin, href: settings?.linkedin || '#' },
                { icon: FaFacebook, href: settings?.facebook || '#' },
                { icon: FaYoutube, href: settings?.youtube || '#' },
                { icon: FaWhatsapp, href: `https://wa.me/${settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP}` },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/15 hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <div className="eyebrow mb-5" style={{ color: 'var(--gold-soft)' }}>{title}</div>
                <ul className="space-y-3 text-sm text-white/70">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-gold transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <div className="eyebrow mb-5" style={{ color: 'var(--gold-soft)' }}>Communities</div>
              <ul className="space-y-3 text-sm text-white/70">
                {(communities?.length ? communities : []).slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/properties?community=${c.slug}`} className="hover:text-gold transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
                {!communities?.length && (
                  <>
                    <li>Palm Jumeirah</li>
                    <li>Downtown Dubai</li>
                    <li>Emirates Hills</li>
                    <li>Dubai Hills</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 tracking-wider">
            © {new Date().getFullYear()} Wolves International. {settings?.rera_number ? `RERA Broker No. ${settings.rera_number}.` : ''}
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Sitemap', href: '/sitemap.xml' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-white/40 hover:text-gold transition-colors tracking-wider">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
