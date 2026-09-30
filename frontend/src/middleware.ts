import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface RedirectRule {
  from_url: string;
  to_url: string;
  redirect_type: '301' | '302';
}

// Module-scoped, so it survives across requests on the same warm
// server/isolate instead of relying solely on Next's fetch data cache
// (which middleware doesn't always honor consistently). This turns the
// "hit the backend on every single navigation" cost into "hit it at most
// once every 5 minutes" — the redirect list only changes when an admin
// edits it in the CMS, so a few minutes of staleness is fine.
let cachedRedirects: RedirectRule[] = [];
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchActiveRedirects(): Promise<RedirectRule[]> {
  if (Date.now() - cachedAt < CACHE_TTL_MS) return cachedRedirects;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_URL}/seo/redirects/active/`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      cachedRedirects = await res.json();
      cachedAt = Date.now();
    }
  } catch {
    // Backend unreachable/slow — keep serving the last known list (or
    // empty, on first load) instead of blocking navigation on a retry.
  }
  return cachedRedirects;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const redirects = await fetchActiveRedirects();
  const match = redirects.find((r) => r.from_url === pathname);

  if (match) {
    const status = match.redirect_type === '301' ? 301 : 302;
    return NextResponse.redirect(new URL(match.to_url, request.url), status);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|admin/|images/|.*\\..*).*)',
  ],
};
