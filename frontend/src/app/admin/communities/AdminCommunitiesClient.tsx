'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { communityService } from '@/services/contentService';
import { getMediaUrl } from '@/lib/utils';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export function AdminCommunitiesClient() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-communities'],
    queryFn: () => communityService.getAll({ page_size: 100 }).then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const saveMutation = useMutation({
    mutationFn: (fd: FormData) => editItem ? communityService.update(editItem.slug, fd) : communityService.create(fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-communities'] });
      toast.success(editItem ? 'Community updated!' : 'Community created!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => communityService.delete(slug),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-communities'] }); toast.success('Deleted.'); },
  });

  const onSubmit = (data: any) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') fd.append(k, String(v)); });
    saveMutation.mutate(fd);
  };

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Communities</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.results?.length || 0} communities</p>
        </div>
        <button onClick={() => { setEditItem(null); reset({}); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Community
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse bg-white h-40" />)
          : (data?.results || []).map((community: any) => (
              <div key={community.id} className="bg-white border border-gray-100 overflow-hidden hover:border-gold transition-colors">
                {community.image && (
                  <div className="relative h-32 overflow-hidden">
                    <Image src={getMediaUrl(community.image)} alt={community.name} fill className="object-cover" sizes="400px" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{community.name}</h3>
                    <span className="text-xs text-gold">{community.total_properties} props</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{community.city}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(community)} className="flex-1 flex items-center justify-center gap-1 p-2 border border-gray-200 hover:border-gold hover:text-gold transition-colors text-xs">
                      <HiPencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => confirm(`Delete "${community.name}"?`) && deleteMutation.mutate(community.slug)} className="p-2 border border-gray-200 hover:border-red-400 hover:text-red-500 transition-colors">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-xl p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Community' : 'Add Community'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div><label className={labelClass}>Name *</label><input {...register('name', { required: true })} className={fieldClass} /></div>
              <div><label className={labelClass}>City</label><input {...register('city')} className={fieldClass} defaultValue="Dubai" /></div>
              <div><label className={labelClass}>Short Description</label><textarea {...register('short_description')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div><label className={labelClass}>Description</label><textarea {...register('description')} rows={4} className={`${fieldClass} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Latitude</label><input {...register('latitude', { valueAsNumber: true })} type="number" step="any" className={fieldClass} /></div>
                <div><label className={labelClass}>Longitude</label><input {...register('longitude', { valueAsNumber: true })} type="number" step="any" className={fieldClass} /></div>
              </div>
              <div><label className={labelClass}>Nearby Schools</label><textarea {...register('nearby_schools')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div><label className={labelClass}>Nearby Hospitals</label><textarea {...register('nearby_hospitals')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div><label className={labelClass}>Nearby Metro</label><textarea {...register('nearby_metro')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div><label className={labelClass}>Nearby Malls</label><textarea {...register('nearby_malls')} rows={2} className={`${fieldClass} resize-none`} /></div>
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
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 py-3 disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : editItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-6 py-3">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
