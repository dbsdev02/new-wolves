'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiLocationMarker, HiSearch } from 'react-icons/hi';

const dealTabs = [
  { label: 'Buy', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Off Plan', value: 'off_plan' },
] as const;

const bedroomOptions = ['Studio', '1', '2', '3', '4', '5+'];

const stats = [
  { value: '1,200+', label: 'Residences' },
  { value: '40+', label: 'Advisors' },
  { value: 'AED 2B+', label: 'Transacted' },
  { value: '10+', label: 'Years' },
];

export function HeroSection() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<(typeof dealTabs)[number]['value']>('sale');
  const [search, setSearch] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (search) params.set('search', search);
    if (bedrooms && bedrooms !== 'Studio') params.set('min_bedrooms', bedrooms === '5+' ? '5' : bedrooms);
    if (bedrooms === 'Studio') params.set('property_type', 'studio');
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
      {/* Background */}
      <img
        src="/hero-dubai-Dc7SIc-2.jpg"
        alt="Dubai skyline"
        className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.65) 0%, rgba(13,13,13,0.4) 50%, rgba(13,13,13,0.85) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 container-luxe flex flex-col justify-center flex-1 pt-28 pb-0">
        <div className="max-w-3xl">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)', letterSpacing: '0.38em' }}>
            Wolves International — Private Dubai Real Estate
          </p>
          <h1 className="mt-5 text-white" style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}>
            Find your<br />
            home in{' '}
            <em className="not-italic" style={{ color: 'var(--gold-soft)' }}>Dubai.</em>
          </h1>
          <p className="mt-7 text-white/70 text-base md:text-lg font-light leading-relaxed max-w-lg">
            Curated villas, penthouses and off-plan investments — quietly brokered
            by a private advisory trusted for over a decade.
          </p>
        </div>

        {/* Search Widget */}
        <div className="mt-12 w-full max-w-3xl">
          {/* Tabs */}
          <div className="flex gap-1.5 mb-0">
            {dealTabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setPurpose(t.value)}
                className={`px-6 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase font-semibold transition-all duration-200 ${
                  purpose === t.value
                    ? 'bg-white text-[var(--ink)]'
                    : 'bg-white/10 text-white/75 hover:bg-white/18 backdrop-blur border border-white/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="bg-white shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto]">
              <div className="flex items-center gap-3 px-6 py-4 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border)' }}>
                <HiLocationMarker className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                <div className="flex-1">
                  <p className="label-luxury mb-1">Location</p>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Area, project or community"
                    className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-[var(--muted)]"
                    style={{ color: 'var(--ink)' }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border)' }}>
                <p className="label-luxury mb-1">Bedrooms</p>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer"
                  style={{ color: 'var(--ink)' }}
                >
                  <option value="">Any</option>
                  {bedroomOptions.map((b) => (
                    <option key={b} value={b}>{b === 'Studio' ? 'Studio' : `${b} BR`}</option>
                  ))}
                </select>
              </div>
              <div className="p-2">
                <button
                  onClick={handleSearch}
                  className="btn-gold h-full w-full md:w-auto md:px-10 gap-2"
                >
                  <HiSearch className="h-4 w-4" /> Search
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[0.65rem] tracking-[0.2em] uppercase text-white/50">
            <Link href="/properties" className="hover:text-[var(--gold-soft)] transition-colors">Advanced search</Link>
            {' · '}1,200+ residences · 40+ senior advisors
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 mt-auto">
        <div className="container-luxe">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-7 px-6 ${i < stats.length - 1 ? 'border-r' : ''}`}
                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
              >
                <div style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 300,
                  color: 'var(--gold-soft)',
                  lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <p className="mt-1.5 text-white/50 text-[0.65rem] tracking-[0.22em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
