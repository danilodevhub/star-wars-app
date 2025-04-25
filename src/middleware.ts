import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createLogger } from '@/app/lib/logger';

// Create a logger for middleware operations
const logger = createLogger('Middleware');

// API paths that should be cached more aggressively
const STATIC_PATHS = [
  '/api/people/', 
  '/api/movies/'
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add response headers for better performance
  const pathname = request.nextUrl.pathname;
  
  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // If this is an API route for Star Wars data, add appropriate cache headers
  if (pathname.startsWith('/api/')) {
    // Log API requests in development to help with debugging    
    logger.debug(`API Request: ${request.method} ${request.nextUrl.toString()}`);
    
    
    // Ensure the URL is valid
    try {
      // Test if the URL is valid by reconstructing it
      new URL(request.url);
    } catch (e) {
      logger.error('Invalid URL in middleware:', e);
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Set default cache headers for all API routes
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    // For specific resources by ID (e.g., /api/people/1, /api/movies/3), cache longer
    const pathParts = pathname.split('/').filter(Boolean);
    const hasIdParam = pathParts.length >= 3 && !isNaN(Number(pathParts[2]));
    
    if (STATIC_PATHS.some(path => pathname.startsWith(path)) && hasIdParam) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    }
  }
  
  return response;
}

// Apply middleware to API routes and pages using Star Wars data
export const config = {
  matcher: [
    '/api/:path*',
    '/(search)/:path*',
    '/(details)/:path*'
  ],
}; 