'use client';
import { useState } from 'react';
import Link from 'next/link';
import { calculateMortgage, formatPrice } from '@/lib/utils';

interface Props {
  price: number;
  currency: string;
}

// UAE resident mortgage rules for a ready property:
// max 80% LTV (min 20% down), max 25-year term, loan must end by age 60,
// 4% DLD registration + 2% agency fee due on top of the down payment at purchase.
const MAX_LOAN_AGE = 60;
const MAX_LOAN_YEARS = 25;
const MIN_DOWN_PAYMENT_PCT = 20;
const DLD_FEE_PCT = 4;
const AGENCY_FEE_PCT = 2;

export function PropertyMortgageWidget({ price, currency }: Props) {
  const [age, setAge] = useState(35);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(3.9);

  const maxYearsByAge = Math.max(0, Math.min(MAX_LOAN_YEARS, MAX_LOAN_AGE - age));
  const eligible = maxYearsByAge > 0;
  const effectiveYears = Math.min(years, maxYearsByAge || MAX_LOAN_YEARS);

  const downPayment = price * (downPaymentPct / 100);
  const principal = price - downPayment;
  const result = calculateMortgage(principal, rate, effectiveYears || 1);
  const dldFee = price * DLD_FEE_PCT / 100;
  const agencyFee = price * AGENCY_FEE_PCT / 100;
  const totalUpfront = downPayment + dldFee + agencyFee;

  const fieldClass = 'w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="label-luxury">Total Price</label>
          <input type="text" readOnly value={`${price.toLocaleString()} ${currency}`} className={`${fieldClass} bg-cream text-muted-foreground`} />
        </div>
        <div>
          <label className="label-luxury">Your Age</label>
          <input
            type="number"
            min={21}
            max={70}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="label-luxury">Down Payment (% — 20% min)</label>
          <input
            type="number"
            min={MIN_DOWN_PAYMENT_PCT}
            max={100}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Math.max(MIN_DOWN_PAYMENT_PCT, Number(e.target.value)))}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="label-luxury">Loan Period (Years — {MAX_LOAN_YEARS} max)</label>
          <input
            type="number"
            min={1}
            max={MAX_LOAN_YEARS}
            value={years}
            onChange={(e) => setYears(Math.min(MAX_LOAN_YEARS, Number(e.target.value)))}
            className={fieldClass}
          />
          {eligible && years > maxYearsByAge && (
            <p className="mt-1.5 text-xs text-gold-deep">Capped at {effectiveYears} years — loan must end by age {MAX_LOAN_AGE}.</p>
          )}
        </div>
        <div>
          <label className="label-luxury">Interest Rate (% — {`${3.8}-${4}`} typical)</label>
          <input
            type="number"
            step="0.05"
            min={3.8}
            max={4}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="bg-cream p-6 md:p-8 flex flex-col justify-between">
        {eligible ? (
          <div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">Estimated Payment</p>
            <p className="mt-2 serif text-3xl md:text-4xl text-ink">{formatPrice(result.monthly, currency)}</p>
            <p className="text-xs text-muted-foreground">per month</p>

            <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Loan Amount:</span>
                <span className="text-ink font-medium">{formatPrice(principal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-ink font-medium">{effectiveYears} years</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">Upfront Costs</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Down Payment ({downPaymentPct}%):</span>
                <span className="text-ink font-medium">{formatPrice(downPayment, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DLD Registration ({DLD_FEE_PCT}%):</span>
                <span className="text-ink font-medium">{formatPrice(dldFee, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agency Fee ({AGENCY_FEE_PCT}%):</span>
                <span className="text-ink font-medium">{formatPrice(agencyFee, currency)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span className="text-ink">Total Due at Purchase:</span>
                <span className="text-gold-deep">{formatPrice(totalUpfront, currency)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            At age {age}, no mortgage term remains under the standard age-{MAX_LOAN_AGE} repayment limit. Contact us about alternative financing.
          </p>
        )}

        <Link href="/contact?type=mortgage" className="btn-gold mt-6 justify-center">
          Get a free consultation
        </Link>
      </div>
    </div>
  );
}
