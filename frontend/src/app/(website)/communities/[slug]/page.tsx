import type { Metadata } from 'next';
import { CommunityDetailClient } from './CommunityDetailClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Community - ${slug}`, description: 'Explore properties and amenities in this community.' };
}

export default async function CommunityDetailPage({ params }: Props) {
  const { slug } = await params;
  return <CommunityDetailClient slug={slug} />;
}
