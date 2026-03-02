// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Check if user has a profile (role assigned)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  // If no profile exists, user needs to complete onboarding
  // This happens on first login - redirect to onboarding page
  if (!profile) {
    redirect('/onboarding')
  }

  // User has profile - ensure they're on correct role-based route
  const currentPath = '' // We'll handle this in each role-specific layout
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Tutor Platform</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 capitalize">
                {profile.role}
              </span>
             <form action="/auth/signout" method="POST">
  <button 
    type="submit"
    className="text-sm text-gray-600 hover:text-gray-900"
  >
    Sign out
  </button>
</form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}