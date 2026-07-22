'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAgents } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';
import { HiPhone } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

export function AgentsPageClient() {
  const { data, isLoading } = useAgents();

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Our Team</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">Meet our advisors.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Expert real estate professionals dedicated to finding your perfect property.</p>
        </div>
      </section>

      <div className="container-luxe py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse aspect-[3/4] bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {(data?.results || []).map((agent) => (
              <div key={agent.id} className="group">
                <Link href={`/agents/${agent.id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {agent.photo ? (
                      <Image src={getMediaUrl(agent.photo)} alt={`${agent.first_name} ${agent.last_name}`} fill className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000" sizes="300px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-ink">
                        <span className="serif text-5xl text-white">{agent.first_name[0]}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 serif text-xl text-ink group-hover:text-gold-deep transition-colors">{agent.first_name} {agent.last_name}</h3>
                  <p className="text-xs tracking-[0.2em] uppercase text-gold-deep mt-1">{agent.designation}</p>
                </Link>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{agent.experience_years}+ yrs</span>
                  <span>{agent.total_properties} properties</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <a href={`tel:${agent.phone}`} className="flex-1 flex items-center justify-center gap-1 py-2 border border-border hover:border-gold transition-colors text-xs">
                    <HiPhone className="w-3 h-3" /> Call
                  </a>
                  {agent.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-xs">
                      <FaWhatsapp className="w-3 h-3" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
