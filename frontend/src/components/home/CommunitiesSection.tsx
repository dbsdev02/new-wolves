'use client';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { useCommunities } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';

export function CommunitiesSection() {
  const { data, isLoading } = useCommunities({ page_size: 20 });
  const communities = data?.results || [];

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

        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse" style={{ background: 'var(--cream-dark)' }} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {communities.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                href={`/properties?community=${c.slug}`}
                className="group relative overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                <Image
                  src={getMediaUrl(c.image)}
                  alt={c.name}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,2,25,0.75) 0%, rgba(0,2,25,0.1) 60%, transparent 100%)' }} />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <p className="eyebrow mb-1.5" style={{ color: 'var(--gold-soft)' }}>
                    {c.total_properties} residences
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '1.25rem',
                    fontWeight: 300,
                    lineHeight: 1.1,
                  }}>
                    {c.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {communities.length > 8 && (
          <div className="mt-10 text-center">
            <Link href="/communities" className="btn-gold">
              View All Communities
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
