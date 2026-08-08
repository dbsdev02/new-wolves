'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { amenityService } from '@/services/propertyService';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export function AdminAmenitiesClient() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-amenities'],
    queryFn: () => amenityService.getAll().then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-amenities'] });
    qc.invalidateQueries({ queryKey: ['amenities'] });
  };

  const saveMutation = useMutation({
    mutationFn: (d: any) => editItem ? amenityService.update(editItem.id, d) : amenityService.create(d),
    onSuccess: () => {
      invalidate();
      toast.success(editItem ? 'Updated!' : 'Created!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => amenityService.delete(id),
    onSuccess: () => { invalidate(); toast.success('Deleted.'); },
    onError: () => toast.error('Failed to delete — it may still be assigned to properties.'),
  });

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Amenities</h1>
          <p className="text-gray-500 text-sm mt-1">{(data as any[])?.length || 0} amenities — selectable when adding/editing a property</p>
        </div>
        <button onClick={() => { setEditItem(null); reset({}); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Amenity
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['Name', 'Icon', 'Category', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : ((data as any[]) || []).map((amenity: any) => (
                  <tr key={amenity.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4 text-sm text-luxury-black">{amenity.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{amenity.icon || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{amenity.category || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(amenity)} className="p-1.5 text-gray-400 hover:text-gold transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => confirm(`Delete "${amenity.name}"?`) && deleteMutation.mutate(amenity.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Amenity' : 'Add Amenity'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div><label className={labelClass}>Name *</label><input {...register('name', { required: true })} className={fieldClass} placeholder="e.g. Swimming Pool" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Icon</label><input {...register('icon')} className={fieldClass} placeholder="e.g. pool, gym, wifi" /></div>
                <div><label className={labelClass}>Category</label><input {...register('category')} className={fieldClass} placeholder="e.g. Leisure, Security" /></div>
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
