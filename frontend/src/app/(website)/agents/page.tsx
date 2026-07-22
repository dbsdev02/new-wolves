import type { Metadata } from 'next';
import { AgentsPageClient } from './AgentsPageClient';

export const metadata: Metadata = {
  title: 'Our Real Estate Agents in Dubai',
  description: 'Meet our expert team of real estate agents in Dubai. Find the right agent for your property needs.',
};

export default function AgentsPage() {
  return <AgentsPageClient />;
}
