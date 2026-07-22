import type { Metadata } from 'next';
import { AdminDashboardClient } from './AdminDashboardClient';

export const metadata: Metadata = { title: 'Admin Dashboard - Wolves International' };

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
