import type { Metadata } from 'next';
import { BlogsPageClient } from './BlogsPageClient';

export const metadata: Metadata = {
  title: 'Blog — Real Estate Insights & Market Reports',
  description: 'In-depth market insights, investment guides and stories from Dubai\'s real estate landscape.',
};

export default function BlogsPage() {
  return <BlogsPageClient />;
}
