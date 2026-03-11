import { createSupabaseServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

const TUTOR_NAV_LINKS = [
  { label: 'Home',        href: '/dashboard/tutor' },
  { label: 'Test',        href: '/dashboard/tutor/tests' },
  { label: 'Applications', href: '/dashboard/tutor/applications' },
  { label: 'Classes',     href: '/dashboard/tutor/classes' },
]

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  // No auth check here — dashboard/layout.tsx already verified the session.
  // We only fetch profile to get full_name for the navbar display.
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', user!.id)
    .single()

  return (
    <>
      <Navbar
        fullName={profile?.full_name ?? ''}
        role="tutor"
        links={TUTOR_NAV_LINKS}
      />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {children}
      </main>
    </>
  )
}