import { getAcceptedJobs } from '@/app/actions/tutor'
import ClassCard from '@/components/classes/ClassCard'

export default async function TutorClassesPage() {
  const classes = await getAcceptedJobs()

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          My Classes
        </h1>
        <p className="text-sm text-gray-500">
          Jobs you have been accepted for
        </p>
      </div>

      <div className="h-px bg-gray-100" />

      {classes.length === 0 ? (
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
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">
            No active classes yet.
          </p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Classes will appear here once a parent accepts your application.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.jobId} cls={cls} />
          ))}
        </div>
      )}
    </div>
  )
}