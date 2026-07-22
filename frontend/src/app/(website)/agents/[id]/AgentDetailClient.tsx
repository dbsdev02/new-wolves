'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAgent } from '@/hooks/useContent';
import { useProperties } from '@/hooks/useProperties';
import { getMediaUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { HiPhone, HiMail, HiStar } from 'react-icons/hi';
import { FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa';

interface Props { id: number }

export function AgentDetailClient({ id }: Props) {
  const { data: agent, isLoading } = useAgent(id);
  const { data: properties } = useProperties({ agent: id, page_size: 6, status: 'published' } as any);

  if (isLoading) return (
    <div className="min-h-screen pt-32 bg-background">
      <div className="container-luxe py-12 animate-pulse">
        <div className="flex gap-8">
          <div className="w-48 h-48 rounded-full bg-muted" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-muted w-1/3" />
            <div className="h-4 bg-muted w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!agent) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="serif text-4xl text-ink mb-6">Agent not found</h2>
        <Link href="/agents" className="btn-gold">View all agents</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-background">
      <section className="pt-40 pb-16 bg-ink text-white">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-40 h-40 overflow-hidden flex-shrink-0 border" style={{ borderColor: 'var(--gold)' }}>
              {agent.photo ? (
                <Image src={getMediaUrl(agent.photo)} alt={`${agent.first_name} ${agent.last_name}`} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gold flex items-center justify-center">
                  <span className="serif text-5xl text-ink">{agent.first_name[0]}</span>
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>{agent.designation}</p>
              <h1 className="mt-3 serif text-4xl md:text-5xl">{agent.first_name} {agent.last_name}</h1>
              {agent.rera_number && <p className="text-white/50 text-sm mt-2">RERA: {agent.rera_number}</p>}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 mt-5 text-sm text-white/70">
                <span>{agent.experience_years}+ Years Experience</span>
                <span>{agent.total_properties} Properties</span>
                <span>{agent.total_deals} Deals Closed</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-6">
                <a href={`tel:${agent.phone}`} className="btn-gold"><HiPhone className="w-4 h-4" /> Call</a>
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-7 py-[0.95rem] bg-green-600 text-white text-xs tracking-[0.18em] uppercase hover:bg-green-700 transition-colors">
                    <FaWhatsapp className="w-4 h-4" /> WhatsApp
                  </a>
                )}
                <a href={`mailto:${agent.email}`} className="btn-ghost-light"><HiMail className="w-4 h-4" /> Email</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {agent.bio && (
              <div>
                <p className="eyebrow">About</p>
                <p className="mt-4 text-muted-foreground leading-relaxed">{agent.bio}</p>
              </div>
            )}

            {properties && properties.results.length > 0 && (
              <div>
                <p className="eyebrow mb-8">Listed Properties</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
                  {properties.results.slice(0, 4).map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}

            {agent.reviews && agent.reviews.length > 0 && (
              <div>
                <p className="eyebrow mb-6">Client Reviews</p>
                <div className="space-y-6">
                  {agent.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <HiStar key={j} className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                          ))}
                        </div>
                        <span className="font-semibold text-sm text-ink">{review.reviewer_name}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="border border-border p-6">
              <p className="eyebrow mb-4">Agent Details</p>
              <div className="space-y-3 text-sm">
                {agent.languages && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Languages</span><span className="font-medium text-ink">{agent.languages}</span></div>
                )}
                {agent.specializations && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Specializations</span><span className="font-medium text-right max-w-[60%] text-ink">{agent.specializations}</span></div>
                )}
                {agent.average_rating && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1 text-ink"><HiStar className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {agent.average_rating}/5</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                {agent.linkedin && (
                  <a href={agent.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                )}
                {agent.instagram && (
                  <a href={agent.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
