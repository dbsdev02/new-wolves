'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useProperty, useSimilarProperties } from '@/hooks/useProperties';
import { formatPrice, formatArea, formatBedroomRange, getMediaUrl, buildWhatsAppUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { InquiryForm } from '@/components/properties/InquiryForm';
import { PropertyMortgageWidget } from '@/components/properties/PropertyMortgageWidget';
import {
  HiLocationMarker, HiPhone, HiMail, HiShare, HiArrowLeft, HiX,
  HiChevronLeft, HiChevronRight, HiOutlinePhotograph, HiOutlineDocumentDownload,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import { MdBathtub, MdSquareFoot, MdVerified } from 'react-icons/md';
import { FaWhatsapp, FaBed } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SinglePropertyMap = dynamic(
  () => import('@/components/properties/SinglePropertyMap').then((m) => m.SinglePropertyMap),
  { ssr: false, loading: () => <div className="h-[420px] bg-muted animate-pulse" /> }
);

interface Props { slug: string; }

const PURPOSE_LABEL: Record<string, string> = { sale: 'For Sale', rent: 'For Rent', off_plan: 'Off Plan' };
const COMPLETION_LABEL: Record<string, string> = { ready: 'Ready', off_plan: 'Off-Plan', under_construction: 'Under Construction' };

const LOCATION_TABS = [
  { key: 'map', label: 'Map' },
  { key: 'school', label: 'Schools' },
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'hospital', label: 'Hospitals' },
] as const;

export function PropertyDetailClient({ slug }: Props) {
  const { data: property, isLoading } = useProperty(slug);
  const { data: similar } = useSimilarProperties(slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [locationTab, setLocationTab] = useState<typeof LOCATION_TABS[number]['key']>('map');

  if (isLoading) return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-luxe py-8">
        <div className="animate-pulse space-y-6">
          <div className="aspect-[16/9] bg-muted" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="h-8 bg-muted w-3/4" />
              <div className="h-4 bg-muted w-1/2" />
            </div>
            <div className="h-64 bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="serif text-4xl text-ink mb-6">Residence not found</h2>
        <Link href="/properties" className="btn-gold">Back to collection</Link>
      </div>
    </div>
  );

  const allImages = [
    ...(property.featured_image ? [{ image: property.featured_image, caption: property.title }] : []),
    ...property.images,
  ];

  const whatsappMsg = `Hi, I'm interested in ${property.title} (Ref: ${property.reference_number}). Please share more details.`;
  const bedroomLabel = formatBedroomRange(property.min_bedrooms, property.max_bedrooms);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: property.title, url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const openLightbox = (i: number) => { setActiveImage(i); setLightboxOpen(true); };
  const nextImage = () => setActiveImage((i) => (i + 1) % allImages.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + allImages.length) % allImages.length);

  const keyInfo = [
    { label: 'Property Type', value: property.property_type?.replace('_', ' ') },
    { label: 'Purpose', value: PURPOSE_LABEL[property.purpose] || property.purpose },
    { label: 'Completion', value: COMPLETION_LABEL[property.completion_status] || property.completion_status },
    { label: 'Furnishing Type', value: property.furnishing ? property.furnishing.replace('_', ' ') : 'Not specified' },
    { label: 'Property ID', value: property.reference_number },
  ];

  const truncatedDescription = property.description.length > 420 && !descExpanded
    ? `${property.description.slice(0, 420)}...`
    : property.description;

  const tabPlaces = property.nearby_places.filter((p) => p.category === locationTab);

  return (
    <div className="bg-background pt-20">
      {/* Breadcrumb */}
      <div className="container-luxe py-4 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <Link href="/properties" className="flex items-center gap-1.5 hover:text-gold-deep transition-colors">
          <HiArrowLeft className="h-3 w-3" /> Back to Listings
        </Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-gold-deep transition-colors">Properties</Link>
        {property.community_name && (
          <>
            <span>/</span>
            <span>{property.community_name}</span>
          </>
        )}
        <span>/</span>
        <span className="text-ink line-clamp-1">{property.title}</span>
      </div>

      {/* Gallery */}
      <div className="container-luxe">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[280px] md:h-[480px]">
          <button onClick={() => openLightbox(0)} className="relative md:col-span-2 h-full overflow-hidden bg-muted">
            {allImages[0] && (
              <Image src={getMediaUrl(allImages[0].image)} alt={property.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 66vw" />
            )}

            {allImages.length > 0 && (
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-medium text-ink shadow">
                <HiOutlinePhotograph className="h-4 w-4" /> {allImages.length} Photos
              </span>
            )}
            <span
              onClick={(e) => { e.stopPropagation(); document.getElementById('property-location')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-medium text-ink shadow"
            >
              <HiLocationMarker className="h-4 w-4" style={{ color: 'var(--gold-deep)' }} /> Location
            </span>
            <span
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-medium text-ink shadow"
            >
              <HiShare className="h-4 w-4" /> Share
            </span>
          </button>

          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            {[1, 2].map((i) => (
              <button key={i} onClick={() => openLightbox(i)} className="relative overflow-hidden bg-muted">
                {allImages[i] ? (
                  <Image src={getMediaUrl(allImages[i].image)} alt={`${property.title} ${i}`} fill className="object-cover" sizes="33vw" />
                ) : allImages[0] ? (
                  <Image src={getMediaUrl(allImages[0].image)} alt={property.title} fill className="object-cover" sizes="33vw" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price / Title / Tags */}
      <div className="container-luxe pt-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="serif text-3xl md:text-4xl text-ink">
              {formatPrice(property.price, property.currency)}
            </p>
            <button
              onClick={() => document.getElementById('mortgage-calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs text-gold-deep hover:underline mt-1"
            >
              Calculate your mortgage repayments
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap text-xs tracking-wider uppercase text-muted-foreground">
          <span>{property.property_type}</span>
          <span>|</span>
          <span>{PURPOSE_LABEL[property.purpose] || property.purpose}</span>
          <span>|</span>
          <span>{COMPLETION_LABEL[property.completion_status] || property.completion_status}</span>
        </div>

        <h1 className="mt-3 serif text-2xl md:text-3xl text-ink leading-tight">{property.title}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <HiLocationMarker className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gold-deep)' }} />
          {property.address}
        </p>

        <div className="mt-5 flex items-center gap-6 text-sm text-ink">
          <span className="flex items-center gap-2">
            <FaBed className="h-4 w-4" style={{ color: 'var(--gold-deep)' }} />
            {bedroomLabel === 'Studio' ? bedroomLabel : `${bedroomLabel} Beds`}
          </span>
          <span className="flex items-center gap-2">
            <MdBathtub className="h-4 w-4" style={{ color: 'var(--gold-deep)' }} />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-2">
            <MdSquareFoot className="h-4 w-4" style={{ color: 'var(--gold-deep)' }} />
            {formatArea(property.area_sqft)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="container-luxe py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main content */}
          <div className="lg:col-span-7 space-y-12">
            {/* Key Information */}
            <div>
              <h2 className="serif text-2xl text-ink mb-6">Key Information</h2>
              <dl className="grid grid-cols-2 gap-y-5 border-t border-border pt-6">
                {keyInfo.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs tracking-wider uppercase text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink capitalize">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Description */}
            <div>
              <h2 className="serif text-2xl text-ink mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{truncatedDescription}</p>
              {property.description.length > 420 && (
                <button onClick={() => setDescExpanded((v) => !v)} className="mt-2 text-sm text-gold-deep hover:underline">
                  {descExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="serif text-2xl text-ink mb-6">Amenities</h2>
                <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {property.amenities.map((amenity) => (
                    <li key={amenity.id} className="flex items-center gap-2.5 text-ink">
                      <MdVerified className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gold-deep)' }} />
                      <span className="text-sm">{amenity.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Floor Plans (if any) */}
            {property.floor_plans.length > 0 && (
              <div>
                <h2 className="serif text-2xl text-ink mb-6">Floor Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.floor_plans.map((fp) => (
                    <div key={fp.id} className="border border-border">
                      {fp.image ? (
                        <div className="relative aspect-[4/3]">
                          <Image src={getMediaUrl(fp.image)} alt={fp.title} fill className="object-contain" />
                        </div>
                      ) : fp.pdf ? (
                        <div className="aspect-[4/3] flex items-center justify-center bg-cream">
                          <HiOutlineDocumentText className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
                        </div>
                      ) : null}
                      <div className="p-4">
                        <h4 className="font-semibold text-ink">{fp.title}</h4>
                        {fp.area_sqft && <p className="text-sm text-muted-foreground">{formatArea(fp.area_sqft)}</p>}
                        {fp.pdf && (
                          <a
                            href={getMediaUrl(fp.pdf)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm text-gold-deep hover:underline"
                          >
                            <HiOutlineDocumentDownload className="h-4 w-4" /> Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Plan (if any) */}
            {property.payment_plans.length > 0 && (
              <div>
                <h2 className="serif text-2xl text-ink mb-6">Payment Plan</h2>
                <div className="space-y-3">
                  {property.payment_plans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 bg-cream border-l-2" style={{ borderColor: 'var(--gold)' }}>
                      <div>
                        <div className="font-semibold text-ink">{plan.title}</div>
                        <div className="text-sm text-muted-foreground">{plan.milestone}</div>
                      </div>
                      <div className="text-gold-deep font-bold text-xl">{plan.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage Calculator */}
            <div id="mortgage-calculator">
              <h2 className="serif text-2xl text-ink mb-6">Calculate Mortgage Repayments</h2>
              <PropertyMortgageWidget price={property.price} currency={property.currency} />
            </div>

            {/* Location */}
            {((property.latitude && property.longitude) || property.google_maps_url) && (
              <div id="property-location">
                <h2 className="serif text-2xl text-ink mb-6">Location</h2>
                <div className="flex gap-6 border-b border-border mb-6">
                  {LOCATION_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setLocationTab(tab.key)}
                      className={`pb-3 text-xs tracking-[0.15em] uppercase transition-colors border-b-2 ${
                        locationTab === tab.key ? 'text-gold-deep border-gold' : 'text-muted-foreground border-transparent hover:text-ink'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {locationTab === 'map' ? (
                  property.latitude && property.longitude ? (
                    <SinglePropertyMap latitude={Number(property.latitude)} longitude={Number(property.longitude)} />
                  ) : property.google_maps_url ? (
                    <iframe
                      src={`${property.google_maps_url}${property.google_maps_url.includes('?') ? '&' : '?'}output=embed`}
                      className="w-full h-[420px] border border-border"
                      loading="lazy"
                      title="Property location"
                    />
                  ) : null
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tabPlaces.map((place) => (
                      <div key={place.id} className="flex items-center justify-between p-3 bg-cream">
                        <div className="text-sm font-medium text-ink">{place.name}</div>
                        <div className="text-right">
                          <div className="text-gold-deep font-semibold text-sm">{place.distance_km} km</div>
                          {place.duration_minutes && <div className="text-xs text-muted-foreground">{place.duration_minutes} min</div>}
                        </div>
                      </div>
                    ))}
                    {tabPlaces.length === 0 && <p className="text-muted-foreground text-sm col-span-2">No nearby {LOCATION_TABS.find(t => t.key === locationTab)?.label.toLowerCase()} listed.</p>}
                  </div>
                )}
              </div>
            )}

            {/* DLD Permit */}
            {property.dld_permit_number && (
              <div className="border-t border-border pt-6">
                <p className="text-xs tracking-wider uppercase text-muted-foreground">DLD Permit Number</p>
                <p className="mt-1 text-sm font-medium text-ink">{property.dld_permit_number}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Call / WhatsApp */}
              {property.agent_data && (
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${property.agent_data.phone}`} className="flex items-center justify-center gap-2 py-3.5 text-white text-sm font-medium" style={{ background: 'var(--gold-deep)' }}>
                    <HiPhone className="w-4 h-4" /> Call
                  </a>
                  <a
                    href={buildWhatsAppUrl(property.agent_data.whatsapp || property.agent_data.phone, whatsappMsg)}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <FaWhatsapp className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              )}

              {/* Agent Card */}
              {property.agent_data && (
                <div className="border border-border p-6">
                  <div className="flex items-center gap-4">
                    {property.agent_data.photo ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={getMediaUrl(property.agent_data.photo)} alt={property.agent_data.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{property.agent_data.name[0]}</span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-ink">{property.agent_data.name}</div>
                      <div className="text-sm text-muted-foreground">{property.agent_data.designation}</div>
                      {property.agent_data.rera_number && (
                        <div className="text-xs text-muted-foreground mt-0.5">BRN No: {property.agent_data.rera_number}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
                    <a href={`mailto:${property.agent_data.email}`} className="flex items-center gap-1.5 hover:text-gold-deep transition-colors">
                      <HiMail className="w-3.5 h-3.5" /> Email
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <div className="border border-border p-6">
                <InquiryForm propertyId={property.id} propertyTitle={property.title} variant="light" />
                <p className="mt-3 text-[0.65rem] text-muted-foreground leading-relaxed">
                  By clicking Submit, you agree to our Terms &amp; Conditions and Privacy Policy.
                </p>
              </div>

              {/* Promo banner */}
              <Link
                href="/projects"
                className="relative block aspect-[4/3] overflow-hidden group"
              >
                <Image src="/images/marketing/hero-dubai.jpg" alt="Off-plan projects" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="serif text-lg leading-snug">Discover our Off-Plan Projects in Dubai</p>
                  <span className="mt-3 inline-block btn-gold text-xs">View Projects</span>
                </div>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Related */}
      {similar && similar.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="container-luxe">
            <p className="eyebrow">Also consider</p>
            <h2 className="mt-4 serif text-3xl md:text-5xl text-ink">Recommended for you</h2>
            <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {similar.slice(0, 3).map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white z-10">
            <HiX className="h-8 w-8" />
          </button>
          <button onClick={prevImage} className="absolute left-4 md:left-8 text-white/60 hover:text-white z-10">
            <HiChevronLeft className="h-10 w-10" />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto my-auto">
            <Image
              src={getMediaUrl(allImages[activeImage].image)}
              alt={`${property.title} ${activeImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button onClick={nextImage} className="absolute right-4 md:right-8 text-white/60 hover:text-white z-10">
            <HiChevronRight className="h-10 w-10" />
          </button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {activeImage + 1} / {allImages.length}
          </span>
        </div>
      )}
    </div>
  );
}
