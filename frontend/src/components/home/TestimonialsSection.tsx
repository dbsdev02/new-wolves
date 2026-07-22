'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useTestimonials } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mb-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i < rating ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useTestimonials();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ background: 'var(--ink)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Client Stories</p>
            <h2 className="section-heading-light mt-4">What our clients say.</h2>
          </div>
          <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Trusted by investors and homeowners across 90+ countries worldwide.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse p-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-3 w-1/3 mb-5 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="h-20 mb-6 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
                    <div className="h-2 w-16 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(testimonials || []).slice(0, 6).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 flex flex-col border transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <StarRating rating={t.rating} />

                <p className="text-sm leading-relaxed flex-1 mb-7" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {t.photo ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={getMediaUrl(t.photo)} alt={t.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold" style={{ background: 'var(--gold-deep)' }}>
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-[0.65rem] tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {t.designation}{t.company ? `, ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
