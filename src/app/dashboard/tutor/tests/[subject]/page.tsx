import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTestQuestions } from '@/app/actions/tutor'
import TestForm from '@/components/tests/TestForm'

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social_studies: 'Social Studies',
  hindi: 'Hindi',
}

const VALID_SUBJECTS = ['math', 'science', 'english', 'social_studies', 'hindi']

// Next.js 15 — params is a Promise and must be awaited
export default async function TestTakingPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params

  // Guard against invalid subject slugs
  if (!VALID_SUBJECTS.includes(subject)) notFound()

  const questions = await getTestQuestions(subject)

  if (questions.length === 0) notFound()

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject

  return (
    <div className="space-y-8">

      {/* Back link */}
      <Link
        href="/dashboard/tutor/tests"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back to Tests
      </Link>

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {subjectLabel} Test
        </h1>
        <p className="text-sm text-gray-500">
          {questions.length} questions · Answer all to submit · Pass mark: 7 / 10
        </p>
      </div>

      <div className="h-px bg-gray-100" />

      {/* TestForm is a client component — handles state, submission, result screen */}
      <TestForm subject={subject} questions={questions} />
    </div>
  )
}