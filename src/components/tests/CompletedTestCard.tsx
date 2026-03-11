import { TestSubject } from '@/app/actions/tutor'

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social_studies: 'Social Studies',
  hindi: 'Hindi',
}

interface CompletedTestCardProps {
  subject: string
  score: number
  takenAt: string
}

export default function CompletedTestCard({
  subject,
  score,
  takenAt,
}: CompletedTestCardProps) {
  const label = SUBJECT_LABELS[subject] ?? subject
  const passed = score >= 7
  const takenDate = new Date(takenAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
      <div className="space-y-1.5">
        <p className="text-base font-semibold text-gray-900">{label} Qualification</p>
        <p className="text-sm text-gray-500">Score: {score} / 10</p>
        <p className="text-xs text-gray-400">Taken on {takenDate}</p>
      </div>

      <span
        className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
          passed
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-600 border-red-200'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
        {passed ? 'Passed' : 'Failed'}
      </span>
    </div>
  )
}