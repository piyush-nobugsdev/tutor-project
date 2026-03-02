// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }

  const supabase = await createSupabaseServerClient()
  
  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('OAuth error:', error.message)
    return NextResponse.redirect(`${origin}/auth?error=auth_failed`)
  }

  const user = data.user
  if (!user) {
    console.error('No user returned after OAuth')
    return NextResponse.redirect(`${origin}/auth?error=no_user`)
  }

  // Check if profile already exists
  const { data: existingProfile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  // If profile exists, redirect to their dashboard
  if (existingProfile) {
    console.log(`Existing user: ${user.email}, role: ${existingProfile.role}`)
    return NextResponse.redirect(`${origin}/dashboard/${existingProfile.role}`)
  }

  // NEW USER: No profile exists yet
  // Role was stored in localStorage before OAuth redirect
  // Redirect to onboarding to create profile
  console.log(`New user: ${user.email}, redirecting to onboarding`)
  return NextResponse.redirect(`${origin}/onboarding`)
}