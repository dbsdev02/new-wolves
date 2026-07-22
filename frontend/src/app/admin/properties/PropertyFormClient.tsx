'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { useCommunities, useDevelopers, useAgents } from '@/hooks/useContent';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import api from '@/lib/api';

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  property_type: z.string().min(1),
  purpose: z.string().min(1),
  status: z.string().min(1),
  completion_status: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().default('AED'),
  area_sqft: z.number().positive(),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  parking_spaces: z.number().min(0).default(0),
  address: z.string().min(5),
  city: z.string().default('Dubai'),
  community: z.number().optional().nullable(),
  developer: z.number().optional().nullable(),
  agent: z.number().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_hot: z.boolean().default(false),
  is_luxury: z.boolean().default(false),
  is_new_launch: z.boolean().default(false),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  video_url: z.string().optional(),
  virtual_tour_url: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface Props { propertyId?: number }

export function PropertyFormClient({ propertyId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!propertyId;

  const { data: communities } = useCommunities({ page_size: 200 });
  const { data: developers } = useDevelopers({ page_size: 200 });
  const { data: agents } = useAgents({ page_size: 200 });

  const { data: existingProperty } = useQuery({
    queryKey: ['property-edit', propertyId],
    queryFn: () => api.get(`/properties/${propertyId}/`).then(r => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'AED', city: 'Dubai', bedrooms: 0, bathrooms: 0, parking_spaces: 0 },
  });

  useEffect(() => {
    if (existingProperty) {
      reset({
        ...existingProperty,
        community: existingProperty.community || null,
        developer: existingProperty.developer || null,
        agent: existingProperty.agent || null,
        price: Number(existingProperty.price),
        area_sqft: Number(existingProperty.area_sqft),
      });
    }
  }, [existingProperty, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') formData.append(k, String(v));
      });
      if (isEdit) {
        return propertyService.update(existingProperty.slug, formData);
      }
      return propertyService.create(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-properties'] });
      toast.success(isEdit ? 'Property updated!' : 'Property created!');
      router.push('/admin/properties');
    },
    onError: () => toast.error('Failed to save property.'),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 border border-gray-200 hover:border-gold transition-colors">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Update property details' : 'Fill in the details to list a new property'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Basic Information</h2>
          <div>
            <label className={labelClass}>Title *</label>
            <input {...register('title')} className={fieldClass} placeholder="e.g. Luxury 3BR Apartment in Downtown Dubai" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea {...register('description')} rows={5} className={`${fieldClass} resize-none`} placeholder="Detailed property description..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Property Type *</label>
              <select {...register('property_type')} className={`${fieldClass} appearance-none`}>
                <option value="">Select Type</option>
                {['apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'studio', 'office', 'retail', 'warehouse', 'land', 'building'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Purpose *</label>
              <select {...register('purpose')} className={`${fieldClass} appearance-none`}>
                <option value="">Select Purpose</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="off_plan">Off Plan</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status *</label>
              <select {...register('status')} className={`${fieldClass} appearance-none`}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Completion Status</label>
            <select {...register('completion_status')} className={`${fieldClass} appearance-none`}>
              <option value="ready">Ready</option>
              <option value="off_plan">Off Plan</option>
              <option value="under_construction">Under Construction</option>
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Price *</label>
              <input {...register('price', { valueAsNumber: true })} type="number" className={fieldClass} placeholder="e.g. 2500000" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select {...register('currency')} className={`${fieldClass} appearance-none`}>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Property Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Bedrooms *</label>
              <input {...register('bedrooms', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Bathrooms *</label>
              <input {...register('bathrooms', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Area (sqft) *</label>
              <input {...register('area_sqft', { valueAsNumber: true })} type="number" className={fieldClass} />
              {errors.area_sqft && <p className="text-red-500 text-xs mt-1">{errors.area_sqft.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Parking</label>
              <input {...register('parking_spaces', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Location</h2>
          <div>
            <label className={labelClass}>Address *</label>
            <input {...register('address')} className={fieldClass} placeholder="Full address" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>City</label>
              <input {...register('city')} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Community</label>
              <select {...register('community', { valueAsNumber: true })} className={`${fieldClass} appearance-none`}>
                <option value="">Select Community</option>
                {communities?.results?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Developer</label>
              <select {...register('developer', { valueAsNumber: true })} className={`${fieldClass} appearance-none`}>
                <option value="">Select Developer</option>
                {developers?.results?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Latitude</label>
              <input {...register('latitude', { valueAsNumber: true })} type="number" step="any" className={fieldClass} placeholder="25.2048" />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input {...register('longitude', { valueAsNumber: true })} type="number" step="any" className={fieldClass} placeholder="55.2708" />
            </div>
          </div>
        </div>

        {/* Agent & Flags */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Agent & Flags</h2>
          <div>
            <label className={labelClass}>Assigned Agent</label>
            <select {...register('agent', { valueAsNumber: true })} className={`${fieldClass} appearance-none`}>
              <option value="">Select Agent</option>
              {agents?.results?.map((a: any) => <option key={a.id} value={a.id}>{a.first_name} {a.last_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'is_featured', label: 'Featured' },
              { name: 'is_hot', label: 'Hot Property' },
              { name: 'is_luxury', label: 'Luxury' },
              { name: 'is_new_launch', label: 'New Launch' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input {...register(name as any)} type="checkbox" className="accent-gold w-4 h-4" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">SEO</h2>
          <div>
            <label className={labelClass}>Meta Title</label>
            <input {...register('meta_title')} className={fieldClass} placeholder="SEO title (max 60 chars)" />
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea {...register('meta_description')} rows={3} className={`${fieldClass} resize-none`} placeholder="SEO description (max 160 chars)" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={isSubmitting} className="btn-gold px-10 py-4 disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
          </button>
          <Link href="/admin/properties" className="btn-outline-gold px-8 py-4">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
