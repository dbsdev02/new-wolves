'use client';
import Link from 'next/link';
import { useNewsItems, useTickerStats } from '@/hooks/useContent';

export function NewsTicker() {
  const { data: newsItems } = useNewsItems();
  const { data: stats } = useTickerStats();

  const items = (newsItems || []).filter((n) => n.is_active);
  const activeStats = (stats || []).filter((s) => s.is_active);

  if (items.length === 0 && activeStats.length === 0) return null;

  const marqueeItems = [...items, ...items];

  return (
    <section className="border-t border-border">
      {/* News ticker */}
      {items.length > 0 && (
        <div className="relative flex items-stretch bg-white overflow-hidden">
          <div className="relative z-10 flex items-center bg-ink text-white pl-6 pr-8" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--gold-soft)' }}>News</span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--white), transparent)' }} />
          <div className="flex items-center overflow-hidden py-3">
            <div className="flex items-center gap-3 whitespace-nowrap animate-marquee pl-6">
              {marqueeItems.map((item, i) => (
                <span key={i} className="flex items-center gap-3">
                  {item.link ? (
                    <Link href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:text-gold-deep transition-colors">
                      {item.headline}
                    </Link>
                  ) : (
                    <span className="text-sm text-ink">{item.headline}</span>
                  )}
                  <span className="text-muted-foreground">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats bar */}
      {activeStats.length > 0 && (
        <div className="bg-ink">
          <div className="container-luxe divide-x divide-white/15 flex justify-center">
            {activeStats.map((stat) => (
              <div key={stat.id} className="px-8 md:px-12 py-6 text-center">
                <p className="serif text-2xl md:text-3xl" style={{ color: 'var(--gold-soft)' }}>{stat.value}</p>
                <p className="mt-1 text-[0.65rem] tracking-[0.2em] uppercase text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
