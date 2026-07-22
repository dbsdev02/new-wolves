import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const manrope = Manrope({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-manrope', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-cormorant', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Wolves International — Luxury Dubai Real Estate', template: '%s | Wolves International' },
  description: "A private Dubai real estate consultancy. Curated villas, penthouses and off-plan investments across Palm Jumeirah, Downtown, Emirates Hills and beyond.",
  keywords: ['Dubai real estate', 'properties for sale Dubai', 'luxury villas Dubai', 'apartments Dubai', 'off plan projects Dubai'],
  authors: [{ name: 'Wolves International' }],
  creator: 'Wolves International',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Wolves International',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', creator: '@wolvesintl' },
  robots: { index: true, follow: true },
  verification: { google: '' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${cormorant.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </Providers>
      </body>
    </html>
  );
}
