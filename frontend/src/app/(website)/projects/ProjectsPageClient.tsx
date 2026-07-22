'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProjects } from '@/hooks/useContent';
import { formatPrice, getMediaUrl } from '@/lib/utils';
import { HiSearch } from 'react-icons/hi';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Under Construction', value: 'under_construction' },
  { label: 'Ready', value: 'ready' },
];

export function ProjectsPageClient() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProjects({ status: status || undefined, search: search || undefined });

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>New Launches</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">Off-plan projects.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Invest in Dubai&apos;s most prestigious upcoming developments.</p>
        </div>
      </section>

      <div className="container-luxe py-14">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-input bg-background text-sm tracking-wide focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border ${status === opt.value ? 'bg-ink text-white border-ink' : 'border-border hover:border-ink'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse aspect-[16/10] bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {(data?.results || []).map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id} className="group block border border-border overflow-hidden hover:shadow-luxury transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={getMediaUrl(project.featured_image)}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="eyebrow bg-white/90 backdrop-blur px-3 py-1.5">{project.status.replace('_', ' ')}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>{project.community_name || ''}</p>
                    <h3 className="mt-2 serif text-2xl leading-tight">{project.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Starting From</div>
                      <div className="serif text-lg text-gold-deep">
                        {project.min_price ? formatPrice(project.min_price, project.currency) : 'Price on Request'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                    <span>{project.total_units} Units</span>
                    {project.completion_date && <span>Completion: {new Date(project.completion_date).getFullYear()}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
