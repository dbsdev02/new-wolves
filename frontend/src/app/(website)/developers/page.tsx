import type { Metadata } from 'next';
import { DevelopersPageClient } from './DevelopersPageClient';

export const metadata: Metadata = {
  title: 'Top Developers in Dubai',
  description: 'Explore properties from Dubai\'s leading real estate developers including Emaar, DAMAC, Nakheel, and more.',
};

export default function DevelopersPage() {
  return <DevelopersPageClient />;
}
