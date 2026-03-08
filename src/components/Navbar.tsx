'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  fullName: string
  role: 'parent' | 'tutor'
  links: NavLink[]
}

export default function Navbar({ fullName, role, links }: NavbarProps) {
  const pathname = usePathname()

  const roleStyle = role === 'parent'
    ? 'bg-blue-50 border-blue-200 text-blue-600'
    : 'bg-green-50 border-green-200 text-green-600'

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">

        {/* Left — name + role badge */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-gray-900">
            Welcome back, {fullName}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${roleStyle}`}>
            {role}
          </span>
        </div>

        {/* Right — nav links */}
        <nav className="flex items-center gap-1">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            )
          })}

          <div className="w-px h-5 bg-gray-200 mx-2" />

          <a
            href="/auth/signout"
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </a>
        </nav>

      </div>
    </header>
  )
}