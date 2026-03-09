'use client'

import { useState, useTransition } from 'react'
import { createJob, type Job, type CreateJobInput, type LocationType } from '@/app/actions/jobs'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Child {
  id: string
  name: string
  grade_level: number
}

interface Props {
  initialJobs: Job[]
  children: Child[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1)

const LOCATION_LABELS: Record<LocationType, string> = {
  online:    'Online',
  in_person: 'In Person',
  both:      'Both',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyJobs({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      </div>
      <p className="font-semibold text-gray-700">No active jobs yet</p>
      <p className="mt-1 text-sm text-gray-400">Post your first job to start finding tutors.</p>
      <button
        onClick={onAdd}
        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Post a Job
      </button>
    </div>
  )
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 capitalize">{job.subject}</h3>
          <p className="text-sm text-gray-500">
            {job.children?.name ?? '—'} · Grade {job.grade_level}
          </p>
        </div>
        <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          Open
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {job.hours_per_week}h / week
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          ₹{Number(job.budget_per_hour).toLocaleString('en-IN')} / hr
          {job.is_negotiable && ' (negotiable)'}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 capitalize">
          {LOCATION_LABELS[job.location_type]}
        </span>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400">Posted {formatDate(job.created_at)}</p>
    </div>
  )
}

// ─── Add Job Modal ────────────────────────────────────────────────────────────

const EMPTY_FORM: CreateJobInput = {
  child_id:        '',
  subject:         '',
  grade_level:     1,
  description:     '',
  hours_per_week:  1,
  budget_per_hour: 0,
  is_negotiable:   false,
  location_type:   'online',
}

function AddJobModal({
  children,
  onClose,
  onSuccess,
}: {
  children: Child[]
  onClose: () => void
  onSuccess: (job: Job) => void
}) {
  const [form, setForm] = useState<CreateJobInput>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function set<K extends keyof CreateJobInput>(key: K, value: CreateJobInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const { data, error } = await createJob(form)

      if (error || !data) {
        setError(error ?? 'Failed to create job')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess(data)
        onClose()
      }, 1000)
    })
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Post a New Job</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">Job successfully created</p>
            <p className="mt-1 text-sm text-gray-500">It will now appear in your active jobs.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">

            {/* Error alert */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Child selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Child <span className="text-red-500">*</span>
              </label>
              {children.length === 0 ? (
                <p className="text-sm text-amber-600 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                  No children added yet.{' '}
                  <a href="/dashboard/parent/children" className="underline">Add a child first.</a>
                </p>
              ) : (
                <select
                  required
                  value={form.child_id}
                  onChange={e => set('child_id', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Select a child</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.name} (Grade {child.grade_level})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Subject + Grade row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.grade_level}
                  onChange={e => set('grade_level', Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe what help is needed..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </div>

            {/* Hours + Budget row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours / week <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  value={form.hours_per_week}
                  onChange={e => set('hours_per_week', Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget / hr (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  value={form.budget_per_hour || ''}
                  onChange={e => set('budget_per_hour', Number(e.target.value))}
                  placeholder="500"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            {/* Location type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {(['online', 'in_person', 'both'] as LocationType[]).map(loc => (
                  <label
                    key={loc}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                      form.location_type === loc
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="location_type"
                      value={loc}
                      checked={form.location_type === loc}
                      onChange={() => set('location_type', loc)}
                      className="sr-only"
                    />
                    {LOCATION_LABELS[loc]}
                  </label>
                ))}
              </div>
            </div>

            {/* Negotiable checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_negotiable}
                onChange={e => set('is_negotiable', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Budget is negotiable</span>
            </label>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || children.length === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating…
                  </>
                ) : (
                  'Create Job'
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}

// ─── Jobs Client (root) ───────────────────────────────────────────────────────

export default function JobsClient({ initialJobs, children }: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [showModal, setShowModal] = useState(false)

  function handleJobCreated(job: Job) {
    setJobs(prev => [job, ...prev])  // optimistic prepend
  }

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
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Active jobs section */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Active Jobs ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <EmptyJobs onAdd={() => setShowModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddJobModal
          children={children}
          onClose={() => setShowModal(false)}
          onSuccess={handleJobCreated}
        />
      )}

    </div>
  )
}