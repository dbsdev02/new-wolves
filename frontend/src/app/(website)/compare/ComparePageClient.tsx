'use client';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineScale, HiX } from 'react-icons/hi';
import { usePropertyListStore } from '@/store/propertyListStore';
import { useMultipleProperties } from '@/hooks/useProperties';
import { formatPrice, getMediaUrl } from '@/lib/utils';

const ROWS: { label: string; render: (p: ReturnType<typeof useMultipleProperties>['properties'][number]) => React.ReactNode }[] = [
  { label: 'Price', render: (p) => formatPrice(p.price, p.currency) },
  { label: 'Type', render: (p) => p.property_type },
  { label: 'Purpose', render: (p) => p.purpose === 'sale' ? 'For Sale' : p.purpose === 'rent' ? 'For Rent' : 'Off Plan' },
  { label: 'Bedrooms', render: (p) => p.bedrooms === 0 ? 'Studio' : p.bedrooms },
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
  const { compare, removeFromCompare, clearCompare } = usePropertyListStore();
  const { properties, isLoading } = useMultipleProperties(compare);

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
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineScale className="w-16 h-16 text-muted-foreground mx-auto mb-6" strokeWidth={1} />
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
