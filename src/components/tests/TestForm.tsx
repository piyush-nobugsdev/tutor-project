'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { TestQuestion as TQ, SubmitTestResult, submitTest } from '@/app/actions/tutor'
import TestQuestion from '@/components/tests/TestQuestions'

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social_studies: 'Social Studies',
  hindi: 'Hindi',
}

interface TestFormProps {
  subject: string
  questions: TQ[]
}

export default function TestForm({ subject, questions }: TestFormProps) {
  // answers map: questionId → selected option key ('a'|'b'|'c'|'d')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<SubmitTestResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  function handleSelect(questionId: string, key: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: key }))
  }

  function handleSubmit() {
    startTransition(async () => {
      const res = await submitTest(subject, answers)
      setResult(res)
    })
  }

  // ── Result screen ───────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-5">

          {/* Icon */}
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${result.passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {result.passed ? (
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Test Completed</h2>
            <p className="text-gray-500 text-sm">{subjectLabel} Qualification</p>
          </div>

          {/* Score */}
          <div className="inline-flex flex-col items-center bg-gray-50 rounded-2xl px-10 py-5 space-y-1">
            <span className="text-4xl font-bold text-gray-900 tabular-nums">
              {result.score} <span className="text-xl text-gray-400 font-normal">/ {result.total}</span>
            </span>
            <span className={`text-sm font-semibold ${result.passed ? 'text-emerald-600' : 'text-red-500'}`}>
              {result.passed ? 'Passed ✓' : 'Failed'}
            </span>
          </div>

          {/* Contextual message */}
          {result.passed ? (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              You are now qualified to apply for <span className="font-semibold">{subjectLabel}</span> tutoring jobs.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              You need at least 7/10 to qualify. You can retake the test to improve your score.
            </p>
          )}

          <Link
            href="/dashboard/tutor/tests"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150"
          >
            ← Back to Tests
          </Link>
        </div>
      </div>
    )
  }

  // ── Question form ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>{answeredCount} of {questions.length} answered</span>
          <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <TestQuestion
              index={i + 1}
              questionText={q.question_text}
              options={[
                { key: 'a', text: q.option_a },
                { key: 'b', text: q.option_b },
                { key: 'c', text: q.option_c },
                { key: 'd', text: q.option_d },
              ]}
              selectedOption={answers[q.id] ?? null}
              onSelect={(key) => handleSelect(q.id, key)}
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <p className="text-sm text-gray-400">
          {allAnswered
            ? 'All questions answered — ready to submit.'
            : `${questions.length - answeredCount} question${questions.length - answeredCount === 1 ? '' : 's'} remaining.`}
        </p>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150"
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
            'Submit Test'
          )}
        </button>
      </div>
    </div>
  )
}