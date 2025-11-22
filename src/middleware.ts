import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware } from './middleware/security';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Apply security middleware to all API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return securityMiddleware(request);
  }
  
  // For non-API routes, just continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
