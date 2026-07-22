import Link from 'next/link';
import { HiOutlineDocumentText, HiOutlineArrowUpRight } from 'react-icons/hi2';

export function MarketReportSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--cream)' }}>
      <div className="container-luxe grid gap-12 lg:grid-cols-2 items-center">

        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src="/images/marketing/property-downtown.jpg"
            alt="UAE Real Estate Sentiment Report"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,13,13,0.25) 0%, transparent 60%)' }} />
          {/* Floating card */}
          <div
            className="absolute bottom-6 left-6 px-6 py-5 max-w-[220px]"
            style={{ background: 'rgba(250,248,244,0.97)', backdropFilter: 'blur(12px)' }}
          >
            <p className="eyebrow mb-2">2026 Edition</p>
            <p style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.1rem',
              color: 'var(--ink)',
              lineHeight: 1.3,
            }}>
              Market Sentiment Report
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="eyebrow">Research</p>
          <h2 className="section-heading mt-4">
            UAE Real Estate Market<br />Sentiment Report 2026
          </h2>
          <span className="gold-rule block" />
          <p className="mt-8 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            In the current global environment, investor sentiment toward UAE
            real estate has become harder to gauge through transactions alone.
            Our Market Research Division surveyed investors across the Emirates
            and 90+ countries worldwide to understand how the market is truly
            being viewed today.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 pb-10 border-b" style={{ borderColor: 'var(--border)' }}>
            {[
              { value: '90+', label: 'Countries surveyed' },
              { value: '2,400+', label: 'Respondents' },
              { value: 'Q1 2026', label: 'Published' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '1.75rem',
                  fontWeight: 300,
                  color: 'var(--gold-deep)',
                  lineHeight: 1,
                }}>
                  {s.value}
                </p>
                <p className="mt-1.5 text-[0.65rem] tracking-wider uppercase" style={{ color: 'var(--muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#" className="btn-gold">
              <HiOutlineDocumentText className="h-4 w-4" strokeWidth={1.5} /> Download report
            </a>
            <Link
              href="/about"
              className="link-underline flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Our approach <HiOutlineArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
