'use client';
import Link from 'next/link';
import { useCommunity } from '@/hooks/useContent';
import { useProperties } from '@/hooks/useProperties';
import { getMediaUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { HiLocationMarker } from 'react-icons/hi';
import { MdSchool, MdLocalHospital, MdTrain, MdShoppingCart } from 'react-icons/md';

interface Props { slug: string }

export function CommunityDetailClient({ slug }: Props) {
  const { data: community, isLoading } = useCommunity(slug);
  const { data: properties } = useProperties({ community: slug, page_size: 6 });

  if (isLoading) return (
    <div className="min-h-screen pt-32 bg-background">
      <div className="container-luxe py-12 animate-pulse space-y-6">
        <div className="aspect-[21/9] bg-muted" />
        <div className="h-8 bg-muted w-1/2" />
      </div>
    </div>
  );

  if (!community) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="serif text-4xl text-ink mb-6">Community not found</h2>
        <Link href="/communities" className="btn-gold">Browse communities</Link>
      </div>
    </div>
  );

  const nearbyCategories = [
    { icon: MdSchool, label: 'Schools', data: community.nearby_schools },
    { icon: MdLocalHospital, label: 'Hospitals', data: community.nearby_hospitals },
    { icon: MdTrain, label: 'Metro', data: community.nearby_metro },
    { icon: MdShoppingCart, label: 'Malls', data: community.nearby_malls },
  ].filter(c => c.data);

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative aspect-[21/9] min-h-[400px] overflow-hidden">
        <img src={getMediaUrl(community.cover_image || community.image)} alt={community.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
        <div className="absolute inset-0 flex flex-col justify-end pb-16 pt-32">
          <div className="container-luxe">
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Community</p>
            <h1 className="mt-4 serif text-4xl md:text-6xl text-white">{community.name}</h1>
            <div className="flex items-center gap-2 mt-4 text-white/70">
              <HiLocationMarker className="w-4 h-4" style={{ color: 'var(--gold)' }} />
              <span>{community.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <p className="eyebrow">About</p>
              <h2 className="mt-4 serif text-2xl text-ink mb-4">{community.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{community.description}</p>
            </div>

            {nearbyCategories.length > 0 && (
              <div>
                <p className="eyebrow mb-6">Nearby Places</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nearbyCategories.map(({ icon: Icon, label, data }) => (
                    <div key={label}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5" style={{ color: 'var(--gold-deep)' }} />
                        <h3 className="font-semibold text-ink">{label}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{data}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {properties && properties.results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <p className="eyebrow">Residences in {community.name}</p>
                  <Link href={`/properties?community=${slug}`} className="link-underline text-xs tracking-[0.2em] uppercase text-ink">View all →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
                  {properties.results.slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="border border-border p-6">
              <p className="eyebrow mb-4">Community Stats</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Properties</span><span className="font-semibold text-gold-deep">{community.total_properties}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">City</span><span className="font-semibold text-ink">{community.city}</span></div>
              </div>
            </div>
            <Link href={`/properties?community=${slug}`} className="btn-gold w-full justify-center">View all properties</Link>
            <Link href="/contact" className="btn-outline-gold w-full justify-center">Get expert advice</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
