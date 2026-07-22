'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadService } from '@/services';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiBriefcase } from 'react-icons/hi';

const positions = [
  { title: 'Senior Real Estate Agent', type: 'Full-time', location: 'Dubai, UAE', dept: 'Sales' },
  { title: 'Property Consultant', type: 'Full-time', location: 'Dubai, UAE', dept: 'Sales' },
  { title: 'Marketing Manager', type: 'Full-time', location: 'Dubai, UAE', dept: 'Marketing' },
  { title: 'Digital Marketing Specialist', type: 'Full-time', location: 'Dubai, UAE', dept: 'Marketing' },
  { title: 'Property Manager', type: 'Full-time', location: 'Dubai, UAE', dept: 'Operations' },
  { title: 'Customer Relations Executive', type: 'Full-time', location: 'Dubai, UAE', dept: 'Customer Service' },
];

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  position: z.string().min(1),
  experience_years: z.number().min(0),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CareersPageClient() {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleApply = (position: string) => {
    setSelectedPosition(position);
    setValue('position', position);
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const fd = new window.FormData();
      Object.entries({ ...data, lead_type: 'career' }).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') fd.append(k, String(v));
      });
      if (resumeFile) fd.append('resume', resumeFile);
      await leadService.create(fd);
      toast.success('Application submitted! We will review and contact you.');
      reset();
      setSelectedPosition('');
      setResumeFile(null);
    } catch {
      toast.error('Failed to submit application.');
    }
  };

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Join Our Team</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">Build your career with us.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Build your career with Dubai&apos;s premier real estate consultancy.</p>
        </div>
      </section>

      <div className="container-luxe py-20">
        {/* Why Join Us */}
        <div className="mb-24">
          <div className="max-w-xl mb-12">
            <p className="eyebrow">Why Wolves?</p>
            <h2 className="mt-4 serif text-3xl md:text-4xl text-ink">Why join our team.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Competitive Commission', desc: 'Industry-leading commission structure with uncapped earning potential.' },
              { title: 'Training & Development', desc: 'Continuous learning programs and mentorship from industry experts.' },
              { title: 'Premium Brand', desc: 'Work with a prestigious brand and access to exclusive property listings.' },
            ].map((item) => (
              <div key={item.title} className="border border-border p-8 hover:border-gold transition-colors">
                <HiCheckCircle className="w-7 h-7 mb-5" style={{ color: 'var(--gold-deep)' }} />
                <h3 className="serif text-xl text-ink mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-24">
          <div className="max-w-xl mb-12">
            <p className="eyebrow">Open Roles</p>
            <h2 className="mt-4 serif text-3xl md:text-4xl text-ink">Current openings.</h2>
          </div>
          <div className="space-y-3">
            {positions.map((pos) => (
              <div key={pos.title} className="border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 border border-border">
                    <HiBriefcase className="w-5 h-5" style={{ color: 'var(--gold-deep)' }} />
                  </div>
                  <div>
                    <h3 className="serif text-lg text-ink">{pos.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{pos.dept}</span>
                      <span>•</span>
                      <span>{pos.location}</span>
                      <span>•</span>
                      <span className="text-gold-deep">{pos.type}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleApply(pos.title)} className="btn-gold whitespace-nowrap self-start md:self-auto">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div id="apply-form" className="border border-border p-8 max-w-2xl mx-auto">
          <p className="eyebrow">Application</p>
          <h2 className="mt-4 serif text-2xl text-ink mb-6">Apply Now</h2>
          {selectedPosition && (
            <div className="bg-cream border p-4 mb-6 text-sm text-gold-deep" style={{ borderColor: 'var(--gold)' }}>
              Applying for: <strong>{selectedPosition}</strong>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label-luxury">Full Name *</label>
                <input {...register('name')} className="input-luxury" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label-luxury">Email *</label>
                <input {...register('email')} type="email" className="input-luxury" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label-luxury">Phone *</label>
                <input {...register('phone')} className="input-luxury" />
              </div>
              <div>
                <label className="label-luxury">Years of Experience *</label>
                <input {...register('experience_years', { valueAsNumber: true })} type="number" min={0} className="input-luxury" />
              </div>
            </div>
            <div>
              <label className="label-luxury">Position *</label>
              <select {...register('position')} className="input-luxury appearance-none">
                <option value="">Select Position</option>
                {positions.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
              </select>
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>
            <div>
              <label className="label-luxury">Resume / CV</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="input-luxury file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gold file:text-white file:cursor-pointer file:font-medium"
              />
              {resumeFile && <p className="text-muted-foreground text-xs mt-1">Selected: {resumeFile.name}</p>}
            </div>
            <div>
              <label className="label-luxury">Cover Letter</label>
              <textarea {...register('message')} rows={4} className="input-luxury resize-none" placeholder="Tell us about yourself and why you want to join our team..." />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
