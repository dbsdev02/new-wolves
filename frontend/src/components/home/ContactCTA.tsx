'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiPhone, HiMail, HiArrowRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { leadService } from '@/services';
import { useSiteSettings } from '@/hooks/useContent';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Required'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactCTA() {
  const { data: settings } = useSiteSettings();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await leadService.create({ ...data, lead_type: 'contact' });
      toast.success('Message sent! A senior advisor will be in touch shortly.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || '';
  const whatsapp = settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || '';
  const email = settings?.email || 'hello@wolvesintl.com';

  const contacts = [
    { icon: FaWhatsapp, label: 'WhatsApp', value: 'Click to chat', href: `https://wa.me/${whatsapp}` },
    { icon: HiPhone, label: 'Phone', value: phone, href: `tel:${phone}` },
    { icon: HiMail, label: 'Email', value: email, href: `mailto:${email}` },
  ];

  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--ink)' }}>
      <div className="container-luxe">
        <div className="grid gap-16 lg:grid-cols-2 items-start">

          {/* Left */}
          <div>
            <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Private Consultation</p>
            <h2 className="section-heading-light mt-4">
              Speak with our real estate<br />specialists today.
            </h2>
            <p className="mt-6 text-sm leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Get tailored guidance from a senior advisor. We&apos;re committed to
              assisting you through each phase of your journey — confidentially,
              and without obligation.
            </p>

            <div className="mt-12 space-y-6">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group"
                >
                  <span
                    className="h-12 w-12 flex items-center justify-center border transition-all duration-300 flex-shrink-0"
                    style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                  >
                    <c.icon className="h-4 w-4 text-white group-hover:text-[var(--gold-soft)] transition-colors" />
                  </span>
                  <div>
                    <p className="label-luxury mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.label}</p>
                    <p className="text-sm text-white group-hover:text-[var(--gold-soft)] transition-colors">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 md:p-10 space-y-6"
            style={{ background: 'var(--white)' }}
          >
            <div>
              <p className="label-luxury mb-2">Name</p>
              <input
                {...register('name')}
                placeholder="Your full name"
                className="input-luxury"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="label-luxury mb-2">Email</p>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input-luxury"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <p className="label-luxury mb-2">Phone</p>
                <input
                  {...register('phone')}
                  placeholder="+971 ..."
                  className="input-luxury"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <p className="label-luxury mb-2">Message</p>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Tell us about your requirements..."
                className="input-luxury resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full justify-center disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Submit enquiry'} <HiArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-[0.65rem] tracking-wide" style={{ color: 'var(--muted)' }}>
              We respond within 2 hours during business hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
