import type { Metadata } from 'next';
import { CareersPageClient } from './CareersPageClient';

export const metadata: Metadata = {
  title: 'Careers - Wolves International',
  description: 'Join our team of real estate professionals. Explore career opportunities at Wolves International.',
};

export default function CareersPage() {
  return <CareersPageClient />;
}
