'use client';
import Link from 'next/link';
import { HiOutlineHeart } from 'react-icons/hi';
import { usePropertyListStore } from '@/store/propertyListStore';
import { useMultipleProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/properties/PropertyCard';

export function WishlistPageClient() {
  const { wishlist } = usePropertyListStore();
  const { properties, isLoading } = useMultipleProperties(wishlist);

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Saved Residences</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02]">My Wishlist</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">
            {wishlist.length > 0 ? `${wishlist.length} propert${wishlist.length === 1 ? 'y' : 'ies'} saved` : 'You have not saved any properties yet.'}
          </p>
        </div>
      </section>

      <div className="container-luxe py-20">
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading your saved properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineHeart className="w-16 h-16 text-muted-foreground mx-auto mb-6" strokeWidth={1} />
            <p className="text-muted-foreground mb-8">Your wishlist is empty. Start exploring properties and save your favorites.</p>
            <Link href="/properties" className="btn-gold">Browse Properties</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
