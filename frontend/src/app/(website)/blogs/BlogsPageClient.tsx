'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBlogs } from '@/hooks/useContent';
import { getMediaUrl } from '@/lib/utils';
import { HiSearch } from 'react-icons/hi';
import { format } from 'date-fns';
import { blogService } from '@/services/contentService';
import { useQuery } from '@tanstack/react-query';

export function BlogsPageClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data, isLoading } = useBlogs({ search: search || undefined, category__slug: category || undefined });
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => blogService.getCategories().then(r => r.data),
  });

  return (
    <div className="bg-background">
      <section className="pt-40 pb-20 bg-ink text-white">
        <div className="container-luxe">
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Journal</p>
          <h1 className="mt-6 serif text-5xl md:text-7xl leading-[1.02] max-w-3xl">Insights &amp; market notes.</h1>
          <p className="mt-8 text-white/60 max-w-xl leading-relaxed">Expert insights, market trends, and investment guides.</p>
        </div>
      </section>

      <div className="container-luxe py-14">
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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border ${!category ? 'bg-ink text-white border-ink' : 'border-border hover:border-ink'}`}
            >
              All
            </button>
            {(categories as any[] || []).map((cat: any) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border ${category === cat.slug ? 'bg-ink text-white border-ink' : 'border-border hover:border-ink'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse aspect-[4/3] bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(data?.results || []).map((blog) => (
              <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={getMediaUrl(blog.featured_image)}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="pt-5">
                  <p className="eyebrow">
                    {blog.category_name || 'Insight'} · {blog.published_at ? format(new Date(blog.published_at), 'MMMM d, yyyy') : ''}
                  </p>
                  <h3 className="mt-3 serif text-xl text-ink leading-snug group-hover:text-gold-deep transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-2">{blog.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
