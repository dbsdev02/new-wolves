import type { Metadata } from 'next';
import { AdminSEOClient } from './AdminSEOClient';

export const metadata: Metadata = { title: 'SEO Management - Admin' };

export default function AdminSEOPage() {
  return <AdminSEOClient />;
}
