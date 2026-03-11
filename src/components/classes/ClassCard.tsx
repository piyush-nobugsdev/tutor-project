import { AcceptedClass } from '@/app/actions/tutor'

const LOCATION_LABELS: Record<AcceptedClass['locationType'], string> = {
  online: 'Online',
  in_person: 'In Person',
  both: 'Online / In Person',
}

const LOCATION_STYLES: Record<AcceptedClass['locationType'], string> = {
  online: 'bg-sky-50 text-sky-700 border-sky-100',
  in_person: 'bg-amber-50 text-amber-700 border-amber-100',
  both: 'bg-violet-50 text-violet-700 border-violet-100',
}

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social_studies: 'Social Studies',
  hindi: 'Hindi',
}

interface ClassCardProps {
  cls: AcceptedClass
}

export default function ClassCard({ cls }: ClassCardProps) {
  const subjectLabel =
    SUBJECT_LABELS[cls.subject] ??
    cls.subject.charAt(0).toUpperCase() + cls.subject.slice(1)

  return (
    <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 overflow-hidden">

      {/* Active class indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {subjectLabel} Tutoring
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Grade {cls.gradeLevel}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Location pill */}
          <span
            className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${LOCATION_STYLES[cls.locationType]}`}
          >
            {LOCATION_LABELS[cls.locationType]}
          </span>
          {/* Active badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-50" />

      {/* Student + parent */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>
            Student:{' '}
            <span className="font-medium text-gray-800">{cls.childName}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          <span>
            Parent:{' '}
            <span className="font-medium text-gray-800">{cls.parentName}</span>
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-50" />

      {/* Job details */}
      <div className="flex items-center gap-5 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{cls.hoursPerWeek} hrs/week</span>
        </div>
        <div className="flex items-center gap-1.5">
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
            ₹{cls.budgetPerHour}/hr
            {cls.isNegotiable && (
              <span className="text-gray-400 ml-1">(negotiable)</span>
            )}
          </span>
        </div>
      </div>

      {/* Description */}
      {cls.description && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {cls.description}
        </p>
      )}
    </div>
  )
}