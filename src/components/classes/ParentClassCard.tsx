import { ParentClass } from '@/app/actions/applications'

const LOCATION_LABELS: Record<string, string> = {
  online: 'Online',
  in_person: 'In Person',
  both: 'Online / In Person',
}

const LOCATION_STYLES: Record<string, string> = {
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

interface ParentClassCardProps {
  cls: ParentClass
}

export default function ParentClassCard({ cls }: ParentClassCardProps) {
  const subjectLabel =
    SUBJECT_LABELS[cls.subject] ??
    cls.subject.charAt(0).toUpperCase() + cls.subject.slice(1)
  const locationStyle = LOCATION_STYLES[cls.locationType] ?? LOCATION_STYLES.online
  const locationLabel = LOCATION_LABELS[cls.locationType] ?? cls.locationType

  return (
    <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 overflow-hidden">

      {/* Active indicator */}
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
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${locationStyle}`}>
            {locationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-50" />

      {/* People */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>
            Student: <span className="font-medium text-gray-800">{cls.childName}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <span>
            Tutor: <span className="font-medium text-gray-800">{cls.tutorName}</span>
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-50" />

      {/* Job details */}
      <div className="flex items-center gap-5 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{cls.hoursPerWeek} hrs/week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
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