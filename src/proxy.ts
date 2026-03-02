// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /dashboard/* routes - require authentication
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Get user's profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    // If no profile, redirect to onboarding
    if (!profile && path !== '/dashboard') {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Role-based route protection
    if (profile) {
      // Parent trying to access tutor dashboard
      if (path.startsWith('/dashboard/tutor') && profile.role !== 'tutor') {
        return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
      }

      // Tutor trying to access parent dashboard
      if (path.startsWith('/dashboard/parent') && profile.role !== 'parent') {
        return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
      }

      // Admin access (admins can access everything)
      // No restrictions for admin role

      // If accessing just /dashboard, redirect to role-specific dashboard
      if (path === '/dashboard') {
        return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
      }
    }
  }

  // Redirect authenticated users away from /auth
  if (path === '/auth' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
    } else {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}