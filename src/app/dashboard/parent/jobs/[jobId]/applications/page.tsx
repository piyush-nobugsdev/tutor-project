import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJob, getApplications } from '@/app/actions/applications'
import JobSummary from '@/components/jobs/JobSummary'
import ApplicationCard from '@/components/jobs/ApplicationCard'

interface Props {
  params: Promise<{ jobId: string }>   // ← Promise in Next.js 15
}

export default async function ApplicationsPage({ params }: Props) {
  const { jobId } = await params        // ← must await before destructuring

  const [{ data: job }, { data: applications }] = await Promise.all([
    getJob(jobId),
    getApplications(jobId),
  ])

  if (!job) notFound()

  return (
    <div className="space-y-6">

      <Link
        href="/dashboard/parent/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="mt-1 text-sm text-gray-500 capitalize">
          {job.subject} · Grade {job.grade_level}
        </p>
      </div>

      <JobSummary job={job} />

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Applicants ({applications?.length ?? 0})
        </h2>

        {!applications || applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-gray-700">No applications yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Tutors who apply to this job will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                jobId={jobId}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}