import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineBuildingOffice2, HiOutlineUsers, HiOutlineGlobeAlt, HiOutlineTrophy } from 'react-icons/hi2';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Wolves International is a visionary real estate company transforming the industry through innovation, integrity, and excellence — with offices across the UAE and India.',
};

const values = [
  { t: 'Transparency', d: 'Clear, honest, and seamless transactions from first call to final handover.' },
  { t: 'Innovation', d: 'Elevating service quality and efficiency through technology.' },
  { t: 'Integrity', d: 'Unwavering commitment to excellence and client-first service.' },
  { t: 'Global Reach', d: 'Expanding beyond borders to provide international expertise.' },
];

const founders = [
  {
    img: '/images/team/rishika.png',
    name: 'Rishika M',
    role: 'CEO & Founder',
    bio: [
      'Rishika M is the CEO and Founder of Wolves International Real Estate, bringing over 22 years of diverse experience to the industry. Her career began in call centers and tourism, transitioned through a successful stint as a flight attendant, and later as an Indian television actress. Her passion for real estate took root in Mumbai and flourished in Dubai, where she found her true calling and later founded Wolves International, a company built on integrity, transparency, and a client-first philosophy.',
      'With a vision of AI-powered, seamless real estate transactions and a commitment to exceptional customer service, Rishika is revolutionizing the industry through Wolves International.',
    ],
  },
  {
    img: '/images/team/aanshul.png',
    name: 'Aanshul Agarwal',
    role: 'Co-Founder & Managing Partner',
    bio: [
      'Aanshul Agarwal is the Managing Partner and Co-Founder of Wolves International, a leading force in the real estate industry with over 16 years of sales experience. Having led teams of 500+ in India and 150+ internationally for a UK-based company, he achieved over 1 billion in real estate sales in a remarkably short period.',
      'A self-proclaimed Black Wolf, Aanshul is committed to innovation, collaboration, and breaking boundaries — striving to redefine the industry and chart new paths for success.',
    ],
  },
];

const stats = [
  { icon: HiOutlineBuildingOffice2, n: '1B+', l: 'AED in sales' },
  { icon: HiOutlineUsers, n: '500+', l: 'Team members led' },
  { icon: HiOutlineGlobeAlt, n: '3', l: 'Countries: UAE & India' },
  { icon: HiOutlineTrophy, n: '38+', l: 'Combined years experience' },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative pt-40 pb-24 md:pb-40 bg-ink text-white overflow-hidden">
        <img src="/images/marketing/property-emirates.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 to-ink" />
        <div className="relative container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Revolutionizing Global Real Estate</p>
          <h1 className="mt-6 serif text-5xl md:text-8xl leading-[1.02] max-w-4xl">
            Global reach, <em className="not-italic" style={{ color: 'var(--gold-soft)' }}>local</em> touch.
          </h1>
          <p className="mt-10 max-w-xl text-lg text-white/70 leading-relaxed font-light">
            Wolves International is a visionary real estate company transforming
            the industry through innovation, integrity, and excellence. Our mission
            is to empower clients, foster trust, and build lasting value.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-28 md:py-40">
        <div className="container-luxe grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Our vision</p>
            <h2 className="mt-4 serif text-4xl leading-tight text-ink">A different kind of brokerage.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
            <p>
              Our vision is to redefine the global real estate experience by
              merging cutting-edge technology with personalized service — for
              clients across Dubai, Abu Dhabi, and beyond.
            </p>
            <p>
              We specialize in luxury properties and off-plan investments,
              high-yield portfolio management, and global market insights — with
              offices spanning the UAE and India.
            </p>
            <p>
              Our motto is simple: <span className="text-ink font-medium">Global Reach, Local Touch.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Values dark */}
      <section className="py-28 md:py-40 bg-ink text-white">
        <div className="container-luxe">
          <div className="max-w-xl mb-16">
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>What we believe</p>
            <h2 className="mt-4 serif text-4xl md:text-5xl leading-[1.1]">Four principles, no exceptions.</h2>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.t} className="bg-ink p-10 group hover:bg-ink-soft transition-colors">
                <p className="serif text-6xl text-gold/30">0{i + 1}</p>
                <h3 className="mt-8 serif text-2xl">{v.t}</h3>
                <p className="mt-4 text-sm text-white/60 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-28 md:py-40 bg-cream">
        <div className="container-luxe">
          <div className="max-w-xl mb-20">
            <p className="eyebrow">Leadership</p>
            <h2 className="mt-4 serif text-4xl md:text-6xl text-ink leading-[1.05]">People, not personas.</h2>
          </div>
          <div className="space-y-24">
            {founders.map((m, i) => (
              <article key={m.name} className="grid gap-12 lg:grid-cols-12 items-center">
                <div className={`lg:col-span-4 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/5] overflow-hidden bg-ink flex items-end justify-center">
                    <img src={m.img} alt={m.name} loading="lazy" className="h-full w-auto object-contain" />
                  </div>
                </div>
                <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h3 className="serif text-3xl md:text-4xl text-ink">{m.name}</h3>
                  <p className="mt-2 text-xs tracking-[0.2em] uppercase text-gold-deep">{m.role}</p>
                  <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                    {m.bio.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-28">
        <div className="container-luxe">
          <div className="grid gap-16 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <s.icon className="h-6 w-6" strokeWidth={1.25} style={{ color: 'var(--gold-deep)' }} />
                <p className="mt-6 serif text-5xl md:text-6xl text-ink">{s.n}</p>
                <p className="mt-2 text-xs tracking-[0.22em] uppercase text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-ink text-white text-center">
        <div className="container-luxe">
          <h2 className="serif text-4xl md:text-5xl leading-tight">Begin a private conversation.</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-gold">Contact us</Link>
            <Link href="/properties" className="btn-ghost-light">Browse properties</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
