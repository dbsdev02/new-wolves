'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { formatPrice, getMediaUrl } from '@/lib/utils';
import { HiPlus, HiPencil, HiTrash, HiEye, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

export function AdminPropertiesClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-properties', { search, status, page }],
    queryFn: () => propertyService.getAll({ search: search || undefined, status: status || undefined, page } as any).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => propertyService.delete(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-properties'] });
      toast.success('Property deleted.');
    },
    onError: () => toast.error('Failed to delete property.'),
  });

  const handleDelete = (slug: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(slug);
    }
  };

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-gray-100 text-gray-600',
    sold: 'bg-blue-100 text-blue-700',
    rented: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.count || 0} total properties</p>
        </div>
        <Link href="/admin/properties/new" className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input-luxury text-sm w-full md:w-48"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-luxury-light">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                : data?.results.map((property) => (
                    <tr key={property.id} className="hover:bg-luxury-light transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 flex-shrink-0 overflow-hidden bg-gray-100">
                            {(property.primary_image || property.featured_image) && (
                              <Image
                                src={getMediaUrl(property.primary_image || property.featured_image)}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-luxury-black line-clamp-1">{property.title}</div>
                            <div className="text-xs text-gray-400">{property.reference_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{property.property_type}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gold">{formatPrice(property.price, property.currency)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[property.status] || 'bg-gray-100 text-gray-600'}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{property.views_count}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/properties/${property.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gold transition-colors">
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/properties/${property.id}`} className="p-2 text-gray-400 hover:text-gold transition-colors">
                            <HiPencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.slug, property.title)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {data.current_page} of {data.total_pages}
            </span>
            <div className="flex items-center gap-2">
              <button disabled={!data.previous} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-200 text-sm disabled:opacity-40 hover:border-gold transition-colors">
                Previous
              </button>
              <button disabled={!data.next} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 text-sm disabled:opacity-40 hover:border-gold transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
