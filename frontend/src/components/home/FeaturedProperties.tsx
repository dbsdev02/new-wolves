'use client';
import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/properties/PropertyCard';

const dealTabs = [
  { label: 'For Sale', value: 'sale' },
  { label: 'For Rent', value: 'rent' },
  { label: 'Off Plan', value: 'off_plan' },
] as const;

export function FeaturedProperties() {
  const [tab, setTab] = useState<(typeof dealTabs)[number]['value']>('sale');
  const { data, isLoading } = useProperties({ is_featured: true, purpose: tab, page_size: 6 });
  const properties = data?.results || [];

  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--white)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="section-header">
          <div>
            <p className="eyebrow">The Collection</p>
            <h2 className="section-heading mt-4">
              Explore property<br />in Dubai.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-1.5">
              {dealTabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={`tab-pill ${tab === t.value ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Link
              href={`/properties?purpose=${tab}&is_featured=true`}
              className="link-underline flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              View all <HiOutlineArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5]" style={{ background: 'var(--cream-dark)' }} />
                <div className="pt-5 space-y-2">
                  <div className="h-3 w-1/2 rounded" style={{ background: 'var(--cream-dark)' }} />
                  <div className="h-3 w-1/3 rounded" style={{ background: 'var(--cream-dark)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-20 text-center">
            <p style={{ color: 'var(--muted)' }} className="text-sm tracking-wide">No featured listings for this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && properties.length > 0 && (
          <div className="mt-16 text-center">
            <Link href={`/properties?purpose=${tab}`} className="btn-outline">
              Browse all {tab === 'sale' ? 'sale' : tab === 'rent' ? 'rental' : 'off-plan'} properties
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
