'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiLocationMarker, HiSearch, HiChevronDown } from 'react-icons/hi';

const dealTabs = [
  { label: 'Buy', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Off Plan', value: 'off_plan' },
] as const;

const bedroomOptions = [0, 1, 2, 3, 4, 5];
const bedLabel = (v: number) => (v === 0 ? 'Studio' : v === 5 ? '5+' : `${v}`);

// Same brackets used on the Compare page, for a consistent price vocabulary site-wide.
const priceOptions = [
  100000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000,
  5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000,
];
const formatPriceOption = (v: number) => (v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`);

const stats = [
  { value: '3B+', label: 'AED in sales' },
  { value: '500+', label: 'Team members led' },
  { value: '4', label: 'Countries: UAE, India, UK & Europe' },
  { value: '38+', label: 'Combined years experience' },
];

export function HeroSection() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<(typeof dealTabs)[number]['value']>('sale');
  const [search, setSearch] = useState('');
  const [minBeds, setMinBeds] = useState<number | ''>('');
  const [maxBeds, setMaxBeds] = useState<number | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedsOpen, setBedsOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const bedsRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (bedsRef.current && !bedsRef.current.contains(e.target as Node)) setBedsOpen(false);
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const bedsLabel =
    minBeds === '' && maxBeds === ''
      ? 'Any'
      : minBeds !== '' && maxBeds !== ''
      ? minBeds === maxBeds
        ? bedLabel(minBeds)
        : `${bedLabel(minBeds)} – ${bedLabel(maxBeds)}`
      : minBeds !== ''
      ? `${bedLabel(minBeds)}+`
      : `Up to ${bedLabel(maxBeds as number)}`;

  const priceLabel =
    !minPrice && !maxPrice
      ? 'Any'
      : minPrice && maxPrice
      ? `${formatPriceOption(Number(minPrice))} – ${formatPriceOption(Number(maxPrice))}`
      : minPrice
      ? `${formatPriceOption(Number(minPrice))}+`
      : `Up to ${formatPriceOption(Number(maxPrice))}`;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (search) params.set('search', search);
    if (minBeds !== '') params.set('min_bedrooms', String(minBeds));
    if (maxBeds !== '') params.set('max_bedrooms', String(maxBeds));
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col">
      {/* Background — overflow-hidden lives here, not on the section, so the
          Bedrooms/Price dropdowns below (which can open past the section's
          own bottom edge on short/mobile viewports) never get clipped. */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-dubai-Dc7SIc-2.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/Wolves%20Website%20Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,2,25,0.65) 0%, rgba(0,2,25,0.4) 50%, rgba(0,2,25,0.85) 100%)' }} />
      </div>

      {/* Content — z-20 so the Bedrooms/Price dropdowns (a stacking context is
          created here by z-index) render above the z-10 stats bar below, which
          otherwise paints over them on shorter desktop viewports. */}
      <div className="relative z-20 container-luxe flex flex-col justify-center flex-1 pt-28 pb-0">
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
            <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_170px_auto]">
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

              {/* Bedrooms — min/max dropdown */}
              <div ref={bedsRef} className="relative border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border)' }}>
                <button
                  type="button"
                  onClick={() => { setBedsOpen((o) => !o); setPriceOpen(false); }}
                  className="w-full h-full flex flex-col items-start justify-center px-6 py-4 text-left"
                >
                  <p className="label-luxury mb-1">Bedrooms</p>
                  <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--ink)' }}>
                    {bedsLabel}
                    <HiChevronDown className={`h-3.5 w-3.5 transition-transform ${bedsOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--muted)' }} />
                  </span>
                </button>
                {bedsOpen && (
                  <div className="absolute left-0 top-full mt-2 w-[min(18rem,calc(100vw-2.5rem))] bg-white shadow-2xl border p-5 z-30" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Bedrooms</p>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={minBeds}
                        onChange={(e) => {
                          const v = e.target.value === '' ? '' : Number(e.target.value);
                          setMinBeds(v);
                          if (v !== '' && maxBeds !== '' && maxBeds < v) setMaxBeds(v);
                        }}
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-gold appearance-none"
                        style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                      >
                        <option value="">Min</option>
                        {bedroomOptions.map((b) => (
                          <option key={b} value={b}>{bedLabel(b)}</option>
                        ))}
                      </select>
                      <select
                        value={maxBeds}
                        onChange={(e) => setMaxBeds(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-gold appearance-none"
                        style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                      >
                        <option value="">Max</option>
                        {bedroomOptions.filter((b) => minBeds === '' || b >= minBeds).map((b) => (
                          <option key={b} value={b}>{bedLabel(b)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Price — min/max range */}
              <div ref={priceRef} className="relative border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border)' }}>
                <button
                  type="button"
                  onClick={() => { setPriceOpen((o) => !o); setBedsOpen(false); }}
                  className="w-full h-full flex flex-col items-start justify-center px-6 py-4 text-left"
                >
                  <p className="label-luxury mb-1">Price (AED)</p>
                  <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--ink)' }}>
                    {priceLabel}
                    <HiChevronDown className={`h-3.5 w-3.5 transition-transform ${priceOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--muted)' }} />
                  </span>
                </button>
                {priceOpen && (
                  <div className="absolute left-0 top-full mt-2 w-[min(18rem,calc(100vw-2.5rem))] bg-white shadow-2xl border p-5 z-30" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Price Range (AED)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={minPrice}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMinPrice(v);
                          if (v && maxPrice && Number(maxPrice) < Number(v)) setMaxPrice(v);
                        }}
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-gold appearance-none"
                        style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                      >
                        <option value="">Min</option>
                        {priceOptions.map((v) => (
                          <option key={v} value={v}>{formatPriceOption(v)}</option>
                        ))}
                      </select>
                      <select
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-gold appearance-none"
                        style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                      >
                        <option value="">Max</option>
                        {priceOptions.filter((v) => !minPrice || v >= Number(minPrice)).map((v) => (
                          <option key={v} value={v}>{formatPriceOption(v)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
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
