'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { agentService } from '@/services/contentService';
import { getMediaUrl } from '@/lib/utils';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export function AdminAgentsClient() {
  const [showForm, setShowForm] = useState(false);
  const [editAgent, setEditAgent] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-agents'],
    queryFn: () => agentService.getAll({ page_size: 100 }).then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editAgent) return api.patch(`/agents/${editAgent.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return api.post('/agents/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-agents'] });
      toast.success(editAgent ? 'Agent updated!' : 'Agent created!');
      setShowForm(false);
      setEditAgent(null);
      reset();
    },
    onError: () => toast.error('Failed to save agent.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/agents/${id}/`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-agents'] }); toast.success('Agent deleted.'); },
  });

  const onSubmit = (data: any) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') fd.append(k, String(v)); });
    saveMutation.mutate(fd);
  };

  const openEdit = (agent: any) => {
    setEditAgent(agent);
    reset(agent);
    setShowForm(true);
  };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Agents</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.results?.length || 0} agents</p>
        </div>
        <button onClick={() => { setEditAgent(null); reset({}); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-white h-48" />)
          : (data?.results || []).map((agent: any) => (
              <div key={agent.id} className="bg-white border border-gray-100 p-5 hover:border-gold transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {agent.photo ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={getMediaUrl(agent.photo)} alt={`${agent.first_name} ${agent.last_name}`} fill className="object-cover" sizes="48px" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{agent.first_name[0]}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-sm">{agent.first_name} {agent.last_name}</div>
                    <div className="text-xs text-gold">{agent.designation}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1 mb-4">
                  <div>{agent.email}</div>
                  <div>{agent.phone}</div>
                  {agent.rera_number && <div>RERA: {agent.rera_number}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(agent)} className="flex-1 flex items-center justify-center gap-1 p-2 border border-gray-200 hover:border-gold hover:text-gold transition-colors text-xs">
                    <HiPencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => confirm('Delete agent?') && deleteMutation.mutate(agent.id)} className="p-2 border border-gray-200 hover:border-red-400 hover:text-red-500 transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editAgent ? 'Edit Agent' : 'Add Agent'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>First Name *</label><input {...register('first_name', { required: true })} className={fieldClass} /></div>
                <div><label className={labelClass}>Last Name *</label><input {...register('last_name', { required: true })} className={fieldClass} /></div>
              </div>
              <div><label className={labelClass}>Designation</label><input {...register('designation')} className={fieldClass} placeholder="Senior Property Consultant" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Email *</label><input {...register('email', { required: true })} type="email" className={fieldClass} /></div>
                <div><label className={labelClass}>Phone *</label><input {...register('phone', { required: true })} className={fieldClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>WhatsApp</label><input {...register('whatsapp')} className={fieldClass} /></div>
                <div><label className={labelClass}>RERA Number</label><input {...register('rera_number')} className={fieldClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Experience (Years)</label><input {...register('experience_years', { valueAsNumber: true })} type="number" min={0} className={fieldClass} /></div>
                <div><label className={labelClass}>Languages</label><input {...register('languages')} className={fieldClass} placeholder="English, Arabic" /></div>
              </div>
              <div><label className={labelClass}>Bio</label><textarea {...register('bio')} rows={3} className={`${fieldClass} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>LinkedIn</label><input {...register('linkedin')} className={fieldClass} /></div>
                <div><label className={labelClass}>Instagram</label><input {...register('instagram')} className={fieldClass} /></div>
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
                  {isSubmitting ? 'Saving...' : editAgent ? 'Update Agent' : 'Create Agent'}
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
