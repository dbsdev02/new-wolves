import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface RedirectRule {
  from_url: string;
  to_url: string;
  redirect_type: '301' | '302';
}

async function fetchActiveRedirects(): Promise<RedirectRule[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_URL}/seo/redirects/active/`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
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
