'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiViewGrid, HiViewList, HiAdjustments, HiX, HiOutlineMap } from 'react-icons/hi';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import type { PropertyFilters as Filters } from '@/types';

const PropertyMapView = dynamic(
  () => import('@/components/properties/PropertyMapView').then((m) => m.PropertyMapView),
  { ssr: false, loading: () => <div className="h-[600px] bg-background border border-border animate-pulse" /> }
);

export function PropertiesPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const getFiltersFromParams = (): Filters => ({
    purpose: searchParams.get('purpose') || undefined,
    property_type: searchParams.get('property_type') || undefined,
    community: searchParams.get('community') || undefined,
    developer: searchParams.get('developer') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    min_bedrooms: searchParams.get('min_bedrooms') ? Number(searchParams.get('min_bedrooms')) : undefined,
    completion_status: searchParams.get('completion_status') || undefined,
    is_featured: searchParams.get('is_featured') === 'true' ? true : undefined,
    search: searchParams.get('search') || undefined,
    ordering: searchParams.get('ordering') || '-created_at',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  });

  const [filters, setFilters] = useState<Filters>(getFiltersFromParams);
  const { data, isLoading } = useProperties(filters);

  useEffect(() => {
    setFilters(getFiltersFromParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) params.set(k, String(v));
    });
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  };

  const sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Area: Large to Small', value: '-area_sqft' },
    { label: 'Most Viewed', value: '-views_count' },
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>The Collection</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">
            Every residence, <em className="not-italic" style={{ color: 'var(--gold-soft)' }}>considered.</em>
          </h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">
            {data?.count ? `${data.count.toLocaleString()} active listings across Dubai's most desirable addresses.` : 'Searching...'} Filter by status, typology or community.
          </p>
        </div>
      </section>

      {/* Sticky toolbar */}
      <section className="sticky top-[68px] z-30 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container-luxe py-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-ink hover:text-gold transition-colors"
            >
              <HiAdjustments className="w-4 h-4" /> Filters
            </button>
            <span className="text-xs tracking-[0.24em] uppercase text-muted-foreground">
              {data?.count || 0} {data?.count === 1 ? 'residence' : 'residences'} shown
            </span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filters.ordering || '-created_at'}
              onChange={(e) => updateFilters({ ordering: e.target.value })}
              className="text-sm border border-border bg-transparent px-3 py-2.5 focus:outline-none focus:border-gold"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex items-center border border-border">
              <button onClick={() => setView('grid')} className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-ink text-white' : 'text-muted-foreground hover:text-ink'}`}>
                <HiViewGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2.5 transition-colors ${view === 'list' ? 'bg-ink text-white' : 'text-muted-foreground hover:text-ink'}`}>
                <HiViewList className="w-4 h-4" />
              </button>
              <button onClick={() => setView('map')} className={`p-2.5 transition-colors ${view === 'map' ? 'bg-ink text-white' : 'text-muted-foreground hover:text-ink'}`}>
                <HiOutlineMap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-luxe py-14">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <PropertyFilters filters={filters} onUpdate={updateFilters} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid gap-x-8 gap-y-16 ${view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-muted" />
                    <div className="pt-5 space-y-2">
                      <div className="h-4 bg-muted w-1/2" />
                      <div className="h-4 bg-muted w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.results.length === 0 ? (
              <div className="text-center py-20">
                <p className="serif text-3xl text-ink/60">No residences match your filters.</p>
                <button
                  onClick={() => updateFilters({ purpose: undefined, property_type: undefined, min_price: undefined, max_price: undefined })}
                  className="btn-gold mt-8"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === 'map' ? (
              <PropertyMapView properties={data?.results || []} />
            ) : (
              <>
                <div className={`grid gap-x-8 gap-y-16 ${view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {data?.results.map((property, i) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {data && data.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16">
                    <button
                      disabled={!data.previous}
                      onClick={() => updateFilters({ page: (filters.page || 1) - 1 })}
                      className="px-4 py-2 border border-border text-sm disabled:opacity-40 hover:border-gold hover:text-gold transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(data.total_pages, 7) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => updateFilters({ page })}
                          className={`w-10 h-10 text-sm border transition-colors ${
                            page === data.current_page ? 'bg-gold text-ink border-gold' : 'border-border hover:border-gold hover:text-gold'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      disabled={!data.next}
                      onClick={() => updateFilters({ page: (filters.page || 1) + 1 })}
                      className="px-4 py-2 border border-border text-sm disabled:opacity-40 hover:border-gold hover:text-gold transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="serif text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <PropertyFilters filters={filters} onUpdate={(f) => { updateFilters(f); setShowFilters(false); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
