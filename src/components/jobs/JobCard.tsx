import Link from 'next/link'
import type { JobWithCount } from '@/app/actions/applications'

const LOCATION_LABELS: Record<string, string> = {
  online:    'Online',
  in_person: 'In Person',
  both:      'Both',
}

interface Props {
  job: JobWithCount
}

export default function JobCard({ job }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 capitalize">{job.subject}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {job.children?.name ?? '—'} · Grade {job.grade_level}
          </p>
        </div>
        <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-700 shrink-0">
          Open
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {job.hours_per_week}h / week
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          ₹{Number(job.budget_per_hour).toLocaleString('en-IN')} / hr
          {job.is_negotiable && ' (negotiable)'}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {LOCATION_LABELS[job.location_type] ?? job.location_type}
        </span>
      </div>

      {/* Footer — application count + CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{job.application_count}</span>
          {' '}{job.application_count === 1 ? 'application' : 'applications'}
        </span>

        <Link
          href={`/dashboard/parent/jobs/${job.id}/applications`}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          View Applications →
        </Link>
      </div>

    </div>
  )
}