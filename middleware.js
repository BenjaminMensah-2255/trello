// middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          res.cookies.setAll(cookiesToSet)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Auth routes - redirect to dashboard if already authenticated
  if (pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (pathname.startsWith('/register') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (pathname.startsWith('/forgot-password') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (pathname.startsWith('/reset-password') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protected routes - redirect to login if not authenticated
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}