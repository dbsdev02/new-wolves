import type { Metadata } from 'next';
import { AdminAgentsClient } from './AdminAgentsClient';

export const metadata: Metadata = { title: 'Agents - Admin' };

export default function AdminAgentsPage() {
  return <AdminAgentsClient />;
}
