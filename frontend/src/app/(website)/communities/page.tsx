import type { Metadata } from 'next';
import { CommunitiesPageClient } from './CommunitiesPageClient';

export const metadata: Metadata = {
  title: 'Communities in Dubai',
  description: 'Explore Dubai\'s most popular residential communities. Find properties in Downtown, Marina, JBR, and more.',
};

export default function CommunitiesPage() {
  return <CommunitiesPageClient />;
}
