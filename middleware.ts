import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Redirect from coreumstaking.com to re-delegate page
  if (
    hostname.includes('coreumstaking.com') ||
    hostname.includes('coreum-staking.com')
  ) {
    return NextResponse.redirect(
      new URL('/re-delegate', 'https://www.shieldnest.org'),
      301 // Permanent redirect
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


