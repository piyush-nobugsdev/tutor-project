import type { ApplicationDetail } from '@/app/actions/applications'

const LOCATION_LABELS: Record<string, string> = {
  online:    'Online',
  in_person: 'In Person',
  both:      'Both',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function ApplicationDetailComponent({ application }: { application: ApplicationDetail }) {
  // Supabase returns joins as arrays — access [0] to get the single related row
  const tutor = application.profiles?.[0]
  const job   = application.jobs?.[0]
  const name  = tutor?.full_name ?? 'Unknown Tutor'

  return (
    <div className="space-y-5">

      {/* Tutor info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
          Tutor Information
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
            {getInitials(name)}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{name}</p>
            {tutor?.email && (
              <p className="text-sm text-gray-500">{tutor.email}</p>
            )}
          </div>
        </div>
      </section>

      {/* Application content */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
          Application Details
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Applied on</p>
            <p className="text-sm text-gray-700">{formatDate(application.created_at)}</p>
          </div>
          {application.proposed_rate && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Proposed rate</p>
              <p className="text-sm text-gray-700">
                ₹{Number(application.proposed_rate).toLocaleString('en-IN')} / hr
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">Cover letter</p>
            {application.cover_letter ? (
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {application.cover_letter}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">No cover letter provided.</p>
            )}
          </div>
        </div>
      </section>

      {/* Job details */}
      {job && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
            Job Details
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Subject</p>
              <p className="text-sm text-gray-700 capitalize">{job.subject}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Grade</p>
              <p className="text-sm text-gray-700">{job.grade_level}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Location</p>
              <p className="text-sm text-gray-700">{LOCATION_LABELS[job.location_type] ?? job.location_type}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Budget</p>
              <p className="text-sm text-gray-700">
                ₹{Number(job.budget_per_hour).toLocaleString('en-IN')} / hr
                {job.is_negotiable && <span className="ml-1 text-xs text-gray-400">(negotiable)</span>}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Hours / week</p>
              <p className="text-sm text-gray-700">{job.hours_per_week}h</p>
            </div>
          </div>
          {job.description && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
            </div>
          )}
        </section>
      )}

      {/* Actions — structure only */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button disabled className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed">
            Accept Application
          </button>
          <button disabled className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 opacity-50 cursor-not-allowed">
            Reject Application
          </button>
          <button disabled className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 opacity-50 cursor-not-allowed">
            Message Tutor
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Accept / reject and messaging will be available in a future update.
        </p>
      </section>

    </div>
  )
}