import { ApplicationStatus } from '@/app/actions/tutor'

const STYLES: Record<ApplicationStatus, string> = {
  pending:  'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
}

const LABELS: Record<ApplicationStatus, string> = {
  pending:  'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

const DOTS: Record<ApplicationStatus, string> = {
  pending:  'bg-yellow-400',
  accepted: 'bg-emerald-500',
  rejected: 'bg-red-500',
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export default function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOTS[status]}`} />
      {LABELS[status]}
    </span>
  )
}