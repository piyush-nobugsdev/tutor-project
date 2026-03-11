import { getTests, getResults } from '@/app/actions/tutor'
import TestCard from '@/components/tests/TestCard'
import CompletedTestCard from '@/components/tests/CompletedTestCard'
import { TestSubject } from '@/app/actions/tutor'

export default async function TutorTestsPage() {
  // Fetch available subjects and completed results in parallel
  const [availableSubjects, completedResults] = await Promise.all([
    getTests(),
    getResults(),
  ])

  // Subjects the tutor has already completed
  const completedSubjects = new Set(completedResults.map((r) => r.subject))

  // Available = all subjects that are NOT yet completed
  const remainingSubjects = availableSubjects.filter(
    (s) => !completedSubjects.has(s)
  )

  return (
    <div className="space-y-10">

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Qualification Tests
        </h1>
        <p className="text-sm text-gray-500">
          Pass a subject test to unlock tutoring jobs in that subject
        </p>
      </div>

      {/* Available Tests */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Available Tests</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Score 7 or higher out of 10 to qualify
          </p>
        </div>

        <div className="h-px bg-gray-100" />

        {remainingSubjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 px-8 text-center">
            <p className="text-sm font-medium text-gray-500">
              You have completed all available tests.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {remainingSubjects.map((subject) => (
              <TestCard key={subject} subject={subject as TestSubject} />
            ))}
          </div>
        )}
      </section>

      {/* Completed Tests */}
      {completedResults.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Completed Tests</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Your past qualification attempts
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3">
            {completedResults.map((result) => (
              <CompletedTestCard
                key={result.subject}
                subject={result.subject}
                score={result.score}
                takenAt={result.takenAt}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}