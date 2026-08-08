import type { Metadata } from 'next';
import { ListPropertyPageClient } from './ListPropertyPageClient';

export const metadata: Metadata = {
  title: 'List Your Property — Wolves International',
  description: 'Submit your property for sale or rent. Our team will review your details and get in touch to arrange the next steps.',
};

export default function ListYourPropertyPage() {
  return <ListPropertyPageClient />;
}
