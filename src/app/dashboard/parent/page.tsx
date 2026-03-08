import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getChildren } from '@/app/actions/children'
import StatCard from '@/components/StatCard'

export default async function ParentDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/auth')

  const { data: children } = await getChildren()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, subject, grade_level, applications(count)')
    .eq('parent_id', profile.id)
    .eq('status', 'open')

  const totalApplications = jobs?.reduce(
    (sum, job) => sum + (job.applications?.[0]?.count ?? 0), 0
  ) ?? 0

  return (
    <div className="space-y-8">

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your children's tutoring at a glance.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-5">
        <StatCard
          label="Children"
          value={children?.length ?? 0}
          subtitle="profiles created"
          color="blue"
        />
        <StatCard
          label="Active Jobs"
          value={jobs?.length ?? 0}
          subtitle="open postings"
          color="green"
        />
        <StatCard
          label="Applications"
          value={totalApplications}
          subtitle="pending reviews"
          color="purple"
        />
      </div>

      {/* Hub cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Card A — Children */}
        <Link
          href="/dashboard/parent/children"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                My Children
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {children?.length ?? 0}
                <span className="ml-2 text-base font-medium text-gray-400">
                  {children?.length === 1 ? 'child' : 'children'}
                </span>
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>

          {children && children.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-5">
              {children.map(child => (
                <span
                  key={child.id}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {child.name} · Grade {child.grade_level}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-5">No children added yet.</p>
          )}

          <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
            Manage profiles
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Card B — Jobs */}
        <Link
          href="/dashboard/parent/jobs"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-green-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Active Jobs
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {jobs?.length ?? 0}
                <span className="ml-2 text-base font-medium text-gray-400">
                  {jobs?.length === 1 ? 'posting' : 'postings'}
                </span>
              </p>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-100 p-2.5">
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
          </div>

          {jobs && jobs.length > 0 ? (
            <div className="flex flex-col gap-2 mb-5">
              {jobs.map(job => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-sm text-gray-700 capitalize">
                      {job.subject} · Grade {job.grade_level}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {job.applications?.[0]?.count ?? 0}
                    <span className="ml-1 font-normal text-gray-400 text-xs">applications</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-5">No active jobs posted yet.</p>
          )}

          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 group-hover:gap-2.5 transition-all">
            Review applications
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

      </div>
    </div>
  )
}