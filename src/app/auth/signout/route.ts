// src/app/auth/signout/route.ts
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  
  console.log('Signing out user')
  await supabase.auth.signOut()
  
  // Redirect to landing page
  return NextResponse.redirect(new URL('/', request.url))
}

// Also support GET for direct browser navigation
export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient()
  
  console.log('Signing out user (GET)')
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL('/', request.url))
}