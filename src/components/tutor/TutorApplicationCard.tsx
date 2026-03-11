import Link from 'next/link'
import { TutorApplication } from '@/app/actions/tutor'
import ApplicationStatusBadge from '@/components/tutor/ApplicationStatusBadge'

const LOCATION_LABELS: Record<TutorApplication['locationType'], string> = {
  online: 'Online',
  in_person: 'In Person',
  both: 'Online / In Person',
}

interface TutorApplicationCardProps {
  application: TutorApplication
}

export default function TutorApplicationCard({
  application,
}: TutorApplicationCardProps) {
  const subjectLabel =
    application.subject.charAt(0).toUpperCase() + application.subject.slice(1)

  const appliedDate = new Date(application.appliedAt).toLocaleDateString(
    'en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )

  return (
    <Link href={`/dashboard/tutor/applications/${application.applicationId}`}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 p-6 flex flex-col gap-4 cursor-pointer">

        {/* Header row — subject + status badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {subjectLabel} Tutor
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Grade {application.gradeLevel}
            </p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        <div className="h-px bg-gray-50" />

        {/* Student + parent info */}
        <div className="space-y-1.5">
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
              Student: <span className="font-medium text-gray-800">{application.childName}</span>
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
              Parent: <span className="font-medium text-gray-800">{application.parentName}</span>
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Footer row — budget + date */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="font-medium text-gray-700">
              ₹{application.budgetPerHour}/hr
            </span>
            <span className="text-gray-300">·</span>
            <span>{LOCATION_LABELS[application.locationType]}</span>
          </div>
          <span className="text-xs text-gray-400">Applied {appliedDate}</span>
        </div>
      </div>
    </Link>
  )
}