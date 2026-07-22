import type { Metadata } from 'next';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Off Plan Projects in Dubai',
  description: 'Explore the latest off-plan projects and new launches in Dubai from top developers.',
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
