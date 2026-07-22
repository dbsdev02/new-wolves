import type { Metadata } from 'next';
import { PropertyDetailClient } from './PropertyDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Property Details - ${slug}`,
    description: 'View property details, photos, floor plans, and contact agent.',
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  return <PropertyDetailClient slug={slug} />;
}
