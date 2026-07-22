'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProperty, useSimilarProperties } from '@/hooks/useProperties';
import { formatPrice, formatArea, getMediaUrl, buildWhatsAppUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { InquiryForm } from '@/components/properties/InquiryForm';
import { HiLocationMarker, HiPhone, HiMail, HiDownload, HiShare, HiCalendar, HiArrowLeft } from 'react-icons/hi';
import { MdBathtub, MdSquareFoot, MdDirectionsCar, MdVerified } from 'react-icons/md';
import { FaWhatsapp, FaBed } from 'react-icons/fa';

interface Props { slug: string; }

export function PropertyDetailClient({ slug }: Props) {
  const { data: property, isLoading } = useProperty(slug);
  const { data: similar } = useSimilarProperties(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'floorplan' | 'payment' | 'nearby'>('overview');

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

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        {allImages[activeImage] && (
          <Image
            src={getMediaUrl(allImages[activeImage].image)}
            alt={property.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
        <div className="relative z-10 container-luxe h-full flex flex-col justify-between pt-32 pb-16 text-white">
          <Link href="/properties" className="inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase w-fit link-underline text-white/80">
            <HiArrowLeft className="h-3.5 w-3.5" /> Back to collection
          </Link>
          <div className="max-w-3xl">
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>
              {property.community_name || property.address} · {property.purpose === 'sale' ? 'For Sale' : property.purpose === 'rent' ? 'For Rent' : 'Off Plan'}
            </p>
            <h1 className="mt-6 serif text-4xl md:text-7xl leading-[1.02]">{property.title}</h1>
            <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/60">Ref: {property.reference_number}</p>
            <p className="mt-8 serif text-3xl md:text-4xl" style={{ color: 'var(--gold-soft)' }}>
              {formatPrice(property.price, property.currency)}
              {property.price_per_sqft && <span className="text-lg text-white/60 ml-3">{formatPrice(property.price_per_sqft, property.currency)}/sqft</span>}
            </p>
          </div>
        </div>
      </section>

      {/* KEY STATS */}
      <section className="border-b border-border">
        <div className="container-luxe grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { icon: FaBed, label: 'Bedrooms', value: property.bedrooms === 0 ? 'Studio' : property.bedrooms },
            { icon: MdBathtub, label: 'Bathrooms', value: property.bathrooms },
            { icon: MdSquareFoot, label: 'Built-up', value: formatArea(property.area_sqft) },
            { icon: MdDirectionsCar, label: 'Parking', value: property.parking_spaces },
          ].map((s) => (
            <div key={s.label} className="px-4 md:px-6 py-8">
              <s.icon className="h-4 w-4 mb-4" strokeWidth={1.5} style={{ color: 'var(--gold-deep)' }} />
              <p className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">{s.label}</p>
              <p className="mt-1.5 serif text-xl text-ink">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY THUMBNAILS */}
      {allImages.length > 1 && (
        <section className="py-8">
          <div className="container-luxe grid grid-cols-4 md:grid-cols-6 gap-3">
            {allImages.slice(0, 6).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square overflow-hidden ${activeImage === i ? 'ring-2 ring-gold' : ''}`}
              >
                <Image src={getMediaUrl(img.image)} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="150px" />
                {i === 5 && allImages.length > 6 && (
                  <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">+{allImages.length - 6}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="container-luxe pb-20">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-16">
            {/* Tabs */}
            <div>
              <div className="flex overflow-x-auto border-b border-border gap-8">
                {(['overview', 'amenities', 'floorplan', 'payment', 'nearby'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab ? 'text-gold-deep border-gold' : 'text-muted-foreground border-transparent hover:text-ink'
                    }`}
                  >
                    {tab === 'floorplan' ? 'Floor Plans' : tab === 'payment' ? 'Payment Plan' : tab}
                  </button>
                ))}
              </div>

              <div className="pt-10">
                {activeTab === 'overview' && (
                  <div>
                    <p className="eyebrow">Overview</p>
                    <h2 className="mt-4 serif text-3xl md:text-4xl text-ink leading-tight">An address that speaks for itself.</h2>
                    <p className="mt-8 text-muted-foreground text-lg leading-relaxed font-light">{property.description}</p>
                    <dl className="mt-8 space-y-2 text-sm">
                      {property.furnishing && (
                        <div className="flex gap-2"><dt className="text-muted-foreground">Furnishing:</dt><dd className="text-ink capitalize">{property.furnishing.replace('_', ' ')}</dd></div>
                      )}
                      {property.year_built && (
                        <div className="flex gap-2"><dt className="text-muted-foreground">Year Built:</dt><dd className="text-ink">{property.year_built}</dd></div>
                      )}
                      {property.developer_name && (
                        <div className="flex gap-2"><dt className="text-muted-foreground">Developer:</dt><dd><Link href={`/developers/${property.developer_slug}`} className="text-gold-deep hover:underline">{property.developer_name}</Link></dd></div>
                      )}
                    </dl>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <p className="eyebrow">Amenities</p>
                    <ul className="mt-6 grid sm:grid-cols-2 gap-y-4 gap-x-8">
                      {property.amenities.map((amenity) => (
                        <li key={amenity.id} className="flex items-center gap-3 text-ink">
                          <MdVerified className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gold-deep)' }} />
                          <span className="text-sm">{amenity.name}</span>
                        </li>
                      ))}
                      {property.amenities.length === 0 && <p className="text-muted-foreground text-sm col-span-2">No amenities listed.</p>}
                    </ul>
                  </div>
                )}

                {activeTab === 'floorplan' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property.floor_plans.map((fp) => (
                      <div key={fp.id} className="border border-border">
                        <div className="relative aspect-[4/3]">
                          <Image src={getMediaUrl(fp.image)} alt={fp.title} fill className="object-contain" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-ink">{fp.title}</h4>
                          {fp.area_sqft && <p className="text-sm text-muted-foreground">{formatArea(fp.area_sqft)}</p>}
                        </div>
                      </div>
                    ))}
                    {property.floor_plans.length === 0 && <p className="text-muted-foreground text-sm">No floor plans available.</p>}
                  </div>
                )}

                {activeTab === 'payment' && (
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
                    {property.payment_plans.length === 0 && <p className="text-muted-foreground text-sm">No payment plan available.</p>}
                  </div>
                )}

                {activeTab === 'nearby' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.nearby_places.map((place) => (
                      <div key={place.id} className="flex items-center justify-between p-3 bg-cream">
                        <div>
                          <div className="font-medium text-sm text-ink">{place.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{place.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gold-deep font-semibold text-sm">{place.distance_km} km</div>
                          {place.duration_minutes && <div className="text-xs text-muted-foreground">{place.duration_minutes} min</div>}
                        </div>
                      </div>
                    ))}
                    {property.nearby_places.length === 0 && <p className="text-muted-foreground text-sm">No nearby places listed.</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {property.latitude && property.longitude && (
              <div>
                <p className="eyebrow">Location</p>
                <div className="mt-6 aspect-[16/9] bg-ink/5 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <HiLocationMarker className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-3 serif text-2xl text-ink">{property.community_name || property.address}, Dubai</p>
                    <a
                      href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold mt-6 inline-flex"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            {property.agent_data && (
              <div className="border border-border p-6">
                <div className="flex items-center gap-4 mb-5">
                  {property.agent_data.photo ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={getMediaUrl(property.agent_data.photo)} alt={property.agent_data.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">{property.agent_data.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-ink">{property.agent_data.name}</div>
                    <div className="text-sm text-muted-foreground">{property.agent_data.designation}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href={`tel:${property.agent_data.phone}`} className="flex items-center gap-3 w-full p-3 border border-border hover:border-gold transition-colors text-sm">
                    <HiPhone className="w-4 h-4" style={{ color: 'var(--gold-deep)' }} /> {property.agent_data.phone}
                  </a>
                  <a href={buildWhatsAppUrl(property.agent_data.whatsapp || property.agent_data.phone, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full p-3 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm">
                    <FaWhatsapp className="w-4 h-4" /> WhatsApp
                  </a>
                  <a href={`mailto:${property.agent_data.email}`} className="flex items-center gap-3 w-full p-3 border border-border hover:border-gold transition-colors text-sm">
                    <HiMail className="w-4 h-4" style={{ color: 'var(--gold-deep)' }} /> Send Email
                  </a>
                </div>
              </div>
            )}

            <div className="lg:sticky lg:top-24 bg-ink text-white p-8 md:p-10">
              <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Private inquiry</p>
              <h3 className="mt-4 serif text-3xl leading-tight">Arrange a viewing</h3>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                A senior advisor will respond within the hour, in complete confidence.
              </p>
              <div className="mt-8">
                <InquiryForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>

            <div className="border border-border p-6 space-y-3">
              {property.brochure && (
                <a href={getMediaUrl(property.brochure)} download className="flex items-center gap-3 w-full p-3 border border-border hover:border-gold transition-colors text-sm">
                  <HiDownload className="w-4 h-4" style={{ color: 'var(--gold-deep)' }} /> Download Brochure
                </a>
              )}
              <button
                onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                className="flex items-center gap-3 w-full p-3 border border-border hover:border-gold transition-colors text-sm"
              >
                <HiShare className="w-4 h-4" style={{ color: 'var(--gold-deep)' }} /> Share Property
              </button>
              <Link href={`/contact?type=schedule_visit&property=${property.id}`} className="flex items-center gap-3 w-full p-3 bg-ink text-white hover:bg-ink-soft transition-colors text-sm">
                <HiCalendar className="w-4 h-4" style={{ color: 'var(--gold-soft)' }} /> Schedule a Visit
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* RELATED */}
      {similar && similar.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="container-luxe">
            <p className="eyebrow">Also consider</p>
            <h2 className="mt-4 serif text-3xl md:text-5xl text-ink">Related residences</h2>
            <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {similar.slice(0, 3).map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
