'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services';
import { format } from 'date-fns';
import { HiDownload, HiSearch, HiRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  proposal: 'bg-purple-100 text-purple-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  contact: 'bg-gray-100 text-gray-600',
  property_inquiry: 'bg-blue-100 text-blue-600',
  schedule_visit: 'bg-green-100 text-green-600',
  mortgage: 'bg-orange-100 text-orange-600',
  newsletter: 'bg-purple-100 text-purple-600',
  career: 'bg-pink-100 text-pink-600',
};

export function AdminLeadsClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', { search, status, lead_type: type, page }],
    queryFn: () => leadService.getAll({ search: search || undefined, status: status || undefined, lead_type: type || undefined, page }).then(r => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => leadService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead updated.');
      setSelectedLead(null);
    },
  });

  const handleExport = async () => {
    try {
      const response = await leadService.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
    } catch {
      toast.error('Export failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.count || 0} total leads</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm hover:border-gold hover:text-gold transition-colors">
          <HiDownload className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-luxury text-sm w-full md:w-40">
          <option value="">All Status</option>
          {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="input-luxury text-sm w-full md:w-48">
          <option value="">All Types</option>
          {['contact', 'property_inquiry', 'schedule_visit', 'mortgage', 'newsletter', 'career'].map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-luxury-light">
                {['Name', 'Contact', 'Type', 'Status', 'Property', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>
                  ))
                : (data?.results || []).map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-luxury-light transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-luxury-black">{lead.name}</div>
                        {lead.nationality && <div className="text-xs text-gray-400">{lead.nationality}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{lead.email}</div>
                        <div className="text-xs text-gray-400">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[lead.lead_type] || 'bg-gray-100 text-gray-600'}`}>
                          {lead.lead_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateMutation.mutate({ id: lead.id, data: { status: e.target.value } })}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${statusColors[lead.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'unqualified'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate">
                        {lead.property_title || '-'}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs text-gold hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Page {data.current_page} of {data.total_pages}</span>
            <div className="flex gap-2">
              <button disabled={!data.previous} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-200 text-sm disabled:opacity-40 hover:border-gold transition-colors">Previous</button>
              <button disabled={!data.next} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 text-sm disabled:opacity-40 hover:border-gold transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-xl mb-6">Lead Details</h3>
            <div className="space-y-3 text-sm">
              {[
                ['Name', selectedLead.name],
                ['Email', selectedLead.email],
                ['Phone', selectedLead.phone],
                ['Type', selectedLead.lead_type],
                ['Status', selectedLead.status],
                ['Source', selectedLead.source || '-'],
                ['Property', selectedLead.property_title || '-'],
                ['Message', selectedLead.message || '-'],
                ['Notes', selectedLead.notes || '-'],
                ['Date', format(new Date(selectedLead.created_at), 'PPpp')],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <span className="text-gray-400 w-24 flex-shrink-0">{label}:</span>
                  <span className="text-luxury-black">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <div>
                <label className="label-luxury">Notes</label>
                <textarea
                  defaultValue={selectedLead.notes}
                  onBlur={(e) => updateMutation.mutate({ id: selectedLead.id, data: { notes: e.target.value } })}
                  rows={3}
                  className="input-luxury resize-none text-sm"
                />
              </div>
            </div>
            <button onClick={() => setSelectedLead(null)} className="mt-6 btn-gold w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
