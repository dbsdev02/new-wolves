import type { Metadata } from 'next';
import { PropertyFormClient } from '../PropertyFormClient';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Edit Property - Admin' };

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  return <PropertyFormClient propertyId={Number(id)} />;
}
