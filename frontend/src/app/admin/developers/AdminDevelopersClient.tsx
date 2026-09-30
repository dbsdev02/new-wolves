'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { developerService } from '@/services/contentService';
import { getMediaUrl, normalizeIfUrlField } from '@/lib/utils';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export function AdminDevelopersClient() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-developers'],
    queryFn: () => developerService.getAll({ page_size: 100 }).then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const saveMutation = useMutation({
    mutationFn: (fd: FormData) => editItem ? developerService.update(editItem.slug, fd) : developerService.create(fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-developers'] });
      toast.success(editItem ? 'Developer updated!' : 'Developer created!');
      setShowForm(false); setEditItem(null); setLogo(null); setCoverImage(null); reset();
    },
    onError: (err: any) => {
      const msg = err?.response?.data;
      toast.error(msg ? JSON.stringify(msg) : 'Failed to save.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => developerService.delete(slug),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-developers'] }); toast.success('Deleted.'); },
  });

  const onSubmit = (data: any) => {
    const fd = new FormData();
    if (data.name) fd.append('name', data.name);
    if (data.short_description) fd.append('short_description', data.short_description);
    if (data.description) fd.append('description', data.description);
    if (data.headquarters) fd.append('headquarters', data.headquarters);
    if (data.website) fd.append('website', normalizeIfUrlField('website', data.website));
    if (data.meta_title) fd.append('meta_title', data.meta_title);
    if (data.meta_description) fd.append('meta_description', data.meta_description);
    if (!isNaN(data.founded_year) && data.founded_year) fd.append('founded_year', String(data.founded_year));
    if (!isNaN(data.total_projects)) fd.append('total_projects', String(data.total_projects || 0));
    if (!isNaN(data.total_units)) fd.append('total_units', String(data.total_units || 0));
    if (!isNaN(data.order)) fd.append('order', String(data.order || 0));
    fd.append('is_featured', data.is_featured ? 'true' : 'false');
    fd.append('is_active', data.is_active ? 'true' : 'false');
    if (logo) fd.append('logo', logo);
    if (coverImage) fd.append('cover_image', coverImage);
    saveMutation.mutate(fd);
  };

  const openEdit = async (item: any) => {
    setLogo(null);
    setCoverImage(null);
    // The list only returns a summary (missing is_active, etc.) — fetch the
    // full record so the form doesn't silently reset fields it never saw.
    try {
      const { data: full } = await developerService.getBySlug(item.slug);
      setEditItem(full);
      reset(full);
    } catch {
      setEditItem(item);
      reset(item);
    }
    setShowForm(true);
  };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Developers</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.results?.length || 0} developers</p>
        </div>
        <button onClick={() => { setEditItem(null); setLogo(null); setCoverImage(null); reset({ is_active: true, order: 0 }); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Developer
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['Order', 'Developer', 'Projects', 'Units', 'Featured', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : (data?.results || []).map((dev: any) => (
                  <tr key={dev.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{dev.order ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {dev.logo && (
                          <div className="relative w-16 h-10 flex-shrink-0">
                            <Image src={getMediaUrl(dev.logo)} alt={dev.name} fill className="object-contain" sizes="64px" />
                          </div>
                        )}
                        <div className="font-medium text-sm">{dev.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{dev.total_projects}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{dev.total_units?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${dev.is_featured ? 'bg-gold/20 text-gold' : 'bg-gray-100 text-gray-500'}`}>
                        {dev.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(dev)} className="p-1.5 text-gray-400 hover:text-gold transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => confirm(`Delete "${dev.name}"?`) && deleteMutation.mutate(dev.slug)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
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
          <div className="relative bg-white w-full max-w-xl p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Developer' : 'Add Developer'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Name *</label><input {...register('name', { required: true })} className={fieldClass} /></div>
                <div>
                  <label className={labelClass}>Order</label>
                  <input {...register('order', { valueAsNumber: true })} type="number" min={0} className={fieldClass} placeholder="0 = shown first" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ImageUploadField label="Logo" file={logo} onChange={setLogo} existingUrl={editItem?.logo} />
                <ImageUploadField label="Cover Image" file={coverImage} onChange={setCoverImage} existingUrl={editItem?.cover_image} />
              </div>
              <div><label className={labelClass}>Short Description</label><textarea {...register('short_description')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div><label className={labelClass}>Description</label><textarea {...register('description')} rows={4} className={`${fieldClass} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Founded Year</label><input {...register('founded_year', { valueAsNumber: true })} type="number" className={fieldClass} /></div>
                <div><label className={labelClass}>Headquarters</label><input {...register('headquarters')} className={fieldClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Total Projects</label><input {...register('total_projects', { valueAsNumber: true })} type="number" min={0} className={fieldClass} /></div>
                <div><label className={labelClass}>Total Units</label><input {...register('total_units', { valueAsNumber: true })} type="number" min={0} className={fieldClass} /></div>
              </div>
              <div><label className={labelClass}>Website</label><input {...register('website')} className={fieldClass} /></div>
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
