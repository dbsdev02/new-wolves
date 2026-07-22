import { HiSparkles } from 'react-icons/hi';

export function QuizSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--white)' }}>
      <div className="container-luxe">
        <div className="grid gap-0 lg:grid-cols-2 overflow-hidden border" style={{ borderColor: 'var(--border)' }}>

          {/* Image side */}
          <div className="relative min-h-[320px] lg:min-h-[480px]">
            <img
              src="/images/marketing/property-bay.jpg"
              alt="Find your dream home"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,13,13,0.5) 0%, transparent 70%)' }} />
            <div className="absolute top-6 left-6">
              <span className="badge-light">30-Second Quiz</span>
            </div>
            {/* Decorative corner */}
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2" style={{ borderColor: 'var(--gold)' }} />
          </div>

          {/* Content side */}
          <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: 'var(--ink)' }}>
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Personalised match</p>
            <h2 className="section-heading-light mt-4">
              Find my<br />dream home.
            </h2>
            <p className="mt-6 text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Answer a few questions and unlock a curated shortlist of Dubai
              residences matched to your lifestyle, budget and investment
              goals — plus our exclusive Dubai Investment Guidebook.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a href="/contact" className="btn-gold">
                <HiSparkles className="h-4 w-4" /> Start the quiz
              </a>
              <span className="text-[0.65rem] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Takes only 30 seconds
              </span>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t grid grid-cols-3 gap-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              {[
                { value: '500+', label: 'Matched' },
                { value: '98%', label: 'Satisfaction' },
                { value: 'Free', label: 'No obligation' },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    color: 'var(--gold-soft)',
                    lineHeight: 1,
                  }}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-[0.6rem] tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
