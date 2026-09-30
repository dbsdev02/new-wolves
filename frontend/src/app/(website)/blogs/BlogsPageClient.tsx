'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { HiSearch } from 'react-icons/hi';
import { useBlogs, useBlogCategories } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';

export function BlogsPageClient() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useBlogs({
    category__slug: category || undefined,
    search: search || undefined,
    page_size: 24,
  });
  const { data: categories } = useBlogCategories();

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Insights &amp; Market Reports</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">The Journal.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">
            In-depth market insights, investment guides and stories from the UAE&apos;s real estate landscape.
          </p>
        </div>
      </section>

      <div className="container-luxe py-14">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-input bg-background text-sm tracking-wide focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {(categories?.length ?? 0) > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategory('')}
                className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border ${category === '' ? 'bg-ink text-white border-ink' : 'border-border hover:border-ink'}`}
              >
                All
              </button>
              {categories!.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border ${category === c.slug ? 'bg-ink text-white border-ink' : 'border-border hover:border-ink'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="pt-5 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (data?.results || []).length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {(data?.results || []).map((blog) => (
              <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group block">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={getMediaUrl(blog.featured_image)}
                    alt={blog.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge-light">{blog.category_name || 'Insight'}</span>
                  </div>
                </div>

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
    </div>
  );
}
