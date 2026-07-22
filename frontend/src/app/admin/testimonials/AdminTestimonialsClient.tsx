'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { testimonialService } from '@/services/contentService';
import { HiPlus, HiPencil, HiTrash, HiX, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export function AdminTestimonialsClient() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => testimonialService.getAll().then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const saveMutation = useMutation({
    mutationFn: (d: any) => editItem ? api.patch(`/testimonials/${editItem.id}/`, d) : api.post('/testimonials/', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success(editItem ? 'Updated!' : 'Created!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/testimonials/${id}/`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); toast.success('Deleted.'); },
  });

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">{(data as any[])?.length || 0} testimonials</p>
        </div>
        <button onClick={() => { setEditItem(null); reset({}); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse bg-white h-40" />)
          : ((data as any[]) || []).map((item: any) => (
              <div key={item.id} className="bg-white border border-gray-100 p-5 hover:border-gold transition-colors">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, j) => <HiStar key={j} className="w-4 h-4 text-gold" />)}
                </div>
                <p className="text-gray-600 text-sm italic line-clamp-3 mb-4">&quot;{item.content}&quot;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.designation}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-gold transition-colors"><HiPencil className="w-4 h-4" /></button>
                    <button onClick={() => confirm('Delete?') && deleteMutation.mutate(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div><label className={labelClass}>Name *</label><input {...register('name', { required: true })} className={fieldClass} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Designation</label><input {...register('designation')} className={fieldClass} /></div>
                <div><label className={labelClass}>Company</label><input {...register('company')} className={fieldClass} /></div>
              </div>
              <div><label className={labelClass}>Content *</label><textarea {...register('content', { required: true })} rows={4} className={`${fieldClass} resize-none`} /></div>
              <div>
                <label className={labelClass}>Rating</label>
                <select {...register('rating', { valueAsNumber: true })} className={`${fieldClass} appearance-none`}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Order</label><input {...register('order', { valueAsNumber: true })} type="number" min={0} className={fieldClass} /></div>
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
