import Link from 'next/link';

const founders = [
  {
    img: '/images/team/rishika.png',
    name: 'Rishika M',
    role: 'CEO & Founder',
    bio: 'Rishika M is the CEO and Founder of Wolves International Real Estate, bringing over 22 years of diverse experience across tourism, aviation and television before founding Wolves International — a company built on integrity, transparency, and a client-first philosophy.',
  },
  {
    img: '/images/team/aanshul.png',
    name: 'Anshul Agarwal',
    role: 'Co-Founder & Managing Partner',
    bio: 'Anshul Agarwal is the Co-Founder and Managing Partner of Wolves International, with over 16 years of sales experience leading teams of 500+ across India and internationally, and over AED 1 billion in real estate sales.',
  },
];

export function LeadershipSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--cream)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="eyebrow">Leadership</p>
            <h2 className="section-heading mt-4">People, not personas.</h2>
          </div>
          <Link
            href="/about"
            className="link-underline flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            Meet the full team →
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {founders.map((m) => (
            <div key={m.name} className="grid grid-cols-5 gap-6 items-center">
              <div className="col-span-2 aspect-[4/5] overflow-hidden flex items-end justify-center" style={{ background: 'var(--ink)' }}>
                <img src={m.img} alt={m.name} loading="lazy" className="h-full w-auto object-contain" />
              </div>
              <div className="col-span-3">
                <h3 className="serif text-2xl md:text-3xl text-ink">{m.name}</h3>
                <p className="mt-2 text-xs tracking-[0.2em] uppercase text-gold-deep">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
