import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Redirect from coreumstaking.com to v1.shieldnest.org re-delegate
  if (
    hostname.includes('coreumstaking.com') ||
    hostname.includes('coreum-staking.com')
  ) {
    return NextResponse.redirect(
      new URL('https://v1.shieldnest.org/dashboard?action=redelegate'),
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
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico).*)',
  ],
};
