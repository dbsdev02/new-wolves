import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'AED'): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat('en-AE').format(area)} sq.ft`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`;
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '');
  const msg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${clean}${msg ? `?text=${msg}` : ''}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number
): { monthly: number; total: number; interest: number } {
  const monthly = annualRate / 100 / 12;
  const payments = years * 12;
  const monthlyPayment = (principal * monthly * Math.pow(1 + monthly, payments)) / (Math.pow(1 + monthly, payments) - 1);
  const total = monthlyPayment * payments;
  return {
    monthly: Math.round(monthlyPayment),
    total: Math.round(total),
    interest: Math.round(total - principal),
  };
}
