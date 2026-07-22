import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertiesPageClient } from './PropertiesPageClient';

export const metadata: Metadata = {
  title: 'Properties for Sale & Rent in Dubai',
  description: 'Browse thousands of properties for sale and rent in Dubai. Apartments, villas, townhouses, and off-plan projects.',
};

export default function PropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PropertiesPageClient />
    </Suspense>
  );
}
