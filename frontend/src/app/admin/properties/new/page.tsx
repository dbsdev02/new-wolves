import type { Metadata } from 'next';
import { PropertyFormClient } from '../PropertyFormClient';

export const metadata: Metadata = { title: 'Add Property - Admin' };

export default function NewPropertyPage() {
  return <PropertyFormClient />;
}
