'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadService } from '@/services';
import { useSiteSettings } from '@/hooks/useContent';
import toast from 'react-hot-toast';
import { HiPhone, HiMail, HiLocationMarker, HiClock, HiArrowRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const schema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Required'),
  nationality: z.string().optional(),
  lead_type: z.string().default('contact'),
  message: z.string().min(10, 'Please share a few more details'),
});

type FormData = z.infer<typeof schema>;

export function ContactPageClient() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'contact';
  const { data: settings } = useSiteSettings();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { lead_type: defaultType },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await leadService.create(data);
      setSent(true);
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || '';
  const whatsapp = settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || '';
  const email = settings?.email || 'hello@wolvesintl.com';
  const address = settings?.address || 'Level 42, Emirates Towers, Sheikh Zayed Road, Dubai, UAE';

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="pt-40 pb-24 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Get in touch</p>
          <h1 className="mt-6 serif text-5xl md:text-8xl leading-[1.02] max-w-4xl">
            A conversation, <em className="not-italic" style={{ color: 'var(--gold-soft)' }}>in confidence.</em>
          </h1>
          <p className="mt-10 max-w-xl text-lg text-white/70 leading-relaxed font-light">
            Tell us a little about what you&apos;re looking for. A senior advisor
            will be in touch within the hour, seven days a week.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 md:py-32">
        <div className="container-luxe grid gap-16 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <p className="eyebrow">Enquiry form</p>
            <h2 className="mt-4 serif text-3xl md:text-4xl text-ink">Share your requirements</h2>

            {sent ? (
              <div className="mt-12 border p-10 bg-cream" style={{ borderColor: 'var(--gold)' }}>
                <p className="eyebrow" style={{ color: 'var(--gold-deep)' }}>Message received</p>
                <h3 className="mt-4 serif text-3xl text-ink">Thank you.</h3>
                <p className="mt-4 text-muted-foreground">A senior advisor will contact you within the hour.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Full name</label>
                    <input {...register('name')} className="mt-2 w-full bg-transparent border-b border-input py-3 text-ink focus:outline-none focus:border-gold" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Email address</label>
                    <input {...register('email')} type="email" className="mt-2 w-full bg-transparent border-b border-input py-3 text-ink focus:outline-none focus:border-gold" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Phone</label>
                    <input {...register('phone')} className="mt-2 w-full bg-transparent border-b border-input py-3 text-ink focus:outline-none focus:border-gold" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Nationality</label>
                    <input {...register('nationality')} className="mt-2 w-full bg-transparent border-b border-input py-3 text-ink focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Interest</label>
                  <select {...register('lead_type')} className="mt-2 w-full bg-transparent border-b border-input py-3 text-ink focus:outline-none focus:border-gold">
                    <option value="contact">General Inquiry</option>
                    <option value="property_inquiry">Buying a residence</option>
                    <option value="schedule_visit">Schedule a Visit</option>
                    <option value="mortgage">Mortgage Inquiry</option>
                    <option value="general">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Message</label>
                  <textarea {...register('message')} rows={5} className="mt-2 w-full bg-transparent border-b border-input py-3 text-ink placeholder:text-muted-foreground focus:outline-none focus:border-gold resize-none" placeholder="Tell us about your search…" />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-60">
                  {isSubmitting ? 'Sending...' : 'Send enquiry'} <HiArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <aside className="lg:col-span-5 lg:col-start-8 space-y-10">
            <div>
              <p className="eyebrow">Speak directly</p>
              <div className="mt-6 space-y-5">
                <ContactRow icon={HiPhone} label="Call" value={phone} href={`tel:${phone}`} />
                <ContactRow icon={FaWhatsapp} label="WhatsApp" value={whatsapp} href={`https://wa.me/${whatsapp}`} />
                <ContactRow icon={HiMail} label="Email" value={email} href={`mailto:${email}`} />
              </div>
            </div>

            <div className="border-t border-border pt-10">
              <p className="eyebrow">Visit us</p>
              <div className="mt-6 flex gap-4">
                <HiLocationMarker className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-deep)' }} />
                <address className="not-italic text-ink leading-relaxed">{address}</address>
              </div>
            </div>

            <div className="border-t border-border pt-10">
              <p className="eyebrow">Hours</p>
              <div className="mt-6 flex gap-4 text-ink">
                <HiClock className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-deep)' }} />
                <div>
                  <p>{settings?.working_hours || 'Monday — Saturday · 9:00 — 20:00'}</p>
                  <p className="text-muted-foreground text-sm mt-1">Sundays by appointment</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="aspect-[21/9] w-full bg-ink relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 40%, oklch(0.75 0.13 82) 0%, transparent 40%), radial-gradient(circle at 70% 60%, oklch(0.28 0.03 260) 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <HiLocationMarker className="h-10 w-10 mx-auto" style={{ color: 'var(--gold)' }} />
            <p className="mt-4 serif text-3xl">{address}</p>
          </div>
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
