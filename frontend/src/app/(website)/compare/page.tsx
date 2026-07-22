import type { Metadata } from 'next';
import { ComparePageClient } from './ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare Properties',
  description: 'Compare properties side by side to make the best investment decision.',
};

export default function ComparePage() {
  return <ComparePageClient />;
}
