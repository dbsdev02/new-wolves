import type { Metadata } from 'next';
import { BlogDetailClient } from './BlogDetailClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Blog - ${slug}`, description: 'Read our latest real estate insights and market updates.' };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
