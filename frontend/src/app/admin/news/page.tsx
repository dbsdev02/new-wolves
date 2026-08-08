import type { Metadata } from 'next';
import { AdminNewsClient } from './AdminNewsClient';

export const metadata: Metadata = { title: 'News Ticker - Admin' };

export default function AdminNewsPage() {
  return <AdminNewsClient />;
}
