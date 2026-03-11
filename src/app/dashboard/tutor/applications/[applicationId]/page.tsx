import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getApplicationDetail } from '@/app/actions/tutor'
import ApplicationStatusBadge from '@/components/tutor/ApplicationStatusBadge'

const LOCATION_LABELS = {
  online: 'Online',
  in_person: 'In Person',
  both: 'Online / In Person',
}

// Next.js 15 — params is a Promise and must be awaited
export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const { applicationId } = await params

  const application = await getApplicationDetail(applicationId)

  if (!application) notFound()

  const subjectLabel =
    application.subject.charAt(0).toUpperCase() + application.subject.slice(1)

  const appliedDate = new Date(application.appliedAt).toLocaleDateString(
    'en-IN',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className="max-w-2xl space-y-6">

      {/* Back navigation */}
      <Link
        href="/dashboard/tutor/applications"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back to Applications
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {subjectLabel} Tutor
          </h1>
          <p className="text-sm text-gray-500">Applied on {appliedDate}</p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {/* Job Information */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Job Information
        </h2>

        <div className="h-px bg-gray-50" />

        {application.description && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {application.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">Subject</p>
            <p className="text-sm font-medium text-gray-900">{subjectLabel}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">Grade Level</p>
            <p className="text-sm font-medium text-gray-900">
              Grade {application.gradeLevel}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">Hours / Week</p>
            <p className="text-sm font-medium text-gray-900">
              {application.hoursPerWeek} hours
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">Budget</p>
            <p className="text-sm font-medium text-gray-900">
              ₹{application.budgetPerHour}/hr
              {application.isNegotiable && (
                <span className="text-gray-400 font-normal ml-1">(negotiable)</span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">Location</p>
            <p className="text-sm font-medium text-gray-900">
              {LOCATION_LABELS[application.locationType]}
            </p>
          </div>
        </div>
      </section>

      {/* Student Information */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Student Information
        </h2>
        <div className="h-px bg-gray-50" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400">Student Name</p>
          <p className="text-sm font-medium text-gray-900">
            {application.childName}
          </p>
        </div>
      </section>

      {/* Parent Information */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Parent Information
        </h2>
        <div className="h-px bg-gray-50" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400">Parent Name</p>
          <p className="text-sm font-medium text-gray-900">
            {application.parentName}
          </p>
        </div>
      </section>

      {/* Application Status */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Application Status
        </h2>
        <div className="h-px bg-gray-50" />
        <ApplicationStatusBadge status={application.status} />
      </section>

    </div>
  )
}