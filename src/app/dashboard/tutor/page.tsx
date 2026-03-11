import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StatCard from '@/components/tutor/StatCard'
import TutorJobCard from '@/components/tutor/TutorJobCard'
import { getAvailableJobs } from '@/app/actions/tutor'

export default async function TutorDashboardPage() {
  const supabase = await createSupabaseServerClient()

  // Step 1 — get auth user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/tutor')

  // Step 2 — resolve profiles.id (Two-ID pattern)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const tutorId = profile.id

  // Step 3 — fetch stat counts + available jobs all in parallel
  const [
    { count: qualificationsCount },
    { count: applicationsCount },
    { count: activeJobsCount },
    availableJobs,
  ] = await Promise.all([
    supabase
      .from('tutor_qualifications')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId),

    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId),

    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId)
      .eq('status', 'accepted'),

    getAvailableJobs(),
  ])

  const stats = [
    {
      title: 'Qualifications Taken',
      value: qualificationsCount ?? 0,
      description: 'Tests completed',
      href: '/dashboard/tutor/tests',
      accent: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-50',
      icon: (
        <svg
          className="w-5 h-5 text-violet-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
          />
        </svg>
      ),
    },
    {
      title: 'Jobs Applied',
      value: applicationsCount ?? 0,
      description: 'Applications submitted',
      href: '/dashboard/tutor/applications',
      accent: 'from-sky-500 to-blue-600',
      iconBg: 'bg-sky-50',
      icon: (
        <svg
          className="w-5 h-5 text-sky-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
      ),
    },
    {
      title: 'Active Jobs',
      value: activeJobsCount ?? 0,
      description: 'Classes currently teaching',
      href: '/dashboard/tutor/classes',
      accent: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50',
      icon: (
        <svg
          className="w-5 h-5 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-10">

      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Your teaching activity at a glance
        </p>
      </div>

      {/* Section 1 — Stats Row */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Section 2 — Available Jobs */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Available Jobs
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Tutoring opportunities matching your qualifications
            </p>
          </div>
          {/* Job count badge */}
          {availableJobs.length > 0 && (
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
              {availableJobs.length} open
            </span>
          )}
        </div>

        <div className="h-px bg-gray-100" />

        {availableJobs.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 px-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">
              No jobs available right now.
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
              Once new tutoring requests are posted, they will appear here.
            </p>
          </div>
        ) : (
          /* Job grid — cards are display-only; click/apply added in Step 4 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableJobs.map((job) => (
              <TutorJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}