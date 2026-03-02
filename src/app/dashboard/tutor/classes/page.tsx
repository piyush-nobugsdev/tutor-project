import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TutorClassesPage() {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'tutor') {
    redirect('/auth')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="mt-2 text-gray-600">
          View your accepted tutoring jobs
        </p>
      </div>

      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No active classes yet</p>
        <p className="mt-2 text-sm text-gray-400">
          Apply to jobs to get started
        </p>
      </div>
    </div>
  )
}