'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useBlog } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';
import { HiClock, HiEye, HiShare } from 'react-icons/hi';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { blogService } from '@/services/contentService';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface Props { slug: string }

export function BlogDetailClient({ slug }: Props) {
  const { data: blog, isLoading } = useBlog(slug);
  const { data: related } = useQuery({
    queryKey: ['blog-related', slug],
    queryFn: () => blogService.getRelated(slug).then(r => r.data),
    enabled: !!slug,
  });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string; email: string; comment: string }>();

  const onComment = async (data: { name: string; email: string; comment: string }) => {
    try {
      await blogService.addComment(slug, data);
      toast.success('Comment submitted for review!');
      reset();
    } catch {
      toast.error('Failed to submit comment.');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-32 bg-background">
      <div className="container-luxe py-12 max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="aspect-[21/9] bg-muted" />
        <div className="h-8 bg-muted w-3/4" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-4 bg-muted" />)}
        </div>
      </div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="serif text-4xl text-ink mb-6">Article not found</h2>
        <Link href="/blogs" className="btn-gold">Back to journal</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative aspect-[21/9] min-h-[420px] overflow-hidden">
        <Image src={getMediaUrl(blog.featured_image)} alt={blog.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
        <div className="absolute inset-0 flex flex-col justify-end pb-16 pt-32">
          <div className="container-luxe max-w-4xl">
            {blog.category_name && <p className="eyebrow mb-4" style={{ color: 'var(--gold-soft)' }}>{blog.category_name}</p>}
            <h1 className="serif text-3xl md:text-5xl text-white leading-tight">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-white/70 text-sm">
              <span>{blog.author_name}</span>
              <span className="flex items-center gap-1"><HiClock className="w-4 h-4" />{blog.read_time} min read</span>
              <span className="flex items-center gap-1"><HiEye className="w-4 h-4" />{blog.views_count} views</span>
              {blog.published_at && <span>{format(new Date(blog.published_at), 'MMMM d, yyyy')}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxe py-16 max-w-4xl mx-auto">
        {/* Content */}
        <div className="mb-16">
          <div
            className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t border-border">
              {blog.tags.map((tag) => (
                <Link key={tag.id} href={`/blogs?tag=${tag.slug}`} className="px-3 py-1 border border-border text-sm text-muted-foreground hover:border-gold hover:text-gold-deep transition-colors">
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <span className="text-sm text-muted-foreground">Share:</span>
            <button
              onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
              className="flex items-center gap-2 px-4 py-2 border border-border text-sm hover:border-gold hover:text-gold-deep transition-colors"
            >
              <HiShare className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-16">
          <p className="eyebrow mb-6">Leave a Comment</p>
          <form onSubmit={handleSubmit(onComment)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register('name', { required: true })} placeholder="Your name" className="w-full bg-transparent border-b border-input py-3 text-sm outline-none focus:border-gold-deep transition-colors" />
              <input {...register('email', { required: true })} type="email" placeholder="Email address" className="w-full bg-transparent border-b border-input py-3 text-sm outline-none focus:border-gold-deep transition-colors" />
            </div>
            <textarea {...register('comment', { required: true })} placeholder="Your comment" rows={4} className="w-full bg-transparent border-b border-input py-3 text-sm outline-none focus:border-gold-deep transition-colors resize-none" />
            <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit comment'}
            </button>
          </form>

          {blog.comments && blog.comments.length > 0 && (
            <div className="mt-10 pt-10 border-t border-border space-y-4">
              <p className="eyebrow">{blog.comments.length} Comments</p>
              {blog.comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-cream">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-ink">{comment.name}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(comment.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related && (related as any[]).length > 0 && (
          <div>
            <p className="eyebrow mb-6">Related Articles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(related as any[]).slice(0, 2).map((b: any) => (
                <Link key={b.id} href={`/blogs/${b.slug}`} className="group flex gap-4 border border-border p-4 hover:border-gold transition-colors">
                  <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden">
                    <Image src={getMediaUrl(b.featured_image)} alt={b.title} fill className="object-cover" sizes="100px" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-ink leading-snug group-hover:text-gold-deep transition-colors line-clamp-2">{b.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{b.read_time} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
