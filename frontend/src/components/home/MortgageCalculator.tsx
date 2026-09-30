'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { calculateMortgage, formatPrice } from '@/lib/utils';
import Link from 'next/link';

// UAE resident mortgage rules for a ready property:
// max 80% LTV (min 20% down), max 25-year term, loan must end by age 60,
// 4% DLD registration + 2% agency fee due on top of the down payment at purchase.
const MAX_LOAN_AGE = 60;
const MAX_LOAN_YEARS = 25;
const MIN_DOWN_PAYMENT_PCT = 20;
const DLD_FEE_PCT = 4;
const AGENCY_FEE_PCT = 2;

export function MortgageCalculator() {
  const [price, setPrice] = useState(2000000);
  const [age, setAge] = useState(35);
  const [downPayment, setDownPayment] = useState(20);
  const [rate, setRate] = useState(3.9);
  const [years, setYears] = useState(25);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const maxYearsByAge = Math.max(0, Math.min(MAX_LOAN_YEARS, MAX_LOAN_AGE - age));
  const effectiveYears = Math.min(years, maxYearsByAge || MAX_LOAN_YEARS);
  const eligible = maxYearsByAge > 0;

  const downPaymentAmount = price * downPayment / 100;
  const principal = price - downPaymentAmount;
  const result = calculateMortgage(principal, rate, effectiveYears || 1);
  const dldFee = price * DLD_FEE_PCT / 100;
  const agencyFee = price * AGENCY_FEE_PCT / 100;
  const totalUpfront = downPaymentAmount + dldFee + agencyFee;

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
      label: 'Your Age',
      value: age,
      display: `${age} years`,
      min: 21, max: 65, step: 1,
      onChange: setAge,
      range: ['21', '65'],
    },
    {
      label: 'Down Payment',
      value: downPayment,
      display: `${downPayment}%`,
      min: MIN_DOWN_PAYMENT_PCT, max: 80, step: 5,
      onChange: setDownPayment,
      range: ['20% min', '80%'],
    },
    {
      label: 'Interest Rate',
      value: rate,
      display: `${rate.toFixed(2)}% p.a.`,
      min: 3.8, max: 4, step: 0.05,
      onChange: setRate,
      range: ['3.8%', '4%'],
    },
    {
      label: 'Loan Term',
      value: years,
      display: eligible ? `${effectiveYears} Years` : 'Not eligible',
      min: 1, max: MAX_LOAN_YEARS, step: 1,
      onChange: setYears,
      range: ['1 Year', `${MAX_LOAN_YEARS} Years`],
    },
  ];

  return (
    <section id="mortgage" ref={ref} className="py-24 md:py-32 scroll-mt-24" style={{ background: 'var(--cream)' }}>
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
                    className="range-luxury w-full h-1 appearance-none cursor-pointer"
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

              {eligible ? (
                <>
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
                    {years > maxYearsByAge && (
                      <p className="mt-2 text-xs" style={{ color: 'var(--gold-soft)' }}>
                        Loan term capped at {effectiveYears} years — repayment must end by age {MAX_LOAN_AGE}.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: 'Loan Amount', value: formatPrice(principal) },
                      { label: 'Total Interest', value: formatPrice(result.interest) },
                      { label: 'Total Payment', value: formatPrice(result.total) },
                      { label: 'Down Payment (20% min)', value: formatPrice(downPaymentAmount) },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="label-luxury mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                        <p className="text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="label-luxury mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Upfront Costs at Purchase</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/70">
                        <span>Down Payment (20%)</span>
                        <span>{formatPrice(downPaymentAmount)}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>DLD Registration ({DLD_FEE_PCT}%)</span>
                        <span>{formatPrice(dldFee)}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Agency Fee ({AGENCY_FEE_PCT}%)</span>
                        <span>{formatPrice(agencyFee)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-white pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <span>Total Due at Purchase</span>
                        <span style={{ color: 'var(--gold-soft)' }}>{formatPrice(totalUpfront)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-8 text-[0.65rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    * Estimate only, based on standard UAE resident lending terms for a ready property (up to 80% LTV, 25-year max term, loan ending by age {MAX_LOAN_AGE}). Actual rates and eligibility may vary. Contact our mortgage advisors for accurate calculations.
                  </p>
                </>
              ) : (
                <p className="mt-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  At age {age}, no mortgage term remains under the standard age-{MAX_LOAN_AGE} repayment limit. Speak with our advisors about alternative financing options.
                </p>
              )}
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
