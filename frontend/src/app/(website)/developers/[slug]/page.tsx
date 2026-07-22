import type { Metadata } from 'next';
import { DeveloperDetailClient } from './DeveloperDetailClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Developer - ${slug}`, description: 'View developer profile, projects, and properties.' };
}

export default async function DeveloperDetailPage({ params }: Props) {
  const { slug } = await params;
  return <DeveloperDetailClient slug={slug} />;
}
