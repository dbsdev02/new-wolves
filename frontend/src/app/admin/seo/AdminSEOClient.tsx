'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { seoService } from '@/services';
import { HiPlus, HiPencil, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export function AdminSEOClient() {
  const [tab, setTab] = useState<'pages' | 'redirects'>('pages');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-seo'],
    queryFn: () => seoService.getAll().then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const saveMutation = useMutation({
    mutationFn: (data: any) => editItem
      ? seoService.update(editItem.id, data)
      : api.post('/seo/pages/', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-seo'] });
      toast.success('SEO page saved!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save.'),
  });

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">SEO Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage meta tags, Open Graph, schema markup, and redirects</p>
        </div>
        {tab === 'pages' && (
          <button onClick={() => { setEditItem(null); reset({}); setShowForm(true); }} className="btn-gold gap-2">
            <HiPlus className="w-5 h-5" /> Add SEO Page
          </button>
        )}
      </div>

      <div className="flex gap-1 border-b border-gray-100">
        {(['pages', 'redirects'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gold'
            }`}
          >
            {t === 'pages' ? 'SEO Pages' : 'Redirect Manager'}
          </button>
        ))}
      </div>

      {tab === 'redirects' && <RedirectManager />}
      {tab === 'pages' && (
      <>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['Page', 'Title', 'Robots', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : ((data as any)?.results || data || []).map((page: any) => (
                  <tr key={page.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gold">{page.page_identifier}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{page.meta_title || page.title}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{page.robots}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${page.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {page.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => openEdit(page)} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                        <HiPencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit SEO Page' : 'Add SEO Page'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div><label className={labelClass}>Page Identifier *</label><input {...register('page_identifier', { required: true })} className={fieldClass} placeholder="e.g. home, about, properties" /></div>
              <div><label className={labelClass}>Title</label><input {...register('title')} className={fieldClass} /></div>
              <div><label className={labelClass}>Meta Title</label><input {...register('meta_title')} className={fieldClass} placeholder="Max 60 characters" /></div>
              <div><label className={labelClass}>Meta Description</label><textarea {...register('meta_description')} rows={3} className={`${fieldClass} resize-none`} placeholder="Max 160 characters" /></div>
              <div><label className={labelClass}>Meta Keywords</label><input {...register('meta_keywords')} className={fieldClass} placeholder="keyword1, keyword2, ..." /></div>
              <div><label className={labelClass}>Canonical URL</label><input {...register('canonical_url')} className={fieldClass} /></div>
              <div><label className={labelClass}>OG Title</label><input {...register('og_title')} className={fieldClass} /></div>
              <div><label className={labelClass}>OG Description</label><textarea {...register('og_description')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div><label className={labelClass}>Twitter Title</label><input {...register('twitter_title')} className={fieldClass} /></div>
              <div><label className={labelClass}>Twitter Description</label><textarea {...register('twitter_description')} rows={2} className={`${fieldClass} resize-none`} /></div>
              <div>
                <label className={labelClass}>Robots</label>
                <select {...register('robots')} className={`${fieldClass} appearance-none`}>
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('is_active')} type="checkbox" className="accent-gold" defaultChecked />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 py-3 disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : 'Save SEO Page'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-6 py-3">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}

function RedirectManager() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-redirects'],
    queryFn: () => api.get('/seo/redirects/').then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const saveMutation = useMutation({
    mutationFn: (data: any) => editItem
      ? api.patch(`/seo/redirects/${editItem.id}/`, data)
      : api.post('/seo/redirects/', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-redirects'] });
      toast.success('Redirect saved!');
      setShowForm(false); setEditItem(null); reset();
    },
    onError: () => toast.error('Failed to save redirect.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/seo/redirects/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-redirects'] });
      toast.success('Redirect deleted.');
    },
  });

  const openEdit = (item: any) => { setEditItem(item); reset(item); setShowForm(true); };
  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';
  const redirects = (data as any)?.results || data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setEditItem(null); reset({ redirect_type: '301', is_active: true }); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Redirect
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['From URL', 'To URL', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : redirects.length === 0
              ? <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No redirects configured yet.</td></tr>
              : redirects.map((r: any) => (
                  <tr key={r.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gold">{r.from_url}</td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{r.to_url}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{r.redirect_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm('Delete this redirect?')) deleteMutation.mutate(r.id); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <HiX className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg p-8 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editItem ? 'Edit Redirect' : 'Add Redirect'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div><label className={labelClass}>From URL *</label><input {...register('from_url', { required: true })} className={fieldClass} placeholder="/old-page" /></div>
              <div><label className={labelClass}>To URL *</label><input {...register('to_url', { required: true })} className={fieldClass} placeholder="/new-page" /></div>
              <div>
                <label className={labelClass}>Redirect Type</label>
                <select {...register('redirect_type')} className={`${fieldClass} appearance-none`}>
                  <option value="301">Permanent (301)</option>
                  <option value="302">Temporary (302)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('is_active')} type="checkbox" className="accent-gold" defaultChecked />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 py-3 disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : 'Save Redirect'}
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
