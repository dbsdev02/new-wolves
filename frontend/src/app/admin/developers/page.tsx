import type { Metadata } from 'next';
import { AdminDevelopersClient } from './AdminDevelopersClient';

export const metadata: Metadata = { title: 'Developers - Admin' };

export default function AdminDevelopersPage() {
  return <AdminDevelopersClient />;
}
