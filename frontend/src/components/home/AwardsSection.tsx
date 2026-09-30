'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

const AWARDS = [
  {
    image: '/trophy.png',
    title: 'Sobha Stars Awards',
    subtitle: '9th Top Performing Channel Partner – H2 2025',
  },
  {
    image: '/award2.png',
    title: 'BNW Developments Broker Awards',
    subtitle: 'Elite Performer – 2025',
  },
  {
    image: '/award-3.jpg',
    title: 'Danube Properties Excellence Awards',
    subtitle: 'Marketing Maverick – 2026',
  },
  {
    image: '/award-4.jpeg',
    title: 'Imtiaz Developments',
    subtitle: 'The Signature Award – 2026',
  },
  {
    image: '/award5.png',
    title: 'Sobha Stars Awards',
    subtitle: 'Top Performing Channel Partner – H1 2026',
  },
];

export function AwardsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ background: 'var(--ink)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Recognised Excellence</p>
          <h2 className="section-heading-light mt-4">
            Awards &amp; <span style={{ color: 'var(--gold)' }}>Recognition</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AWARDS.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-8 flex flex-col items-center text-center border transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              <div className="relative w-full h-56 mb-6">
                <Image
                  src={award.image}
                  alt={award.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 30vw"
                />
              </div>
              <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: 'var(--gold)' }}>
                {award.title}
              </p>
              <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {award.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
