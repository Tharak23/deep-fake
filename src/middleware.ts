import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = 
    pathname.startsWith('/research-platform') || 
    pathname.startsWith('/api/papers') || 
    pathname.startsWith('/api/datasets') || 
    pathname.startsWith('/api/experiments') || 
    pathname.startsWith('/api/upload');
  
  // Check if the path is an auth route
  const isAuthRoute = pathname.startsWith('/auth');
  
  // Get the token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If the route is protected and the user is not authenticated, redirect to sign in
  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If the user is authenticated and trying to access an auth route, redirect to dashboard
  if (isAuthRoute && token && pathname !== '/auth/error') {
    return NextResponse.redirect(new URL('/research-platform', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/research-platform/:path*',
    '/auth/:path*',
    '/api/papers/:path*',
    '/api/datasets/:path*',
    '/api/experiments/:path*',
    '/api/upload',
  ],
}; 