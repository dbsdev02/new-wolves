'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiX, HiSearch } from 'react-icons/hi';
import { usePropertyListStore, MAX_COMPARE_ITEMS } from '@/store/propertyListStore';
import { useMultipleProperties, useProperties } from '@/hooks/useProperties';
import { formatPrice, formatBedroomRange, getMediaUrl } from '@/lib/utils';
import { propertyTypeLabel, purposeLabel } from '@/lib/propertyChoices';
import { PropertyCompareIcon } from '@/components/icons/PropertyCompareIcon';
import type { PropertyFilters } from '@/types';

const purposeOptions = [
  { label: 'Buy', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Off Plan', value: 'off_plan' },
];
const bedroomOptions = [0, 1, 2, 3, 4, 5];
const priceOptions = [
  100000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000,
  5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000,
];
const formatPriceOption = (v: number) => v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`;

const ROWS: { label: string; render: (p: ReturnType<typeof useMultipleProperties>['properties'][number]) => React.ReactNode }[] = [
  { label: 'Price', render: (p) => formatPrice(p.price, p.currency) },
  { label: 'Type', render: (p) => (p.property_type || []).map(propertyTypeLabel).join(', ') },
  { label: 'Property Status', render: (p) => purposeLabel(p.purpose) },
  { label: 'Bedrooms', render: (p) => formatBedroomRange(p.min_bedrooms, p.max_bedrooms) },
  { label: 'Bathrooms', render: (p) => p.bathrooms },
  { label: 'Area', render: (p) => `${Number(p.area_sqft).toLocaleString()} sqft` },
  { label: 'Price/sqft', render: (p) => p.price_per_sqft ? formatPrice(p.price_per_sqft, p.currency) : '—' },
  { label: 'Parking', render: (p) => p.parking_spaces },
  { label: 'Furnishing', render: (p) => p.furnishing || '—' },
  { label: 'Community', render: (p) => p.community_name || '—' },
  { label: 'Developer', render: (p) => p.developer_name || '—' },
  { label: 'Completion', render: (p) => p.completion_status },
];

export function ComparePageClient() {
  const { compare, toggleCompare, isComparing, removeFromCompare, clearCompare } = usePropertyListStore();
  const { properties, isLoading } = useMultipleProperties(compare);

  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState('');
  const [minBeds, setMinBeds] = useState('');
  const [maxBeds, setMaxBeds] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const hasActiveSearch = debouncedQuery.length > 1 || !!purpose || minBeds !== '' || maxBeds !== '' || minPrice !== '' || maxPrice !== '';

  const searchFilters: PropertyFilters = {
    page_size: 8,
    ...(debouncedQuery.length > 1 ? { search: debouncedQuery } : {}),
    ...(purpose ? { purpose } : {}),
    ...(minBeds !== '' ? { min_bedrooms: Number(minBeds) } : {}),
    ...(maxBeds !== '' ? { max_bedrooms: Number(maxBeds) } : {}),
    ...(minPrice !== '' ? { min_price: Number(minPrice) } : {}),
    ...(maxPrice !== '' ? { max_price: Number(maxPrice) } : {}),
  };

  const { data: searchResults, isLoading: searching } = useProperties(searchFilters, { enabled: hasActiveSearch });

  const clearSearchFilters = () => {
    setQuery(''); setPurpose(''); setMinBeds(''); setMaxBeds(''); setMinPrice(''); setMaxPrice('');
  };

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Side by Side</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02]">Compare Properties</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Compare up to 4 properties to find your perfect match.</p>
        </div>
      </section>

      <div className="container-luxe py-20">
        {/* Search & filter to add properties */}
        <div className="max-w-3xl mx-auto mb-16 border border-border p-6 bg-white">
          <div className="relative mb-5">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a property to add to comparison…"
              className="w-full pl-11 pr-4 py-3.5 border border-border bg-background text-sm tracking-wide focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Purpose */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setPurpose('')}
              className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${!purpose ? 'bg-ink text-white border-ink' : 'border-border text-muted-foreground hover:border-gold'}`}
            >
              All
            </button>
            {purposeOptions.map((p) => (
              <button
                key={p.value}
                onClick={() => setPurpose(p.value)}
                className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${purpose === p.value ? 'bg-ink text-white border-ink' : 'border-border text-muted-foreground hover:border-gold'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Beds */}
            <div>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-2">Beds</p>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold appearance-none"
                >
                  <option value="">Min</option>
                  {bedroomOptions.map((b) => (
                    <option key={b} value={b}>{b === 0 ? 'Studio' : b}</option>
                  ))}
                </select>
                <select
                  value={maxBeds}
                  onChange={(e) => setMaxBeds(e.target.value)}
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold appearance-none"
                >
                  <option value="">Max</option>
                  {bedroomOptions.map((b) => (
                    <option key={b} value={b}>{b === 0 ? 'Studio' : b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-2">Price Range (AED)</p>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={minPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMinPrice(val);
                    if (val && maxPrice && Number(maxPrice) < Number(val)) setMaxPrice(val);
                  }}
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold appearance-none"
                >
                  <option value="">Min Price</option>
                  {priceOptions.map((v) => (
                    <option key={v} value={v}>{formatPriceOption(v)}</option>
                  ))}
                </select>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold appearance-none"
                >
                  <option value="">Max Price</option>
                  {priceOptions
                    .filter((v) => !minPrice || v >= Number(minPrice))
                    .map((v) => (
                      <option key={v} value={v}>{formatPriceOption(v)}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {hasActiveSearch && (
            <button onClick={clearSearchFilters} className="mt-5 text-xs text-muted-foreground hover:text-gold-deep transition-colors">
              Clear search filters
            </button>
          )}

          {/* Results */}
          {hasActiveSearch && (
            <div className="mt-6 border-t border-border pt-4 max-h-96 overflow-y-auto">
              {searching ? (
                <p className="p-4 text-sm text-muted-foreground">Searching…</p>
              ) : searchResults?.results.length ? (
                searchResults.results.map((p) => {
                  const already = isComparing(p.slug);
                  const full = compare.length >= MAX_COMPARE_ITEMS && !already;
                  return (
                    <button
                      key={p.id}
                      disabled={full}
                      onClick={() => toggleCompare(p.slug)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-luxury-light transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed border-b border-border last:border-0"
                    >
                      <div className="relative w-14 h-10 flex-shrink-0 overflow-hidden bg-muted">
                        <Image src={getMediaUrl(p.primary_image || p.featured_image)} alt={p.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-ink truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(p.price, p.currency)}</p>
                      </div>
                      <span className="text-xs text-gold-deep flex-shrink-0 uppercase tracking-wider">{already ? 'Added' : full ? 'Full' : 'Add'}</span>
                    </button>
                  );
                })
              ) : (
                <p className="p-4 text-sm text-muted-foreground">No properties found.</p>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <PropertyCompareIcon className="w-16 h-16 text-muted-foreground mx-auto mb-6" strokeWidth={3} />
            <p className="text-muted-foreground mb-8">No properties selected for comparison yet. Add properties from the listing page.</p>
            <Link href="/properties" className="btn-gold">Browse Properties</Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={clearCompare} className="text-sm text-gray-500 hover:text-gold transition-colors">
                Clear All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="text-left p-4 w-40 text-gray-400 text-sm font-medium">Property</th>
                    {properties.map((p) => (
                      <th key={p.id} className="p-4 bg-white border border-gray-100 min-w-[220px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(p.slug)}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-luxury-black text-white rounded-full flex items-center justify-center hover:bg-gold hover:text-luxury-black transition-colors z-10"
                            aria-label="Remove from comparison"
                          >
                            <HiX className="w-4 h-4" />
                          </button>
                          <Link href={`/properties/${p.slug}`} className="block">
                            <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden">
                              <Image src={getMediaUrl(p.primary_image || p.featured_image)} alt={p.title} fill className="object-cover" />
                            </div>
                            <h3 className="font-semibold text-sm text-luxury-black line-clamp-2 hover:text-gold transition-colors">{p.title}</h3>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label}>
                      <td className="p-4 text-sm font-medium text-gray-500 bg-luxury-light">{row.label}</td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 border border-gray-100 bg-white text-sm text-center capitalize">
                          {row.render(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
