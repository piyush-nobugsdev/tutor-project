'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const pendingRole = localStorage.getItem('pending_role')

    if (pendingRole !== 'parent' && pendingRole !== 'tutor') {
      setError('Role not found. Please sign up again.')
      return
    }

    localStorage.removeItem('pending_role')

    const createProfile = async (role: 'parent' | 'tutor') => {
      const supabase = createSupabaseBrowserClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Not authenticated. Please sign up again.'); return }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          role,
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
          email: user.email!,
          phone: user.user_metadata.phone || null,
        })

      if (insertError) {
        // Profile already exists — just route them to their dashboard
        if (insertError.code === '23505') {
          const { data: profile } = await supabase
            .from('profiles').select('role').eq('user_id', user.id).single()
          if (profile) { router.push(`/dashboard/${profile.role}`); return }
        }
        setError(insertError.message)
        return
      }

      router.push(`/dashboard/${role}`)
      router.refresh()
    }

    createProfile(pendingRole)
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md text-center">
          <p className="text-red-600 font-medium">Something went wrong</p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-4 text-gray-600">Setting up your account…</p>
      </div>
    </div>
  )
}