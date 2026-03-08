import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

const PARENT_NAV_LINKS = [
  { label: 'Home',     href: '/dashboard/parent' },
  { label: 'Children', href: '/dashboard/parent/children' },
  { label: 'Jobs',     href: '/dashboard/parent/jobs' },
  { label: 'Classes',  href: '/dashboard/parent/classes' },
]

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('user_id', user.id)
    .single()

  // Role guard — a tutor hitting /dashboard/parent gets redirected
  if (!profile || profile.role !== 'parent') redirect('/dashboard/tutor')

  return (
    <>
      <Navbar fullName={profile.full_name} role="parent" links={PARENT_NAV_LINKS} />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {children}
      </main>
    </>
  )
}