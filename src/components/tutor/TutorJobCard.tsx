'use client'

import { useState } from 'react'
import { AvailableJob } from '@/app/actions/tutor'
import JobDetailModal from '@/components/tutor/Jobdetailmodal'

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

interface TutorJobCardProps {
  job: AvailableJob
}

export default function TutorJobCard({ job }: TutorJobCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const subjectLabel = job.subject.charAt(0).toUpperCase() + job.subject.slice(1)

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group p-6 flex flex-col gap-4 cursor-pointer"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300" />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {subjectLabel}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Grade {job.grade_level}
            </p>
          </div>

          <span
            className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${LOCATION_STYLES[job.location_type]} whitespace-nowrap flex-shrink-0`}
          >
            {LOCATION_LABELS[job.location_type]}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-50" />

        {/* Stats row */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>{job.hours_per_week} hrs/week</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>
              ₹{job.budget_per_hour}/hr
              {job.is_negotiable && (
                <span className="text-gray-400 ml-1">(negotiable)</span>
              )}
            </span>
          </div>
        </div>

        {/* Footer CTA hint */}
        <div className="mt-auto pt-1 flex items-center justify-end">
          <span className="text-xs font-medium text-blue-500 group-hover:text-blue-600 transition-colors">
            View details →
          </span>
        </div>
      </div>

      <JobDetailModal
        job={job}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}