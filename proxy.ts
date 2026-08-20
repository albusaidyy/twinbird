import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: protects all /admin/* routes.
 *
 * Uses an optimistic cookie-based check — the Better Auth recommended approach
 * for Edge-compatible middleware. Full session validation (DB lookup) happens
 * in Server Actions via auth.api.getSession(), not here.
 */
export function proxy(req: NextRequest) {
  const sessionCookie =
    req.cookies.get('better-auth.session_token') ??
    req.cookies.get('__Secure-better-auth.session_token');

  if (!sessionCookie) {
    const loginUrl = new URL('/login', req.url);
    const callback =
      req.nextUrl.pathname === '/admin' ? '/admin/config' : req.nextUrl.pathname;
    loginUrl.searchParams.set('callbackUrl', callback);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

