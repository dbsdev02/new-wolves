'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { calculateMortgage, formatPrice } from '@/lib/utils';
import Link from 'next/link';

export function MortgageCalculator() {
  const [price, setPrice] = useState(2000000);
  const [downPayment, setDownPayment] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const principal = price * (1 - downPayment / 100);
  const result = calculateMortgage(principal, rate, years);

  const sliders = [
    {
      label: 'Property Price',
      value: price,
      display: formatPrice(price),
      min: 500000, max: 20000000, step: 100000,
      onChange: setPrice,
      range: ['AED 500K', 'AED 20M'],
    },
    {
      label: 'Down Payment',
      value: downPayment,
      display: `${downPayment}%`,
      min: 20, max: 80, step: 5,
      onChange: setDownPayment,
      range: ['20%', '80%'],
    },
    {
      label: 'Interest Rate',
      value: rate,
      display: `${rate}% p.a.`,
      min: 2, max: 10, step: 0.1,
      onChange: setRate,
      range: ['2%', '10%'],
    },
    {
      label: 'Loan Term',
      value: years,
      display: `${years} Years`,
      min: 5, max: 25, step: 1,
      onChange: setYears,
      range: ['5 Years', '25 Years'],
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ background: 'var(--cream)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Financial Planning</p>
          <h2 className="section-heading mt-4">Mortgage Calculator</h2>
          <span className="gold-rule mx-auto block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Sliders */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10"
            style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}
          >
            <div className="space-y-8">
              {sliders.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label-luxury">{s.label}</label>
                    <span className="text-sm font-semibold" style={{ color: 'var(--gold-deep)' }}>{s.display}</span>
                  </div>
                  <input
                    type="range"
                    min={s.min} max={s.max} step={s.step}
                    value={s.value}
                    onChange={(e) => s.onChange(Number(e.target.value) as never)}
                    className="w-full h-1 appearance-none cursor-pointer"
                    style={{ accentColor: 'var(--gold-deep)' }}
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[0.65rem] tracking-wider" style={{ color: 'var(--muted)' }}>{s.range[0]}</span>
                    <span className="text-[0.65rem] tracking-wider" style={{ color: 'var(--muted)' }}>{s.range[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col"
            style={{ background: 'var(--ink)' }}
          >
            <div className="p-8 md:p-10 flex-1">
              <p className="eyebrow mb-2" style={{ color: 'var(--gold-soft)' }}>Your Estimate</p>
              <h3 style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.5rem',
                color: 'var(--white)',
                fontWeight: 300,
              }}>
                Monthly Payment
              </h3>
              <div className="mt-4 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <span style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 300,
                  color: 'var(--gold-soft)',
                  lineHeight: 1,
                }}>
                  {formatPrice(result.monthly)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Loan Amount', value: formatPrice(principal) },
                  { label: 'Total Interest', value: formatPrice(result.interest) },
                  { label: 'Total Payment', value: formatPrice(result.total) },
                  { label: 'Down Payment', value: formatPrice(price * downPayment / 100) },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="label-luxury mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-[0.65rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                * Estimate only. Actual rates may vary. Contact our mortgage advisors for accurate calculations.
              </p>
            </div>

            <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <Link href="/contact?type=mortgage" className="btn-gold w-full justify-center">
                Get Mortgage Advice
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
