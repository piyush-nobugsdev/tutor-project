'use client'

import { useState, useTransition } from 'react'
import { createJob, type CreateJobInput, type LocationType } from '@/app/actions/jobs'

interface Child { id: string; name: string; grade_level: number }

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1)

const LOCATION_LABELS: Record<LocationType, string> = {
  online:    'Online',
  in_person: 'In Person',
  both:      'Both',
}

const SUBJECTS = [
  { value: 'math',          label: 'Mathematics' },
  { value: 'science',       label: 'Science' },
  { value: 'english',       label: 'English' },
  { value: 'social_studies',label: 'Social Studies' },
  { value: 'hindi',         label: 'Hindi' },
]

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

interface Props {
  children: Child[]
  onClose: () => void
  onSuccess: () => void
}

export default function AddJobModal({ children, onClose, onSuccess }: Props) {
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
      const { error } = await createJob(form)

      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      setTimeout(onSuccess, 1000)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Post a New Job</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">Job successfully created</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

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

            <div className="grid grid-cols-2 gap-3">
              {/* Subject — constrained to exact values matching tutor_qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  required value={form.grade_level}
                  onChange={e => set('grade_level', Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required rows={3} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe what help is needed..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours / week <span className="text-red-500">*</span>
                </label>
                <input
                  required type="number" min={1} value={form.hours_per_week}
                  onChange={e => set('hours_per_week', Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget / hr (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  required type="number" min={1} value={form.budget_per_hour || ''}
                  onChange={e => set('budget_per_hour', Number(e.target.value))}
                  placeholder="500"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

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
                      type="radio" name="location_type" value={loc}
                      checked={form.location_type === loc}
                      onChange={() => set('location_type', loc)}
                      className="sr-only"
                    />
                    {LOCATION_LABELS[loc]}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox" checked={form.is_negotiable}
                onChange={e => set('is_negotiable', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">Budget is negotiable</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button" onClick={onClose} disabled={isPending}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={isPending || children.length === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating…
                  </>
                ) : 'Create Job'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}