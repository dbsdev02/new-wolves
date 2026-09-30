'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTestimonials, useGoogleReviews } from '@/hooks/useContent';
import type { GoogleReview } from '@/types';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.12-1.43.34-2.09V7.06H2.18A10.99 10.99 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 00-9.82 6.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  );
}

function GoogleStars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i < Math.round(rating) ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleReviewCard({ review, i, inView }: { review: GoogleReview; i: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="p-8 flex flex-col border transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <GoogleStars rating={review.rating} />
        <GoogleIcon className="w-5 h-5 flex-shrink-0" />
      </div>
      <p className="text-sm leading-relaxed flex-1 mb-7 line-clamp-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold" style={{ background: 'var(--gold-deep)' }}>
          {review.author_name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{review.author_name}</p>
          <p className="text-[0.65rem] tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {review.relative_time_description} · Google Review
          </p>
        </div>
      </div>
    </motion.div>
  );
}

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
  const { data: google } = useGoogleReviews();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const hasGoogle = !!google?.configured && google.rating !== null;

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ background: 'var(--ink)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Client Stories</p>
            <h2 className="section-heading-light mt-4">What our clients say.</h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-sm max-w-xs md:text-right" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Trusted by investors and homeowners across 90+ countries worldwide.
            </p>
            {hasGoogle && (
              <a
                href={google!.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 border transition-colors hover:border-gold"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <GoogleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-white font-semibold">{google!.rating!.toFixed(1)}</span>
                <GoogleStars rating={google!.rating!} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {google!.user_ratings_total} Google reviews
                </span>
              </a>
            )}
          </div>
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
            {(google?.reviews || []).slice(0, 2).map((r, i) => (
              <GoogleReviewCard key={`google-${i}`} review={r} i={i} inView={inView} />
            ))}
            {(testimonials || []).slice(0, hasGoogle ? 4 : 6).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i + Math.min(google?.reviews.length || 0, 2)) * 0.08 }}
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold" style={{ background: 'var(--gold-deep)' }}>
                    {t.name[0]}
                  </div>
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
