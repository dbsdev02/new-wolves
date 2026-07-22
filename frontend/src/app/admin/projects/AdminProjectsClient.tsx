'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/contentService';
import { formatPrice, getMediaUrl } from '@/lib/utils';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';

export function AdminProjectsClient() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects', page],
    queryFn: () => projectService.getAll({ page, page_size: 12 }).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => projectService.delete(slug),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); toast.success('Project deleted.'); },
    onError: () => toast.error('Failed to delete.'),
  });

  const statusColors: Record<string, string> = {
    upcoming: 'bg-purple-100 text-purple-700',
    under_construction: 'bg-orange-100 text-orange-700',
    ready: 'bg-green-100 text-green-700',
    sold_out: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.count || 0} total projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add Project
        </Link>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-luxury-light">
                {['Project', 'Developer', 'Status', 'Price From', 'Units', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>
                  ))
                : (data?.results || []).map((project: any) => (
                    <tr key={project.id} className="hover:bg-luxury-light transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 flex-shrink-0 overflow-hidden bg-gray-100">
                            {project.featured_image && (
                              <Image src={getMediaUrl(project.featured_image)} alt={project.name} fill className="object-cover" sizes="48px" />
                            )}
                          </div>
                          <div className="font-medium text-sm text-luxury-black">{project.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.developer_name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gold">
                        {project.min_price ? formatPrice(project.min_price, project.currency) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.total_units}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/projects/${project.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/projects/${project.id}`} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                            <HiPencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => confirm(`Delete "${project.name}"?`) && deleteMutation.mutate(project.slug)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
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
    </div>
  );
}
