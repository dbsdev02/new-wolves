'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useDevelopers } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';

export function DevelopersPageClient() {
  const { data, isLoading } = useDevelopers({ page_size: 50 });

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Trusted Partners</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">Top developers.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Explore properties from Dubai&apos;s most prestigious developers.</p>
        </div>
      </section>

      <div className="container-luxe py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="animate-pulse aspect-[4/3] bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.results || []).map((developer) => (
              <Link
                key={developer.id}
                href={`/developers/${developer.slug}`}
                className="group block border border-border p-8 hover:border-gold transition-colors duration-300"
              >
                {developer.logo ? (
                  <div className="relative h-20 mb-6">
                    <Image src={getMediaUrl(developer.logo)} alt={developer.name} fill className="object-contain object-left grayscale group-hover:grayscale-0 transition-all duration-300" sizes="200px" />
                  </div>
                ) : (
                  <div className="h-20 flex items-center mb-6">
                    <span className="serif text-2xl text-ink group-hover:text-gold-deep transition-colors">{developer.name}</span>
                  </div>
                )}
                {developer.short_description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{developer.short_description}</p>
                )}
                <div className="flex items-center justify-between text-xs tracking-[0.15em] uppercase pt-4 border-t border-border">
                  <span className="text-muted-foreground">{developer.total_projects} Projects</span>
                  <span className="text-gold-deep">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
