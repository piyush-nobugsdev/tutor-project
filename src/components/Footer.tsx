export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">

        <p className="text-xs text-gray-400">© 2026 TutorLink. All rights reserved.</p>

        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map(label => (
            <a
              key={label}
              href="#"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">System Status: Online</span>
        </div>

      </div>
    </footer>
  )
}