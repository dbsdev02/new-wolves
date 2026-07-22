import type { Metadata } from 'next';
import { AdminPropertiesClient } from './AdminPropertiesClient';

export const metadata: Metadata = { title: 'Properties - Admin' };

export default function AdminPropertiesPage() {
  return <AdminPropertiesClient />;
}
