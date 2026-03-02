import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  // Check if user is already logged in
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // User is logged in, check their role and redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      redirect(`/dashboard/${profile.role}`)
    } else {
      redirect('/onboarding')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">Tutor Platform</h1>
        <p className="mt-4 text-xl text-gray-600">
          Connect students with qualified tutors
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/auth/parent"
          className="group relative overflow-hidden rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
        >
          <div className="relative z-10">
            <div className="text-xl font-bold">I'm a Parent</div>
            <div className="text-sm opacity-90">Find tutors for my child</div>
          </div>
        </Link>

        <Link
          href="/auth/tutor"
          className="group relative overflow-hidden rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow-xl"
        >
          <div className="relative z-10">
            <div className="text-xl font-bold">I'm a Tutor</div>
            <div className="text-sm text-gray-600">Start teaching students</div>
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500">
        <p>Trusted by students and tutors across India</p>
      </div>
    </main>
  )
}