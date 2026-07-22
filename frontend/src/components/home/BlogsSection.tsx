'use client';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import { useFeaturedBlogs } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';
import { format } from 'date-fns';

export function BlogsSection() {
  const { data: blogs, isLoading } = useFeaturedBlogs();

  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--cream)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="section-header">
          <div>
            <p className="eyebrow">Journal</p>
            <h2 className="section-heading mt-4">Insights &amp; market notes.</h2>
          </div>
          <Link
            href="/blogs"
            className="link-underline flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            All articles <HiOutlineArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3]" style={{ background: 'var(--cream-dark)' }} />
                <div className="pt-5 space-y-2">
                  <div className="h-3 w-1/2 rounded" style={{ background: 'var(--cream-dark)' }} />
                  <div className="h-4 w-3/4 rounded" style={{ background: 'var(--cream-dark)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {(blogs || []).slice(0, 3).map((blog, i) => (
              <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group block">
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: i === 0 ? '4/3' : '4/3' }}>
                  <Image
                    src={getMediaUrl(blog.featured_image)}
                    alt={blog.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="badge-light">
                      {blog.category_name || 'Insight'}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="pt-5">
                  <p className="eyebrow mb-3">
                    {blog.published_at ? format(new Date(blog.published_at), 'MMMM d, yyyy') : ''}
                    {blog.read_time ? ` · ${blog.read_time} min read` : ''}
                  </p>
                  <h3
                    className="leading-snug transition-colors duration-300 group-hover:text-[var(--gold-deep)]"
                    style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: '1.3rem',
                      fontWeight: 400,
                      color: 'var(--ink)',
                    }}
                  >
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
                      {blog.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
