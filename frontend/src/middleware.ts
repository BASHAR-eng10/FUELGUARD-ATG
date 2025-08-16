import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user

  // Define protected routes
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = nextUrl.pathname === '/signin'
  const isRootPage = nextUrl.pathname === '/'

  console.log(`🔍 Middleware: ${nextUrl.pathname} | Logged in: ${isLoggedIn} | Role: ${user?.role || 'none'}`)

  // If user is not logged in and trying to access protected route
  if (!isLoggedIn && isProtectedRoute) {
    console.log('❌ Redirecting to signin: Not authenticated')
    return NextResponse.redirect(new URL('/signin', nextUrl.origin))
  }

  // If user is logged in
  if (isLoggedIn && user) {
    // If trying to access signin page while logged in, redirect based on role
    if (isAuthPage) {
      const redirectUrl = getDashboardUrlForUser(user)
      console.log(`✅ Redirecting authenticated user from signin to: ${redirectUrl}`)
      return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin))
    }

    // If accessing root page while logged in, redirect based on role
    if (isRootPage) {
      const redirectUrl = getDashboardUrlForUser(user)
      console.log(`✅ Redirecting authenticated user from root to: ${redirectUrl}`)
      return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin))
    }

    // Check if user is trying to access wrong dashboard section
    if (isProtectedRoute) {
      const allowedUrl = getDashboardUrlForUser(user)
      const currentPath = nextUrl.pathname

      // If user is SuperAdmin/System Administrator, they can access any dashboard
      if (user.canAccessAll) {
        // Allow access to any dashboard route
        return NextResponse.next()
      }

      // For non-SuperAdmin users, restrict to their appropriate dashboard
      if (!currentPath.startsWith(allowedUrl)) {
        console.log(`🔄 Redirecting user to appropriate dashboard: ${allowedUrl}`)
        return NextResponse.redirect(new URL(allowedUrl, nextUrl.origin))
      }
    }
  }

  // Allow the request to continue
  return NextResponse.next()
})

function getDashboardUrlForUser(user: any): string {
  // SuperAdmin/System Administrator can access general dashboard by default
  if (user.canAccessAll || user.role === 'System Administrator') {
    return '/dashboard/general'
  }
  
  // Station-specific users go to station dashboard
  if (user.stationId) {
    return '/dashboard/station/' + user.stationId
  }
  
  // Default fallback for other roles
  return '/dashboard/general'
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/dashboard/:path*'
  ]
}
