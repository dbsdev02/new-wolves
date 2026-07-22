import type { Metadata } from 'next';
import { BlogFormClient } from '../BlogFormClient';

export const metadata: Metadata = { title: 'New Blog Post - Admin' };

export default function NewBlogPage() {
  return <BlogFormClient />;
}
