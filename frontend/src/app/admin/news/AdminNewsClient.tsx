'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { newsItemService, tickerStatService } from '@/services/contentService';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export function AdminNewsClient() {
  const [tab, setTab] = useState<'headlines' | 'stats'>('headlines');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-luxury-black">News Ticker</h1>
        <p className="text-gray-500 text-sm mt-1">Scrolling headlines and stats shown above the footer on the homepage</p>
      </div>

      <div className="flex gap-6 border-b border-gray-100">
        {(['headlines', 'stats'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
              tab === t ? 'text-gold border-gold' : 'text-gray-400 border-transparent hover:text-luxury-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'headlines' ? <HeadlinesPanel /> : <StatsPanel />}
    </div>
  );
}

function HeadlinesPanel() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-news-items'],
    queryFn: () => newsItemService.getAll().then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-news-items'] });
    qc.invalidateQueries({ queryKey: ['news-items'] });
  };

  const saveMutation = useMutation({
    mutationFn: (d: any) => editItem ? newsItemService.update(editItem.id, d) : newsItemService.create(d),
    onSuccess: () => {
      invalidate();
      toast.success(editItem ? 'Updated!' : 'Created!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => newsItemService.delete(id),
    onSuccess: () => { invalidate(); toast.success('Deleted.'); },
  });

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setEditItem(null); reset({ is_active: true }); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Headline
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['Headline', 'Order', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : ((data as any[]) || []).map((item: any) => (
                  <tr key={item.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4 text-sm text-luxury-black max-w-[400px] truncate">{item.headline}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.order}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-gold transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => confirm('Delete this headline?') && deleteMutation.mutate(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
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
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Headline' : 'Add Headline'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div><label className={labelClass}>Headline *</label><input {...register('headline', { required: true })} className={fieldClass} placeholder="e.g. Dubai property market stays resilient in H1 2026" /></div>
              <div><label className={labelClass}>Link (optional)</label><input {...register('link')} className={fieldClass} placeholder="https://... (makes the headline clickable)" /></div>
              <div><label className={labelClass}>Order</label><input {...register('order', { valueAsNumber: true })} type="number" min={0} className={fieldClass} /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('is_active')} type="checkbox" className="accent-gold" defaultChecked />
                <span className="text-sm">Active</span>
              </label>
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

function StatsPanel() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ticker-stats'],
    queryFn: () => tickerStatService.getAll().then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-ticker-stats'] });
    qc.invalidateQueries({ queryKey: ['ticker-stats'] });
  };

  const saveMutation = useMutation({
    mutationFn: (d: any) => editItem ? tickerStatService.update(editItem.id, d) : tickerStatService.create(d),
    onSuccess: () => {
      invalidate();
      toast.success(editItem ? 'Updated!' : 'Created!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tickerStatService.delete(id),
    onSuccess: () => { invalidate(); toast.success('Deleted.'); },
  });

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setEditItem(null); reset({ is_active: true }); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Stat
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['Label', 'Value', 'Order', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : ((data as any[]) || []).map((stat: any) => (
                  <tr key={stat.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4 text-sm text-luxury-black">{stat.label}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stat.value}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stat.order}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${stat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {stat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(stat)} className="p-1.5 text-gray-400 hover:text-gold transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => confirm(`Delete "${stat.label}"?`) && deleteMutation.mutate(stat.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
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
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Stat' : 'Add Stat'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div><label className={labelClass}>Label *</label><input {...register('label', { required: true })} className={fieldClass} placeholder="e.g. Total Sales" /></div>
              <div><label className={labelClass}>Value *</label><input {...register('value', { required: true })} className={fieldClass} placeholder="e.g. 1.02B" /></div>
              <div><label className={labelClass}>Order</label><input {...register('order', { valueAsNumber: true })} type="number" min={0} className={fieldClass} /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('is_active')} type="checkbox" className="accent-gold" defaultChecked />
                <span className="text-sm">Active</span>
              </label>
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
