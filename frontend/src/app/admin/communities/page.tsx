import type { Metadata } from 'next';
import { AdminCommunitiesClient } from './AdminCommunitiesClient';

export const metadata: Metadata = { title: 'Communities - Admin' };

export default function AdminCommunitiesPage() {
  return <AdminCommunitiesClient />;
}
