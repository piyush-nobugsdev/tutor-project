import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getApplicationDetail } from '@/app/actions/applications'
import ApplicationDetailComponent from '@/components/jobs/ApplicationDetail'

interface Props {
  params: Promise<{ jobId: string; applicationId: string }>  // ← Promise in Next.js 15
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { jobId, applicationId } = await params               // ← must await

  const { data: application } = await getApplicationDetail(applicationId)

  if (!application) notFound()

  return (
    <div className="space-y-6 max-w-2xl">

      <Link
        href={`/dashboard/parent/jobs/${jobId}/applications`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Applications
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
        <p className="mt-1 text-sm text-gray-500">
          {application.profiles?.[0]?.full_name ?? 'Unknown Tutor'} applied for{' '}
          <span className="capitalize">{application.jobs?.[0]?.subject}</span>
        </p>
      </div>

      <ApplicationDetailComponent application={application} />

    </div>
  )
}