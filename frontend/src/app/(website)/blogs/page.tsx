import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Coming Soon',
};

export default function BlogsPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--cream)' }}>
      <p className="eyebrow mb-6" style={{ color: 'var(--gold-deep)' }}>Insights & Market Reports</p>
      <h1 className="section-heading text-center">Coming Soon.</h1>
      <p className="mt-6 text-sm text-center max-w-sm" style={{ color: 'var(--muted)' }}>
        Our editorial team is crafting in-depth market insights and investment guides. Check back shortly.
      </p>
    </section>
  );
}
