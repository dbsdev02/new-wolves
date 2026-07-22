'use client';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { useFeaturedCommunities, useCommunities } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';

export function CommunitiesSection() {
  const { data: featured, isLoading } = useFeaturedCommunities();
  const { data: all } = useCommunities({ page_size: 20 });
  const communities = featured || [];
  const allCommunities = all?.results || [];

  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--white)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="section-header">
          <div className="max-w-xl">
            <p className="eyebrow">Neighbourhoods</p>
            <h2 className="section-heading mt-4">
              Dubai&apos;s most sought-after<br />communities.
            </h2>
          </div>
          <Link
            href="/communities"
            className="link-underline flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            All communities <HiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Featured grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3 mb-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse" style={{ background: 'var(--cream-dark)' }} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 mb-16">
            {communities.slice(0, 3).map((c, i) => (
              <Link
                key={c.id}
                href={`/properties?community=${c.slug}`}
                className={`group relative overflow-hidden ${i === 0 ? 'md:row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '3/4' : '4/3' }}
              >
                <Image
                  src={getMediaUrl(c.image)}
                  alt={c.name}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.1) 60%, transparent 100%)' }} />
                <div className="absolute inset-0 flex flex-col justify-end p-7 text-white">
                  <p className="eyebrow mb-2" style={{ color: 'var(--gold-soft)' }}>
                    {c.total_properties} residences
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: i === 0 ? '2rem' : '1.5rem',
                    fontWeight: 300,
                    lineHeight: 1.1,
                  }}>
                    {c.name}
                  </h3>
                  <div
                    className="mt-4 h-px transition-all duration-500 group-hover:w-12"
                    style={{ width: '24px', background: 'var(--gold)' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All communities list */}
        {allCommunities.length > 0 && (
          <div className="pt-10 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="eyebrow mb-8 text-center">All Communities</p>
            <div className="grid gap-x-8 gap-y-0 md:grid-cols-2 lg:grid-cols-4">
              {allCommunities.map((c) => (
                <Link
                  key={c.id}
                  href={`/properties?community=${c.slug}`}
                  className="group flex items-center justify-between py-3.5 border-b text-sm font-medium transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                >
                  <span className="group-hover:text-[var(--gold-deep)] transition-colors">{c.name}</span>
                  <HiArrowRight
                    className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    style={{ color: 'var(--gold)' }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
