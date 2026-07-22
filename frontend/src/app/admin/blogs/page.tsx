import type { Metadata } from 'next';
import { AdminBlogsClient } from './AdminBlogsClient';

export const metadata: Metadata = { title: 'Blogs - Admin' };

export default function AdminBlogsPage() {
  return <AdminBlogsClient />;
}
