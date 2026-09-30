'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadService } from '@/services';
import { useSiteSettings } from '@/hooks/useContent';
import toast from 'react-hot-toast';
import { HiPhone, HiMail, HiArrowRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'studio', 'office', 'retail', 'warehouse', 'land', 'building'];

const schema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Required'),
  submitted_purpose: z.enum(['sale', 'rent'], { errorMap: () => ({ message: 'Select an option' }) }),
  submitted_property_type: z.string().min(1, 'Select a property type'),
  submitted_address: z.string().min(5, 'Please provide the property location'),
  submitted_bedrooms: z.number().min(0).optional(),
  submitted_bathrooms: z.number().min(0).optional(),
  submitted_area_sqft: z.number().positive().optional(),
  asking_price: z.number().positive().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ListPropertyPageClient() {
  const { data: settings } = useSiteSettings();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await leadService.create({ ...data, lead_type: 'sell_property' });
      setSent(true);
      reset();
    } catch {
      toast.error('Failed to submit your property. Please try again.');
    }
  };

  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || '';
  const whatsapp = settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || '';
  const email = settings?.email || 'hello@wolvesint.com';

  const fieldClass = 'mt-2 w-full bg-transparent border-b border-input py-3 text-ink focus:outline-none focus:border-gold';
  const labelClass = 'text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground';

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="pt-40 pb-24 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Sell or let with us</p>
          <h1 className="mt-6 serif text-5xl md:text-8xl leading-[1.02] max-w-4xl">
            List your <em className="not-italic" style={{ color: 'var(--gold-soft)' }}>property.</em>
          </h1>
          <p className="mt-10 max-w-xl text-lg text-white/70 leading-relaxed font-light">
            Share your property&apos;s details below. A senior advisor will review your submission
            and reach out to discuss valuation, marketing, and next steps.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 md:py-32">
        <div className="container-luxe grid gap-16 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <p className="eyebrow">Property submission</p>
            <h2 className="mt-4 serif text-3xl md:text-4xl text-ink">Tell us about your property</h2>

            {sent ? (
              <div className="mt-12 border p-10 bg-cream" style={{ borderColor: 'var(--gold)' }}>
                <p className="eyebrow" style={{ color: 'var(--gold-deep)' }}>Submission received</p>
                <h3 className="mt-4 serif text-3xl text-ink">Thank you.</h3>
                <p className="mt-4 text-muted-foreground">A senior advisor will contact you shortly to discuss your property.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full name</label>
                    <input {...register('name')} className={fieldClass} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email address</label>
                    <input {...register('email')} type="email" className={fieldClass} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input {...register('phone')} className={fieldClass} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>I want to</label>
                    <select {...register('submitted_purpose')} className={fieldClass}>
                      <option value="">Select an option</option>
                      <option value="sale">Sell</option>
                      <option value="rent">Rent Out</option>
                    </select>
                    {errors.submitted_purpose && <p className="text-red-500 text-xs mt-1">{errors.submitted_purpose.message}</p>}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Property type</label>
                    <select {...register('submitted_property_type')} className={fieldClass}>
                      <option value="">Select type</option>
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                    {errors.submitted_property_type && <p className="text-red-500 text-xs mt-1">{errors.submitted_property_type.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Location / address</label>
                    <input {...register('submitted_address')} placeholder="e.g. Downtown Dubai" className={fieldClass} />
                    {errors.submitted_address && <p className="text-red-500 text-xs mt-1">{errors.submitted_address.message}</p>}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <input {...register('submitted_bedrooms', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <input {...register('submitted_bathrooms', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Area (sqft)</label>
                    <input {...register('submitted_area_sqft', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Asking price (AED)</label>
                    <input {...register('asking_price', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Additional details</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className={`${fieldClass} placeholder:text-muted-foreground resize-none`}
                    placeholder="Anything else we should know — condition, tenancy status, preferred timeline…"
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-60">
                  {isSubmitting ? 'Submitting...' : 'Submit property'} <HiArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <aside className="lg:col-span-5 lg:col-start-8 space-y-10">
            <div>
              <p className="eyebrow">Prefer to talk?</p>
              <div className="mt-6 space-y-5">
                <ContactRow icon={HiPhone} label="Call" value={phone} href={`tel:${phone}`} />
                <ContactRow icon={FaWhatsapp} label="WhatsApp" value={whatsapp} href={`https://wa.me/${whatsapp}`} />
                <ContactRow icon={HiMail} label="Email" value={email} href={`mailto:${email}`} />
              </div>
            </div>

            <div className="border-t border-border pt-10">
              <p className="eyebrow">How it works</p>
              <ol className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="text-gold-deep font-semibold">01</span> Submit your property details above.</li>
                <li className="flex gap-3"><span className="text-gold-deep font-semibold">02</span> A senior advisor reviews and calls you back.</li>
                <li className="flex gap-3"><span className="text-gold-deep font-semibold">03</span> We arrange valuation, photography, and listing.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof HiPhone; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-start gap-4 group">
      <div className="h-11 w-11 border border-border flex items-center justify-center group-hover:border-gold group-hover:text-gold transition-colors">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-ink group-hover:text-gold transition-colors">{value}</p>
      </div>
    </a>
  );
}
