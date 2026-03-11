import { getTutorApplications } from '@/app/actions/tutor'
import TutorApplicationCard from '@/components/tutor/TutorApplicationCard'

export default async function TutorApplicationsPage() {
  const applications = await getTutorApplications()

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-gray-500">
          Track the status of every job you have applied to
        </p>
      </div>

      <div className="h-px bg-gray-100" />

      {applications.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 px-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">
            You haven&apos;t applied to any jobs yet.
          </p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Browse available jobs on the dashboard to start applying.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((application) => (
            <TutorApplicationCard
              key={application.applicationId}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  )
}