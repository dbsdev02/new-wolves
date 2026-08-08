'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { useCommunities, useDevelopers, useAgents, useAmenities } from '@/hooks/useContent';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { getMediaUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft, HiX } from 'react-icons/hi';

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
  min_bedrooms: z.number().min(0),
  max_bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  parking_spaces: z.number().min(0).default(0),
  address: z.string().min(5),
  city: z.string().default('Dubai'),
  dld_permit_number: z.string().optional(),
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
  google_maps_url: z.string().optional(),
}).refine((data) => data.max_bedrooms >= data.min_bedrooms, {
  message: 'Max bedrooms must be greater than or equal to min bedrooms',
  path: ['max_bedrooms'],
});

type FormData = z.infer<typeof schema>;

interface Props { slug?: string }

export function PropertyFormClient({ slug }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!slug;

  const { data: communities } = useCommunities({ page_size: 200 });
  const { data: developers } = useDevelopers({ page_size: 200 });
  const { data: agents } = useAgents({ page_size: 200 });
  const { data: amenities } = useAmenities();
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const { data: existingProperty } = useQuery({
    queryKey: ['property-edit', slug],
    queryFn: () => propertyService.getBySlug(slug!).then(r => r.data as any),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'AED', city: 'Dubai', min_bedrooms: 0, max_bedrooms: 0, bathrooms: 0, parking_spaces: 0 },
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
      setSelectedAmenities((existingProperty.amenities || []).map((a: any) => a.id));
    }
  }, [existingProperty, reset]);

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') formData.append(k, String(v));
      });
      if (selectedAmenities.length > 0) {
        selectedAmenities.forEach((id) => formData.append('amenity_ids', String(id)));
      } else if (isEdit) {
        formData.append('clear_amenities', 'true');
      }
      if (featuredImage) formData.append('featured_image', featuredImage);
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

  const uploadGalleryMutation = useMutation({
    mutationFn: (files: FileList) => {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      return propertyService.uploadImages(existingProperty.slug, fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['property-edit', slug] });
      toast.success('Photos added to gallery.');
    },
    onError: () => toast.error('Failed to upload gallery photos.'),
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: (imageId: number) => propertyService.deleteImage(existingProperty.slug, imageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['property-edit', slug] });
      toast.success('Photo removed.');
    },
    onError: () => toast.error('Failed to remove photo.'),
  });

  const [floorPlanTitle, setFloorPlanTitle] = useState('');
  const [floorPlanImage, setFloorPlanImage] = useState<File | null>(null);
  const [floorPlanPdf, setFloorPlanPdf] = useState<File | null>(null);

  const addFloorPlanMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('title', floorPlanTitle || 'Floor Plan');
      if (floorPlanImage) fd.append('image', floorPlanImage);
      if (floorPlanPdf) fd.append('pdf', floorPlanPdf);
      return propertyService.addFloorPlan(existingProperty.slug, fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['property-edit', slug] });
      toast.success('Floor plan added.');
      setFloorPlanTitle(''); setFloorPlanImage(null); setFloorPlanPdf(null);
    },
    onError: () => toast.error('Failed to add floor plan — provide an image or a PDF.'),
  });

  const deleteFloorPlanMutation = useMutation({
    mutationFn: (planId: number) => propertyService.deleteFloorPlan(existingProperty.slug, planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['property-edit', slug] });
      toast.success('Floor plan removed.');
    },
    onError: () => toast.error('Failed to remove floor plan.'),
  });

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

        {/* Media */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Media</h2>
          <ImageUploadField
            label="Featured Image"
            file={featuredImage}
            onChange={setFeaturedImage}
            existingUrl={existingProperty?.featured_image}
          />

          <div>
            <label className={labelClass}>Gallery Photos</label>
            {isEdit ? (
              <>
                {existingProperty?.images?.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                    {existingProperty.images.map((img: any) => (
                      <div key={img.id} className="relative aspect-square bg-gray-100 group overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getMediaUrl(img.image)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => deleteGalleryImageMutation.mutate(img.id)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => { if (e.target.files?.length) uploadGalleryMutation.mutate(e.target.files); e.target.value = ''; }}
                  className={fieldClass}
                />
              </>
            ) : (
              <p className="text-xs text-gray-400">Save the property first, then come back here to add gallery photos.</p>
            )}
          </div>
        </div>

        {/* Floor Plans */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Floor Plans</h2>
          {isEdit ? (
            <>
              {existingProperty?.floor_plans?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {existingProperty.floor_plans.map((fp: any) => (
                    <div key={fp.id} className="flex items-center justify-between gap-3 border border-gray-100 p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-luxury-black truncate">{fp.title}</p>
                        <div className="flex gap-3 mt-1 text-xs">
                          {fp.image && <a href={getMediaUrl(fp.image)} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">View Image</a>}
                          {fp.pdf && <a href={getMediaUrl(fp.pdf)} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">View PDF</a>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteFloorPlanMutation.mutate(fp.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input value={floorPlanTitle} onChange={(e) => setFloorPlanTitle(e.target.value)} className={fieldClass} placeholder="e.g. 2 Bedroom Type A" />
                </div>
                <div>
                  <label className={labelClass}>Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setFloorPlanImage(e.target.files?.[0] || null)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>PDF</label>
                  <input type="file" accept="application/pdf" onChange={(e) => setFloorPlanPdf(e.target.files?.[0] || null)} className={fieldClass} />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={addFloorPlanMutation.isPending || (!floorPlanImage && !floorPlanPdf)}
                    onClick={() => addFloorPlanMutation.mutate()}
                    className="btn-gold w-full py-2.5 disabled:opacity-50"
                  >
                    {addFloorPlanMutation.isPending ? 'Adding...' : 'Add Floor Plan'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400">Save the property first, then come back here to add floor plans.</p>
          )}
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <div>
              <label className={labelClass}>Min Bedrooms *</label>
              <input {...register('min_bedrooms', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Max Bedrooms *</label>
              <input {...register('max_bedrooms', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
              {errors.max_bedrooms && <p className="text-red-500 text-xs mt-1">{errors.max_bedrooms.message}</p>}
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
          <div>
            <label className={labelClass}>DLD Permit Number</label>
            <input {...register('dld_permit_number')} className={fieldClass} placeholder="e.g. 65449649338" />
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
          <div>
            <label className={labelClass}>Google Maps URL</label>
            <input {...register('google_maps_url')} className={fieldClass} placeholder="https://www.google.com/maps/place/..." />
            <p className="text-xs text-gray-400 mt-1">Paste a Google Maps link (from the &ldquo;Share&rdquo; button, not a shortened one) — the pin location is extracted automatically.</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-display font-bold text-lg">Amenities</h2>
            <Link href="/admin/amenities" target="_blank" className="text-xs text-gold hover:underline">Manage amenities list →</Link>
          </div>
          {(amenities as any[])?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(amenities as any[]).map((a: any) => (
                <label key={a.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="accent-gold w-4 h-4"
                    checked={selectedAmenities.includes(a.id)}
                    onChange={() => toggleAmenity(a.id)}
                  />
                  {a.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No amenities yet — add some in the Amenities section first.</p>
          )}
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
