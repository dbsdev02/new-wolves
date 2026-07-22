import type { Metadata } from 'next';
import { ProjectFormClient } from '../ProjectFormClient';

export const metadata: Metadata = { title: 'Add Project - Admin' };

export default function NewProjectPage() {
  return <ProjectFormClient />;
}
