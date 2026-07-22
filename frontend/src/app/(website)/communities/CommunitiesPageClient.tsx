'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCommunities } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';

export function CommunitiesPageClient() {
  const { data, isLoading } = useCommunities({ page_size: 50 });

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Explore Dubai</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">Communities.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Discover Dubai&apos;s most sought-after residential communities.</p>
        </div>
      </section>

      <div className="container-luxe py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="animate-pulse aspect-[4/5] bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {(data?.results || []).map((community) => (
              <Link key={community.id} href={`/communities/${community.slug}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                  <Image
                    src={getMediaUrl(community.image)}
                    alt={community.name}
                    fill
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>{community.city}</p>
                    <h3 className="mt-2 serif text-2xl leading-tight">{community.name}</h3>
                  </div>
                </div>
                <div className="pt-5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{community.total_properties} residences</span>
                  <span className="text-xs tracking-[0.15em] uppercase text-gold-deep">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
