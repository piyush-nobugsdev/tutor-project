import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to Tutor App</h1>
      <p className="mb-6 text-gray-700">
        Your personal dashboard for managing tutoring sessions
      </p>

      <Link
        href="/auth"
        className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
      >
        Get Started
      </Link>
    </main>
  )
}
