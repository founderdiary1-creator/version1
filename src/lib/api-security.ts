import { NextResponse } from 'next/server';

export function checkOrigin(request: Request) {
  // Enforce same-origin via Sec-Fetch-Site (supported in modern browsers)
  // This is a powerful CSRF and unauthorized cross-origin request mitigator.
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  
  if (fetchSite && fetchSite !== 'same-origin') {
    return false;
  }

  // Fallback: Check the Origin/Referer against allowed host
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host'); // e.g. localhost:3000

  // If origin/referer is present but doesn't match our host, it's cross-origin
  if (origin && host && !origin.includes(host)) {
    return false;
  }

  if (referer && host && !referer.includes(host)) {
    return false;
  }

  return true;
}

export function withOriginProtection(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    if (!checkOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Cross-origin requests are not allowed.' },
        { status: 403 }
      );
    }
    return handler(request, ...args);
  };
}
