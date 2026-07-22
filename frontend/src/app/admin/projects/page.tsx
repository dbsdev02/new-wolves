import type { Metadata } from 'next';
import { AdminProjectsClient } from './AdminProjectsClient';

export const metadata: Metadata = { title: 'Projects - Admin' };

export default function AdminProjectsPage() {
  return <AdminProjectsClient />;
}
