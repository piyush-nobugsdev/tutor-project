import type { JobWithCount } from '@/app/actions/applications'

const LOCATION_LABELS: Record<string, string> = {
  online:    'Online',
  in_person: 'In Person',
  both:      'Both',
}

export default function JobSummary({ job }: { job: JobWithCount }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 capitalize">{job.subject}</h2>
          <p className="text-sm text-gray-500">
            {job.children?.name ?? '—'} · Grade {job.grade_level}
          </p>
        </div>
        <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          Open
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          ₹{Number(job.budget_per_hour).toLocaleString('en-IN')} / hr
          {job.is_negotiable && ' (negotiable)'}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {job.hours_per_week}h / week
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {LOCATION_LABELS[job.location_type] ?? job.location_type}
        </span>
        <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {job.application_count} {job.application_count === 1 ? 'application' : 'applications'}
        </span>
      </div>
    </div>
  )
}