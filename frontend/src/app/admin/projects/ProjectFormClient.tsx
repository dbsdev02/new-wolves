'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/contentService';
import { useCommunities, useDevelopers } from '@/hooks/useContent';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import api from '@/lib/api';

interface Props { projectId?: number }

interface ProjectFormValues {
  name: string;
  short_description: string;
  description: string;
  status: string;
  developer: string;
  community: string;
  min_price: number | null;
  max_price: number | null;
  currency: string;
  total_units: number;
  available_units: number;
  completion_date: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  video_url: string;
  is_featured: boolean;
  is_active: boolean;
}

export function ProjectFormClient({ projectId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!projectId;

  const { data: communities } = useCommunities({ page_size: 200 });
  const { data: developers } = useDevelopers({ page_size: 200 });

  const { data: existing } = useQuery({
    queryKey: ['project-edit', projectId],
    queryFn: () => api.get(`/projects/${projectId}/`).then(r => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    defaultValues: { status: 'upcoming', currency: 'AED', total_units: 0, available_units: 0 },
  });

  useEffect(() => {
    if (existing) reset({ ...existing, developer: existing.developer || '', community: existing.community || '' });
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') fd.append(k, String(v)); });
      if (isEdit) return projectService.update(existing.slug, fd);
      return projectService.create(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success(isEdit ? 'Project updated!' : 'Project created!');
      router.push('/admin/projects');
    },
    onError: () => toast.error('Failed to save project.'),
  });

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 border border-gray-200 hover:border-gold transition-colors">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Basic Information</h2>
          <div>
            <label className={labelClass}>Project Name *</label>
            <input {...register('name', { required: true })} className={fieldClass} />
            {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
          </div>
          <div>
            <label className={labelClass}>Short Description</label>
            <textarea {...register('short_description')} rows={2} className={`${fieldClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea {...register('description')} rows={5} className={`${fieldClass} resize-none`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Status</label>
              <select {...register('status')} className={`${fieldClass} appearance-none`}>
                <option value="upcoming">Upcoming</option>
                <option value="under_construction">Under Construction</option>
                <option value="ready">Ready</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Developer</label>
              <select {...register('developer')} className={`${fieldClass} appearance-none`}>
                <option value="">Select Developer</option>
                {developers?.results?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Community</label>
              <select {...register('community')} className={`${fieldClass} appearance-none`}>
                <option value="">Select Community</option>
                {communities?.results?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Pricing & Units</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Min Price</label>
              <input {...register('min_price', { valueAsNumber: true })} type="number" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Max Price</label>
              <input {...register('max_price', { valueAsNumber: true })} type="number" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select {...register('currency')} className={`${fieldClass} appearance-none`}>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Total Units</label>
              <input {...register('total_units', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Available Units</label>
              <input {...register('available_units', { valueAsNumber: true })} type="number" min={0} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Completion Date</label>
              <input {...register('completion_date')} type="date" className={fieldClass} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Location & Media</h2>
          <div>
            <label className={labelClass}>Address</label>
            <input {...register('address')} className={fieldClass} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Latitude</label>
              <input {...register('latitude', { valueAsNumber: true })} type="number" step="any" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input {...register('longitude', { valueAsNumber: true })} type="number" step="any" className={fieldClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Video URL</label>
            <input {...register('video_url')} className={fieldClass} placeholder="YouTube or Vimeo URL" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('is_featured')} type="checkbox" className="accent-gold" />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('is_active')} type="checkbox" className="accent-gold" defaultChecked />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={isSubmitting} className="btn-gold px-10 py-4 disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <Link href="/admin/projects" className="btn-outline-gold px-8 py-4">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
