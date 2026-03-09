import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getJobsWithCounts } from '@/app/actions/applications'
import JobCard from '@/components/jobs/JobCard'
import AddJobButton from './_components/Addjobbutton'

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/auth')

  // Children needed for the Add Job form dropdown
  const { data: children } = await supabase
    .from('children')
    .select('id, name, grade_level')
    .eq('parent_id', profile.id)
    .order('name')

  // Jobs with application counts in one query
  const { data: jobs } = await getJobsWithCounts()

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your active tutoring job postings.
          </p>
        </div>
        <AddJobButton children={children ?? []} />
      </div>

      {/* Active jobs list */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Active Jobs ({jobs?.length ?? 0})
        </h2>

        {!jobs || jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-gray-700">No active jobs yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Post your first job to start finding tutors.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}