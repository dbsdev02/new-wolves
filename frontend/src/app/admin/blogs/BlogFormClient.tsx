'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/contentService';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import api from '@/lib/api';

interface Props { blogId?: number }

interface BlogFormValues {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  read_time: number;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
}

export function BlogFormClient({ blogId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!blogId;

  const { data: existing } = useQuery({
    queryKey: ['blog-edit', blogId],
    queryFn: () => api.get(`/blogs/${blogId}/`).then(r => r.data),
    enabled: isEdit,
  });

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => blogService.getCategories().then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({
    defaultValues: { status: 'draft', read_time: 5 },
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit
      ? blogService.update(existing.slug, data)
      : blogService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success(isEdit ? 'Blog updated!' : 'Blog created!');
      router.push('/admin/blogs');
    },
    onError: () => toast.error('Failed to save blog.'),
  });

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="p-2 border border-gray-200 hover:border-gold transition-colors">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Update your article' : 'Write a new article'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Content</h2>
          <div>
            <label className={labelClass}>Title *</label>
            <input {...register('title', { required: true })} className={fieldClass} placeholder="Article title" />
            {errors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
          </div>
          <div>
            <label className={labelClass}>Excerpt</label>
            <textarea {...register('excerpt')} rows={3} className={`${fieldClass} resize-none`} placeholder="Short summary (max 500 chars)" />
          </div>
          <div>
            <label className={labelClass}>Content *</label>
            <textarea {...register('content', { required: true })} rows={15} className={`${fieldClass} resize-none font-mono text-xs`} placeholder="Article content (HTML supported)" />
            {errors.content && <p className="text-red-500 text-xs mt-1">Content is required</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Category</label>
              <select {...register('category')} className={`${fieldClass} appearance-none`}>
                <option value="">No Category</option>
                {((categories as any[]) || []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select {...register('status')} className={`${fieldClass} appearance-none`}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Read Time (minutes)</label>
              <input {...register('read_time', { valueAsNumber: true })} type="number" min={1} className={fieldClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('is_featured')} type="checkbox" className="accent-gold" />
            <span className="text-sm">Featured Post</span>
          </label>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">SEO</h2>
          <div>
            <label className={labelClass}>Meta Title</label>
            <input {...register('meta_title')} className={fieldClass} placeholder="SEO title (max 60 chars)" />
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea {...register('meta_description')} rows={3} className={`${fieldClass} resize-none`} placeholder="SEO description (max 160 chars)" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={isSubmitting} className="btn-gold px-10 py-4 disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
          </button>
          <Link href="/admin/blogs" className="btn-outline-gold px-8 py-4">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
