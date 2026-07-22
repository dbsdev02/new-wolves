import type { Metadata } from 'next';
import { AdminLeadsClient } from './AdminLeadsClient';

export const metadata: Metadata = { title: 'Leads - Admin' };

export default function AdminLeadsPage() {
  return <AdminLeadsClient />;
}
