import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Book a private consultation with a senior Dubai real estate advisor. Discreet, unhurried, no obligation.',
};

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageClient />
    </Suspense>
  );
}
