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

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Blog content is admin-authored free text (the editor is a plain textarea,
// "HTML supported" but not required). Most authors just type plain
// paragraphs with blank lines between them — with no block tags, the browser
// collapses all that whitespace and renders one unbroken wall of text.
// If the content already contains real block-level HTML, trust it as-is;
// otherwise escape it (it was never meant to be interpreted as markup) and
// turn blank-line-separated paragraphs into actual <p> tags so it reads the
// way it was typed.
const HTML_BLOCK_TAG = /<(p|div|h[1-6]|ul|ol|li|blockquote|table|figure|section|article)[\s>]/i;

export function formatBlogContent(content: string): string {
  if (!content) return '';
  if (HTML_BLOCK_TAG.test(content)) return content;

  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${para.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

// Appending ?output=embed to a modern Google Maps "place" share link (the
// .../data=!4m6!3m5!...!8m2!3d..!4d..!16s%2Fg%2F... format the Share button
// hands out) doesn't work — verified directly against Google: that URL shape
// keeps sending X-Frame-Options: SAMEORIGIN even with output=embed attached,
// so the iframe gets blocked regardless of which query params are stripped.
// The reliable path is the classic query-based form, which redirects (still
// followable inside an iframe) to Google's actual embeddable
// /maps/embed?pb=... endpoint: https://www.google.com/maps?q=LAT,LNG&output=embed
// So: pull coordinates out of whatever URL was pasted (mirrors the patterns
// backend/apps/properties/utils.py already uses server-side) and build that
// URL ourselves, rather than trust the pasted URL's own shape.
const MAPS_COORDINATE_PATTERNS = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/,           // .../@25.2048,55.2708,15z
  /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,       // ?q=25.2048,55.2708
  /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,      // ?ll=25.2048,55.2708
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,        // .../data=...!3d25.2048!4d55.2708
];

export function extractMapsCoords(url: string | null | undefined): { lat: string; lng: string } | null {
  if (!url) return null;
  for (const pattern of MAPS_COORDINATE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return { lat: match[1], lng: match[2] };
  }
  return null;
}

// Only true when the URL actually yields coordinates — that's the only case
// this can reliably turn into a working embed, so callers should fall back
// to a placeholder rather than risk rendering an iframe Google will block.
export function isEmbeddableMapsUrl(url: string | null | undefined): boolean {
  return extractMapsCoords(url) !== null;
}

export function buildMapsEmbedUrl(url: string): string {
  const coords = extractMapsCoords(url);
  if (!coords) return `${url.split('?')[0]}?output=embed`; // best-effort fallback, not expected to be hit given the guard above
  return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&output=embed`;
}

// Text-query fallback for when there's no lat/lng and no embeddable maps
// URL — Google's legacy (non-API) embed endpoint accepts a plain address
// query just like it accepts coordinates, so this still yields a real,
// embeddable map instead of a dead end.
export function buildAddressEmbedUrl(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat('en-AE').format(area)} sq.ft`;
}

export function formatBedroomRange(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Studio';
  return min === max ? `${min}` : `${min}-${max}`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE || '';
  if (base.includes('cloudinary.com')) {
    return `${base}/image/upload/${path}`;
  }
  if (base) {
    // Any configured backend host (local dev, cPanel, etc.) serves its own
    // /media/ — resolve relative paths against it directly.
    return `${base}/media/${path}`;
  }
  // No backend media base configured — falls back to the frontend's own
  // bundled /public/media snapshot, if one exists.
  return `/media/${path}`;
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '');
  const msg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${clean}${msg ? `?text=${msg}` : ''}`;
}

// Django's URLField (website, video_url, google_maps_url, linkedin, etc.)
// rejects anything without a scheme — "www.site.com" 400s with "Enter a
// valid URL." Admins routinely paste bare domains, so normalize by field
// name before it ever reaches the backend instead of rejecting it.
const URL_FIELD_NAMES = new Set(['website', 'link', 'linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'tiktok']);
const HAS_SCHEME = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

export function normalizeIfUrlField(key: string, value: string): string {
  const isUrlField = URL_FIELD_NAMES.has(key) || key.toLowerCase().endsWith('url');
  if (!isUrlField || !value || HAS_SCHEME.test(value)) return value;
  return `https://${value}`;
}

// Same normalization for forms (e.g. Settings) that submit a plain object
// instead of building FormData.
export function normalizeUrlFields<T extends Record<string, unknown>>(data: T): T {
  const out = { ...data };
  for (const [k, v] of Object.entries(out)) {
    if (typeof v === 'string') (out as Record<string, unknown>)[k] = normalizeIfUrlField(k, v);
  }
  return out;
}

// Admin forms build multipart FormData from react-hook-form values before
// POST/PATCH. Number inputs registered with `valueAsNumber` report NaN (not
// undefined) when left blank, which — unless filtered here — gets sent as
// the literal string "NaN" and rejected by the backend with a 400.
//
// `fileFields`: image/file fields (e.g. 'photo', 'featured_image') that are
// uploaded separately via their own fd.append(name, File) call, not through
// this generic pass. When editing an existing record, reset(existingRecord)
// seeds these as the *existing file's path string* into form state even
// though there's no <input> for them — left unfiltered, that string gets
// sent as the field's value, and Django rejects it with "The submitted data
// was not a file." whenever the admin doesn't also pick a new file to
// override it. List every such field name here so it's always skipped.
export function appendFormData(fd: FormData, data: Record<string, unknown>, fileFields: string[] = []) {
  const skip = new Set(fileFields);
  Object.entries(data).forEach(([k, v]) => {
    if (skip.has(k)) return;
    if (v === null || v === undefined || v === '') return;
    if (typeof v === 'number' && Number.isNaN(v)) return;
    fd.append(k, typeof v === 'string' ? normalizeIfUrlField(k, v) : String(v));
  });
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
