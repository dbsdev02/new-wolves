import type { Metadata } from 'next';
import { ProjectFormClient } from '../ProjectFormClient';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Edit Project - Admin' };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  return <ProjectFormClient projectId={Number(id)} />;
}
