import Link from 'next/link'
import type { ApplicationSummary } from '@/app/actions/applications'

interface Props {
  application: ApplicationSummary
  jobId: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function ApplicationCard({ application, jobId }: Props) {
  const tutorName = application.profiles?.[0]?.full_name ?? 'Unknown Tutor'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-4">

      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
        {getInitials(tutorName)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-gray-900">{tutorName}</p>
          <span className="text-xs text-gray-400 shrink-0">
            {formatDate(application.created_at)}
          </span>
        </div>

        {/* Proposed rate */}
        {application.proposed_rate && (
          <p className="text-sm text-gray-500 mb-2">
            Proposed rate:{' '}
            <span className="font-medium text-gray-700">
              ₹{Number(application.proposed_rate).toLocaleString('en-IN')} / hr
            </span>
          </p>
        )}

        {/* Cover letter preview */}
        {application.cover_letter ? (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {application.cover_letter}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-3">No cover letter provided.</p>
        )}

        <Link
          href={`/dashboard/parent/jobs/${jobId}/applications/${application.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Application
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </div>
  )
}