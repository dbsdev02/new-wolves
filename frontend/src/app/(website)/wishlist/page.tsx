import type { Metadata } from 'next';
import { WishlistPageClient } from './WishlistPageClient';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'View the properties you have saved to your wishlist.',
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
