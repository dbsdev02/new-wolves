'use client';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import { useFeaturedProjects } from '@/hooks/useContent';
import { formatPrice, getMediaUrl } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: 'var(--gold-deep)' },
  under_construction: { label: 'Under Construction', color: '#B45309' },
  ready: { label: 'Ready', color: '#15803D' },
  sold_out: { label: 'Sold Out', color: 'var(--muted)' },
};

export function FeaturedProjects() {
  const { data: projects, isLoading } = useFeaturedProjects();

  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--cream)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="section-header">
          <div>
            <p className="eyebrow">New Launches</p>
            <h2 className="section-heading mt-4">Off-plan projects.</h2>
          </div>
          <Link
            href="/projects"
            className="link-underline flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            All projects <HiOutlineArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white">
                <div className="aspect-[16/10]" style={{ background: 'var(--cream-dark)' }} />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-2/3 rounded" style={{ background: 'var(--cream-dark)' }} />
                  <div className="h-3 w-1/2 rounded" style={{ background: 'var(--cream-dark)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects || []).slice(0, 6).map((project) => {
              const status = statusConfig[project.status] || { label: project.status, color: 'var(--muted)' };
              return (
                <Link
                  href={`/projects/${project.slug}`}
                  key={project.id}
                  className="group block bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getMediaUrl(project.featured_image)}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="inline-block px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-white"
                        style={{ background: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Project name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-light leading-tight" style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '1.35rem',
                      }}>
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="label-luxury mb-1">Starting From</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--gold-deep)' }}>
                        {project.min_price ? formatPrice(project.min_price, project.currency) : 'Price on Request'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="label-luxury mb-1">Location</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                        {project.community_name || 'Dubai'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
