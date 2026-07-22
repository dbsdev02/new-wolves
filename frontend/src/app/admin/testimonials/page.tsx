import type { Metadata } from 'next';
import { AdminTestimonialsClient } from './AdminTestimonialsClient';

export const metadata: Metadata = { title: 'Testimonials - Admin' };

export default function AdminTestimonialsPage() {
  return <AdminTestimonialsClient />;
}
