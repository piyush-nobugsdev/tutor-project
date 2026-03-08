interface StatCardProps {
  label: string
  value: number
  subtitle: string
  color?: 'blue' | 'green' | 'purple'
}

const colorMap = {
  blue:   'text-blue-600',
  green:  'text-green-600',
  purple: 'text-purple-600',
}

export default function StatCard({ label, value, subtitle, color = 'blue' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color]}`}>{value}</p>
      <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}