'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [autoCreating, setAutoCreating] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const router = useRouter()

  const createProfile = async (role: 'parent' | 'tutor') => {
    setIsLoading(true)
    setError('')

    try {
      const supabase = createSupabaseBrowserClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      console.log('🔥 Creating profile for user:', user.email, 'as', role)

      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          role: role,
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
          email: user.email!,
          phone: user.user_metadata.phone || null,
        })

      if (insertError) {
        // Check if profile already exists
        if (insertError.code === '23505') {
          console.log('⚠️ Profile already exists, fetching...')
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single()
          
          if (profile) {
            console.log('✅ Existing profile found, role:', profile.role)
            router.push(`/dashboard/${profile.role}`)
            return
          }
        }
        throw insertError
      }

      console.log('✅ Profile created successfully with role:', role)
      console.log('🚀 Redirecting to /dashboard/' + role)
      
      // Redirect to role-specific dashboard
      router.push(`/dashboard/${role}`)
      router.refresh()
    } catch (err: any) {
      console.error('❌ Profile creation error:', err)
      setError(err.message || 'Failed to create profile. Please try again.')
      setIsLoading(false)
    }
  }

  // Try to get role from localStorage (set during auth)
  useEffect(() => {
    console.log('🔍 Onboarding page mounted')
    const pendingRole = localStorage.getItem('pending_role')
    console.log('📦 localStorage pending_role:', pendingRole)
    
    setDebugInfo(`Role from localStorage: ${pendingRole || 'NOT FOUND'}`)
    
    if (pendingRole === 'parent' || pendingRole === 'tutor') {
      console.log('✅ Valid role found, auto-creating profile as:', pendingRole)
      setAutoCreating(true)
      createProfile(pendingRole)
      localStorage.removeItem('pending_role')
    } else {
      console.log('⚠️ No valid role in localStorage, showing manual selection')
      setIsLoading(false)
    }
  }, [])

  if (autoCreating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Setting up your account...</p>
          <p className="mt-2 text-sm text-gray-500">{debugInfo}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">Choose how you'll use the platform</p>
          {debugInfo && (
            <p className="mt-2 text-xs text-red-600">{debugInfo}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4 rounded-lg bg-white p-8 shadow-md">
          <button
            onClick={() => createProfile('parent')}
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="text-lg font-semibold">I'm a Parent</div>
            <div className="mt-1 text-sm text-gray-600">
              Find qualified tutors for my child
            </div>
          </button>

          <button
            onClick={() => createProfile('tutor')}
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="text-lg font-semibold">I'm a Tutor</div>
            <div className="mt-1 text-sm text-gray-600">
              Offer tutoring services to students
            </div>
          </button>

          {isLoading && !autoCreating && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-600 border-r-transparent"></div>
              Creating your profile...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}