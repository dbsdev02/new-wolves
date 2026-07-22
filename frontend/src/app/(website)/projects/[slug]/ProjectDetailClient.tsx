'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useProject } from '@/hooks/useContent';
import { formatPrice, getMediaUrl } from '@/lib/utils';
import { InquiryForm } from '@/components/properties/InquiryForm';
import { HiLocationMarker, HiDownload } from 'react-icons/hi';

interface Props { slug: string }

export function ProjectDetailClient({ slug }: Props) {
  const { data: project, isLoading } = useProject(slug);

  if (isLoading) return (
    <div className="min-h-screen pt-32 bg-background">
      <div className="container-luxe py-8 animate-pulse space-y-6">
        <div className="aspect-[21/9] bg-muted" />
        <div className="h-8 bg-muted w-1/2" />
      </div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="serif text-4xl text-ink mb-6">Project not found</h2>
        <Link href="/projects" className="btn-gold">Browse projects</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative aspect-[21/9] min-h-[420px] overflow-hidden">
        <Image src={getMediaUrl(project.featured_image)} alt={project.name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
        <div className="absolute inset-0 flex flex-col justify-end pb-16 pt-32">
          <div className="container-luxe">
            <p className="eyebrow mb-4" style={{ color: 'var(--gold-soft)' }}>{project.status.replace('_', ' ')}</p>
            <h1 className="serif text-4xl md:text-6xl text-white mb-3">{project.name}</h1>
            {project.address && (
              <div className="flex items-center gap-2 text-white/70">
                <HiLocationMarker className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                <span>{project.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Stats */}
            <div className="border-b border-border pb-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Starting Price', value: project.min_price ? formatPrice(project.min_price, project.currency) : 'On Request' },
                  { label: 'Total Units', value: project.total_units },
                  { label: 'Available Units', value: project.available_units },
                  { label: 'Completion', value: project.completion_date ? new Date(project.completion_date).getFullYear() : 'TBA' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="serif text-xl text-gold-deep">{value}</div>
                    <div className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Overview</p>
              <h2 className="mt-4 serif text-2xl text-ink mb-4">About this project</h2>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {project.images && project.images.length > 0 && (
              <div>
                <p className="eyebrow mb-6">Gallery</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.images.map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden">
                      <Image src={getMediaUrl(img.image)} alt={img.caption || project.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="200px" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.developer_name && (
              <div className="flex items-center gap-6 border-t border-border pt-10">
                {project.developer_logo && (
                  <div className="relative w-24 h-16 flex-shrink-0">
                    <Image src={getMediaUrl(project.developer_logo)} alt={project.developer_name} fill className="object-contain" />
                  </div>
                )}
                <div>
                  <div className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground mb-1">Developer</div>
                  <div className="serif text-xl text-ink">{project.developer_name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-border p-6">
              <div className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground mb-2">Price Range</div>
              <div className="serif text-2xl text-gold-deep mb-1">
                {project.min_price ? formatPrice(project.min_price, project.currency) : 'Price on Request'}
              </div>
              {project.max_price && (
                <div className="text-muted-foreground text-sm">Up to {formatPrice(project.max_price, project.currency)}</div>
              )}
            </div>

            <div className="bg-ink text-white p-8">
              <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Private inquiry</p>
              <h3 className="mt-4 serif text-2xl leading-tight">Register your interest</h3>
              <div className="mt-6">
                <InquiryForm propertyId={project.id} propertyTitle={project.name} />
              </div>
            </div>

            {project.brochure && (
              <a href={getMediaUrl(project.brochure)} download className="flex items-center gap-3 w-full p-4 border border-border hover:border-gold transition-colors text-sm">
                <HiDownload className="w-5 h-5" style={{ color: 'var(--gold-deep)' }} /> Download Brochure
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
