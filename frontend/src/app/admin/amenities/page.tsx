import type { Metadata } from 'next';
import { AdminAmenitiesClient } from './AdminAmenitiesClient';

export const metadata: Metadata = { title: 'Amenities - Admin' };

export default function AdminAmenitiesPage() {
  return <AdminAmenitiesClient />;
}
