'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadService } from '@/services';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone is required'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  propertyId: number;
  propertyTitle: string;
}

const fieldClass = 'w-full bg-white/5 border border-white/15 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors';

export function InquiryForm({ propertyId, propertyTitle }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await leadService.create({
        ...data,
        lead_type: 'property_inquiry',
        property: propertyId,
        message: data.message || `Interested in: ${propertyTitle}`,
      });
      toast.success('Inquiry sent! We will contact you shortly.');
      reset();
    } catch {
      toast.error('Failed to send inquiry. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('name')} placeholder="Full name" className={fieldClass} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('email')} type="email" placeholder="Email" className={fieldClass} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input {...register('phone')} placeholder="Phone" className={fieldClass} />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <textarea {...register('message')} rows={3} placeholder="Preferred viewing time" className={`${fieldClass} resize-none`} />
      <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
        {isSubmitting ? 'Sending...' : 'Request viewing'}
      </button>
    </form>
  );
}
