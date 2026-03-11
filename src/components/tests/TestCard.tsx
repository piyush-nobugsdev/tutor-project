import Link from 'next/link'
import { TestSubject } from '@/app/actions/tutor'

const SUBJECT_LABELS: Record<TestSubject, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social_studies: 'Social Studies',
  hindi: 'Hindi',
}

const SUBJECT_STYLES: Record<TestSubject, { accent: string; iconBg: string; iconColor: string }> = {
  math:          { accent: 'from-violet-400 to-purple-500', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
  science:       { accent: 'from-sky-400 to-blue-500',     iconBg: 'bg-sky-50',    iconColor: 'text-sky-600' },
  english:       { accent: 'from-amber-400 to-orange-500', iconBg: 'bg-amber-50',  iconColor: 'text-amber-600' },
  social_studies:{ accent: 'from-emerald-400 to-teal-500', iconBg: 'bg-emerald-50',iconColor: 'text-emerald-600' },
  hindi:         { accent: 'from-rose-400 to-pink-500',    iconBg: 'bg-rose-50',   iconColor: 'text-rose-600' },
}

interface TestCardProps {
  subject: TestSubject
}

export default function TestCard({ subject }: TestCardProps) {
  const label = SUBJECT_LABELS[subject] ?? subject
  const style = SUBJECT_STYLES[subject] ?? SUBJECT_STYLES.math

  return (
    <Link href={`/dashboard/tutor/tests/${subject}`}>
      <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-200 overflow-hidden group p-6 flex items-center justify-between cursor-pointer">

        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${style.accent} opacity-50 group-hover:opacity-100 transition-opacity duration-200`} />

        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-400">10 questions · Pass with 7/10</p>
        </div>

        <span className="flex-shrink-0 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors duration-150">
          Start Test →
        </span>
      </div>
    </Link>
  )
}