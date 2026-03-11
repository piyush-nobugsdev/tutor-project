import Link from 'next/link'

interface StatCardProps {
  title: string
  value: number
  description: string
  href: string
  accent: string
  iconBg: string
  icon: React.ReactNode
}

export default function StatCard({
  title,
  value,
  description,
  href,
  accent,
  iconBg,
  icon,
}: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group cursor-pointer">
        {/* Gradient accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent} opacity-60 group-hover:opacity-100 transition-opacity duration-200`}
        />

        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {title}
            </p>
            <p className="text-4xl font-bold text-gray-900 tabular-nums leading-none">
              {value}
            </p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className={`${iconBg} p-2.5 rounded-xl flex-shrink-0`}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  )
}