import type { Metadata } from 'next';
import { AgentDetailClient } from './AgentDetailClient';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return { title: `Agent Profile`, description: 'View agent profile, listings, and contact information.' };
}

export default async function AgentDetailPage({ params }: Props) {
  const { id } = await params;
  return <AgentDetailClient id={Number(id)} />;
}
