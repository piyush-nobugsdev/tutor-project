'use client'

import { useState, useTransition } from 'react'
import { AvailableJob, applyToJob } from '@/app/actions/tutor'

const LOCATION_LABELS: Record<AvailableJob['location_type'], string> = {
  online: 'Online',
  in_person: 'In Person',
  both: 'Online / In Person',
}

const LOCATION_STYLES: Record<AvailableJob['location_type'], string> = {
  online: 'bg-sky-50 text-sky-700 border-sky-100',
  in_person: 'bg-amber-50 text-amber-700 border-amber-100',
  both: 'bg-violet-50 text-violet-700 border-violet-100',
}

interface JobDetailModalProps {
  job: AvailableJob
  isOpen: boolean
  onClose: () => void
}

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
}: JobDetailModalProps) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  if (!isOpen) return null

  const subjectLabel = job.subject.charAt(0).toUpperCase() + job.subject.slice(1)

  const postedDate = new Date(job.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  function handleApply() {
    setResult(null)
    startTransition(async () => {
      const res = await applyToJob(job.id)
      setResult(res)
      if (res.success) {
        // Brief pause so the tutor sees the success message before close
        setTimeout(() => {
          onClose()
          setResult(null)
        }, 1200)
      }
    })
  }

  function handleClose() {
    setResult(null)
    onClose()
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      {/* Modal container — stop propagation so clicking inside doesn't close */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {subjectLabel} Tutor
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Grade {job.grade_level}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${LOCATION_STYLES[job.location_type]}`}
            >
              {LOCATION_LABELS[job.location_type]}
            </span>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Description */}
          {job.description && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                About the Role
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Grade Level
              </p>
              <p className="text-sm font-medium text-gray-900">
                Grade {job.grade_level}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Hours / Week
              </p>
              <p className="text-sm font-medium text-gray-900">
                {job.hours_per_week} hours
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Budget
              </p>
              <p className="text-sm font-medium text-gray-900">
                ₹{job.budget_per_hour}/hr
                {job.is_negotiable && (
                  <span className="text-gray-400 font-normal ml-1">(negotiable)</span>
                )}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Location
              </p>
              <p className="text-sm font-medium text-gray-900">
                {LOCATION_LABELS[job.location_type]}
              </p>
            </div>
          </div>

          {/* Posted date */}
          <p className="text-xs text-gray-400">
            Posted on {postedDate}
          </p>
        </div>

        {/* Footer — feedback message + apply button */}
        <div className="px-6 pb-6 space-y-3">

          {/* Inline feedback */}
          {result && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                result.success
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {result.success ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {result.message}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  {result.message}
                </span>
              )}
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={isPending || result?.success === true}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : (
              'Apply for Job'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}