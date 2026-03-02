// src/app/dashboard/parent/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ParentDashboard() {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'parent') {
    redirect('/auth')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {profile.full_name}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">My Children</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
          <p className="mt-1 text-sm text-gray-600">profiles created</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">0</p>
          <p className="mt-1 text-sm text-gray-600">job postings</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
          <p className="mt-1 text-sm text-gray-600">pending reviews</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 flex gap-4">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Child Profile
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Post a Job
          </button>
        </div>
      </div>
    </div>
  )
}