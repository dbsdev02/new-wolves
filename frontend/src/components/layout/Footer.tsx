'use client';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { useSiteSettings } from '@/hooks/useContent';

const footerLinks = {
  Properties: [
    { label: 'Buy Property', href: '/properties?purpose=sale' },
    { label: 'Rent Property', href: '/properties?purpose=rent' },
    { label: 'Off Plan', href: '/properties?purpose=off_plan' },
    { label: 'Luxury Properties', href: '/properties?is_luxury=true' },
    { label: 'List Your Property', href: '/list-your-property' },
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
  const { data: settings } = useSiteSettings();

  return (
    <footer className="bg-ink text-white">
      <div className="container-luxe py-20 md:py-24">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <span
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                color: '#ffffff',
              }}
            >
              Wolves <span style={{ color: 'var(--gold-deep)' }}>International</span>
            </span>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
              {settings?.description ||
                'A private Dubai real estate consultancy for discerning investors and end users. Curated inventory, quiet negotiations, long-term stewardship.'}
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/60">
              <a href={`tel:${settings?.phone || process.env.NEXT_PUBLIC_PHONE}`} className="block hover:text-gold transition-colors">
                {settings?.phone || process.env.NEXT_PUBLIC_PHONE}
              </a>
              {settings?.toll_free_number && (
                <a href={`tel:${settings.toll_free_number}`} className="block hover:text-gold transition-colors">
                  Toll Free: {settings.toll_free_number}
                </a>
              )}
              <a href={`mailto:${settings?.email || 'info@wolvesint.ae'}`} className="block hover:text-gold transition-colors">
                {settings?.email || 'info@wolvesint.ae'}
              </a>
              <p>{settings?.address || '20th floor Al Moosa Tower 1, Trade Centre, Sheikh Zayed Road, Dubai'}</p>
            </div>
            <div className="mt-8 flex gap-3">
              {[
                { icon: FaInstagram, href: settings?.instagram || 'https://www.instagram.com/wolvesint.ae' },
                { icon: FaLinkedin, href: settings?.linkedin || '#' },
                { icon: FaFacebook, href: settings?.facebook || 'https://www.facebook.com/profile.php?id=61572233312435' },
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
          <div className="lg:col-span-7 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 tracking-wider">
            © {new Date().getFullYear()} Wolves International. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms' },
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
