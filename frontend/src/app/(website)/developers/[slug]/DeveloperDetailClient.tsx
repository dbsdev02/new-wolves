'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useDeveloper } from '@/hooks/useContent';
import { useProperties } from '@/hooks/useProperties';
import { getMediaUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';

interface Props { slug: string }

export function DeveloperDetailClient({ slug }: Props) {
  const { data: developer, isLoading } = useDeveloper(slug);
  const { data: properties } = useProperties({ developer: slug, page_size: 6 });

  if (isLoading) return (
    <div className="min-h-screen pt-32 bg-background">
      <div className="container-luxe py-12 animate-pulse space-y-6">
        <div className="aspect-[21/9] bg-muted" />
        <div className="h-8 bg-muted w-1/2" />
      </div>
    </div>
  );

  if (!developer) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="serif text-4xl text-ink mb-6">Developer not found</h2>
        <Link href="/developers" className="btn-gold">Browse developers</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-ink text-white overflow-hidden">
        {developer.cover_image && (
          <>
            <img src={getMediaUrl(developer.cover_image)} alt={developer.name} className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
          </>
        )}
        <div className="relative container-luxe">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {developer.logo && (
              <div className="relative w-32 h-20 bg-white p-3 flex-shrink-0">
                <Image src={getMediaUrl(developer.logo)} alt={developer.name} fill className="object-contain p-2" />
              </div>
            )}
            <div>
              <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>{developer.founded_year ? `Est. ${developer.founded_year}` : 'Developer Profile'}</p>
              <h1 className="mt-3 serif text-4xl md:text-6xl leading-[1.02]">{developer.name}</h1>
              <div className="flex flex-wrap gap-8 mt-6">
                <div>
                  <div className="serif text-3xl" style={{ color: 'var(--gold-soft)' }}>{developer.total_projects}</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">Projects</div>
                </div>
                <div>
                  <div className="serif text-3xl" style={{ color: 'var(--gold-soft)' }}>{developer.total_units.toLocaleString()}</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">Units</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {developer.description && (
              <div>
                <p className="eyebrow">About</p>
                <h2 className="mt-4 serif text-2xl text-ink mb-4">{developer.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{developer.description}</p>
              </div>
            )}

            {properties && properties.results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <p className="eyebrow">Portfolio</p>
                  <Link href={`/properties?developer=${slug}`} className="link-underline text-xs tracking-[0.2em] uppercase text-ink">View all →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
                  {properties.results.slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="border border-border p-6">
              <p className="eyebrow mb-4">Developer Info</p>
              <div className="space-y-3 text-sm">
                {developer.headquarters && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Headquarters</span><span className="font-medium text-ink">{developer.headquarters}</span></div>
                )}
                {developer.founded_year && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Founded</span><span className="font-medium text-ink">{developer.founded_year}</span></div>
                )}
                {developer.website && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Website</span><a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-gold-deep hover:underline">Visit →</a></div>
                )}
              </div>
            </div>
            <Link href={`/properties?developer=${slug}`} className="btn-gold w-full justify-center">View all properties</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
