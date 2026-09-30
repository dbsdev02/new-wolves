'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { leadService } from '@/services';
import toast from 'react-hot-toast';

const REPORT_PDF = '/UAE_Real_Estate_Sentiment_Report_2026.pdf';
const REPORT_FILENAME = 'UAE-Real-Estate-Sentiment-Report-2026.pdf';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
});
type FormData = z.infer<typeof schema>;

export function MarketReportDownload() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const triggerDownload = () => {
    const a = document.createElement('a');
    a.href = REPORT_PDF;
    a.download = REPORT_FILENAME;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onSubmit = async (data: FormData) => {
    try {
      await leadService.create({
        ...data,
        email: '',
        lead_type: 'brochure',
        message: 'Requested: UAE Real Estate Market Sentiment Report 2026',
      });
    } catch {
      // Don't block the download on a lead-capture hiccup.
    }
    triggerDownload();
    toast.success('Thank you — your report is downloading.');
    setOpen(false);
    reset();
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-gold">
        <HiOutlineDocumentText className="h-4 w-4" strokeWidth={1.5} /> Download report
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-ink transition-colors"
              aria-label="Close"
            >
              <HiX className="h-5 w-5" />
            </button>

            <p className="eyebrow">2026 Edition</p>
            <h3 className="mt-3 serif text-2xl text-ink leading-tight">
              UAE Real Estate Market Sentiment Report
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Enter your details and we&apos;ll take you straight to the download.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div>
                <p className="label-luxury mb-2">Name</p>
                <input {...register('name')} placeholder="Your full name" className="input-luxury" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <p className="label-luxury mb-2">Phone number</p>
                <input {...register('phone')} placeholder="+971 ..." className="input-luxury" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center disabled:opacity-60">
                <HiOutlineDocumentText className="h-4 w-4" strokeWidth={1.5} />
                {isSubmitting ? 'Preparing...' : 'Download report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
