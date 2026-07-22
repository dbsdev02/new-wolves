import type { Metadata } from 'next';
import { BlogFormClient } from '../BlogFormClient';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Edit Blog Post - Admin' };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  return <BlogFormClient blogId={Number(id)} />;
}
