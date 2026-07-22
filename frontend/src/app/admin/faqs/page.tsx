import type { Metadata } from 'next';
import { AdminFAQsClient } from './AdminFAQsClient';

export const metadata: Metadata = { title: 'FAQs - Admin' };

export default function AdminFAQsPage() {
  return <AdminFAQsClient />;
}
