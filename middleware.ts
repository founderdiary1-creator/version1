import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Origin Protection Layer for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const fetchSite = request.headers.get('Sec-Fetch-Site');
    
    // Allow same-origin, same-site, or missing (direct navigation/postman/old browsers)
    // Block cross-site requests to our API.
    if (fetchSite === 'cross-site') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Cross-origin requests are not allowed.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Secondary check: Origin/Referer header against host
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && !origin.includes(host)) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Origin mismatch.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
