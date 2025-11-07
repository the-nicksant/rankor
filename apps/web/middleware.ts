import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAccessToken } from '@/lib/auth'

// Define protected routes
const protectedRoutes = [
  '/athlete/dashboard',
  '/athlete/profile',
  '/athlete/settings',
  // Add more protected routes as needed
]

// Define public routes that should redirect if authenticated
const publicRoutes = [
  '/athlete/login',
  '/athlete/register',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the access token from cookies
  const token = request.cookies.get('access_token')?.value
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/athlete/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If accessing a public route with a token, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/athlete/dashboard', request.url))
  }
  
  return NextResponse.next()
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
}
