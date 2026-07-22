import { HiOutlineSparkles } from 'react-icons/hi2';

export function SustainabilitySection() {
  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--cream)' }}>
      <div className="container-luxe grid gap-12 lg:grid-cols-2 items-center">

        {/* Content */}
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Sustainability Initiative</p>
          <h2 className="section-heading mt-4">
            A home for you,<br />a tree for the planet.
          </h2>
          <span className="gold-rule block" />
          <p className="mt-8 text-sm leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
            Play your part in creating a more sustainable world. For every
            residence we transact, Wolves International funds the planting
            of native trees across the UAE — turning each acquisition into
            a lasting environmental commitment.
          </p>

          {/* Impact stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 pb-10 border-b" style={{ borderColor: 'var(--border)' }}>
            {[
              { value: '2,400+', label: 'Trees planted' },
              { value: '100%', label: 'Carbon offset' },
              { value: 'UAE', label: 'Native species' },
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

          <a href="/about" className="mt-8 inline-flex btn-gold">
            <HiOutlineSparkles className="h-4 w-4" strokeWidth={1.5} /> Learn more
          </a>
        </div>

        {/* Image */}
        <div className="order-1 lg:order-2 relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src="/images/marketing/property-hills.jpg"
            alt="Sustainability initiative"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Decorative corner */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2" style={{ borderColor: 'var(--gold)' }} />
        </div>
      </div>
    </section>
  );
}
