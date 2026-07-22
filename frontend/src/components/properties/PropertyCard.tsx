'use client';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getMediaUrl } from '@/lib/utils';
import type { Property } from '@/types';
import { HiHeart, HiOutlineHeart, HiOutlineArrowUpRight } from 'react-icons/hi2';
import { FaBed, FaBath } from 'react-icons/fa';
import { MdSquareFoot } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { usePropertyListStore } from '@/store/propertyListStore';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const purposeLabel = (p: Property) =>
  p.purpose === 'sale' ? 'For Sale' : p.purpose === 'rent' ? 'For Rent' : 'Off Plan';

export function PropertyCard({ property, className }: PropertyCardProps) {
  const image = property.primary_image || property.featured_image;
  const { isWishlisted, toggleWishlist, isComparing, toggleCompare, compare } = usePropertyListStore();
  const wishlisted = isWishlisted(property.slug);
  const comparing = isComparing(property.slug);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(property.slug);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!comparing && compare.length >= 4) {
      toast.error('You can compare up to 4 properties at a time.');
      return;
    }
    toggleCompare(property.slug);
  };

  return (
    <Link href={`/properties/${property.slug}`} className={cn('group block', className)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--cream-dark)]" style={{ aspectRatio: '4/5' }}>
        <Image
          src={getMediaUrl(image)}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.05) 55%, transparent 100%)' }} />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className="badge-light">{purposeLabel(property)}</span>
          {property.is_featured && (
            <span className="badge-light" style={{ color: 'var(--gold-deep)' }}>Featured</span>
          )}
          {property.is_hot && (
            <span className="inline-flex items-center px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-white" style={{ background: 'var(--gold-deep)' }}>
              Hot
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center border border-white/25 bg-white/10 backdrop-blur-md text-white transition-all duration-300 hover:border-[var(--gold)] hover:bg-white/20"
        >
          {wishlisted
            ? <HiHeart className="h-4 w-4" style={{ color: 'var(--gold-soft)' }} />
            : <HiOutlineHeart className="h-4 w-4" strokeWidth={1.5} />
          }
        </button>

        {/* Arrow on hover */}
        <div className="absolute bottom-16 right-4 h-9 w-9 flex items-center justify-center border border-white/25 bg-white/10 backdrop-blur-md text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          <HiOutlineArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="eyebrow mb-1.5" style={{ color: 'var(--gold-soft)' }}>
            {property.community_name || property.city}
          </p>
          <h3
            className="leading-tight line-clamp-1"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.3rem',
              fontWeight: 300,
            }}
          >
            {property.title}
          </h3>
        </div>
      </div>

      {/* Card footer */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[0.65rem] tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
            <span className="flex items-center gap-1.5">
              <FaBed className="h-3 w-3" />
              {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bed`}
            </span>
            <span className="flex items-center gap-1.5">
              <FaBath className="h-3 w-3" />
              {property.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1.5">
              <MdSquareFoot className="h-3.5 w-3.5" />
              {Number(property.area_sqft).toLocaleString()} sqft
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span
            className="font-semibold text-sm"
            style={{ color: 'var(--ink)' }}
          >
            {formatPrice(property.price, property.currency)}
          </span>
          <label
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 cursor-pointer text-[0.6rem] tracking-wider uppercase"
            style={{ color: 'var(--muted)' }}
          >
            <input
              type="checkbox"
              checked={comparing}
              onClick={handleCompare}
              className="w-3 h-3 cursor-pointer"
              style={{ accentColor: 'var(--gold-deep)' }}
              readOnly
            />
            Compare
          </label>
        </div>
      </div>
    </Link>
  );
}
