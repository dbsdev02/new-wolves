'use client';
import { useState } from 'react';
import Link from 'next/link';
import { calculateMortgage, formatPrice } from '@/lib/utils';

interface Props {
  price: number;
  currency: string;
}

export function PropertyMortgageWidget({ price, currency }: Props) {
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(3.75);

  const downPayment = price * (downPaymentPct / 100);
  const principal = price - downPayment;
  const result = calculateMortgage(principal, rate, years);

  const fieldClass = 'w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="label-luxury">Total Price</label>
          <input type="text" readOnly value={`${price.toLocaleString()} ${currency}`} className={`${fieldClass} bg-cream text-muted-foreground`} />
        </div>
        <div>
          <label className="label-luxury">Down Payment (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="label-luxury">Loan Period (Years)</label>
          <input
            type="number"
            min={1}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="label-luxury">Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            max={20}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="bg-cream p-6 md:p-8 flex flex-col justify-between">
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
              <span className="text-ink font-medium">{years}</span>
            </div>
          </div>
        </div>

        <Link href="/contact?type=mortgage" className="btn-gold mt-6 justify-center">
          Get a free consultation
        </Link>
      </div>
    </div>
  );
}
