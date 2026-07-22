import type { Metadata } from 'next';
import { AdminUsersClient } from './AdminUsersClient';

export const metadata: Metadata = { title: 'Users - Admin' };

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
