// src/app/dashboard/tutor/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TutorDashboard() {
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

  if (!profile || profile.role !== 'tutor') {
    redirect('/auth')
  }

  // Check if tutor is qualified
  const { data: qualifications } = await supabase
    .from('tutor_qualifications')
    .select('*')
    .eq('tutor_id', profile.id)

  const isQualified = qualifications && qualifications.some(q => q.is_qualified)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {profile.full_name}!
        </p>
      </div>

      {!isQualified && (
        <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Qualification Required
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                You must pass a qualification test before you can apply to jobs.
              </p>
              <button className="mt-3 rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700">
                Take Qualification Test
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Qualifications</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {qualifications?.filter(q => q.is_qualified).length || 0}
          </p>
          <p className="mt-1 text-sm text-gray-600">subjects qualified</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">0</p>
          <p className="mt-1 text-sm text-gray-600">submitted</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
          <p className="mt-1 text-sm text-gray-600">accepted</p>
        </div>
      </div>

      {isQualified && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 flex gap-4">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Browse Jobs
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              My Applications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}