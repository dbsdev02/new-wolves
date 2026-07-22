import type { Metadata } from 'next';
import { ProjectDetailClient } from './ProjectDetailClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Project - ${slug}`, description: 'View project details, units, and payment plans.' };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}
