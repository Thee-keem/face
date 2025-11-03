import { NextRequest, NextFetchEvent } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // This function is called after authentication is verified
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }
        
        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
}
