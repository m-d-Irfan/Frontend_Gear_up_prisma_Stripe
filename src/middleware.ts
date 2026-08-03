import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JwtPayload {
  id?: string;
  email?: string;
  role?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  exp?: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = parseJwt(token);

    // If token is invalid or expired
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      return response;
    }

    const role = payload.role;

    // Role-based route access controls
    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      const redirectUrl =
        role === 'PROVIDER'
          ? new URL('/dashboard/provider', request.url)
          : new URL('/dashboard/customer', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (
      pathname.startsWith('/dashboard/provider') &&
      role !== 'PROVIDER' &&
      role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
