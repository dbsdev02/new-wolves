'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/contentService';
import { getMediaUrl } from '@/lib/utils';
import { HiPlus, HiPencil, HiTrash, HiEye, HiSearch } from 'react-icons/hi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function AdminBlogsClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', { search, status, page }],
    queryFn: () => blogService.getAll({ search: search || undefined, status: status || undefined, page }).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => blogService.delete(slug),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blogs'] }); toast.success('Blog deleted.'); },
    onError: () => toast.error('Failed to delete.'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.count || 0} total posts</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-100 p-4 flex gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-luxury pl-10 text-sm" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-luxury text-sm w-40">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-luxury-light">
                {['Post', 'Category', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>
                  ))
                : (data?.results || []).map((blog: any) => (
                    <tr key={blog.id} className="hover:bg-luxury-light transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 flex-shrink-0 overflow-hidden bg-gray-100">
                            {blog.featured_image && (
                              <Image src={getMediaUrl(blog.featured_image)} alt={blog.title} fill className="object-cover" sizes="48px" />
                            )}
                          </div>
                          <div className="font-medium text-sm text-luxury-black line-clamp-1 max-w-[200px]">{blog.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{blog.category_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{blog.author_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-700' : blog.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{blog.views_count}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {blog.published_at ? format(new Date(blog.published_at), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/blogs/${blog.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/blogs/${blog.id}`} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                            <HiPencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => confirm(`Delete "${blog.title}"?`) && deleteMutation.mutate(blog.slug)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
