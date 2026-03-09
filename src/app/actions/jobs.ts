'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type LocationType = 'online' | 'in_person' | 'both'

export interface CreateJobInput {
  child_id: string
  subject: string
  grade_level: number
  description: string
  hours_per_week: number
  budget_per_hour: number
  is_negotiable: boolean
  location_type: LocationType
}

export interface Job {
  id: string
  parent_id: string
  child_id: string
  subject: string
  grade_level: number
  description: string
  hours_per_week: number
  budget_per_hour: number
  is_negotiable: boolean
  location_type: LocationType
  status: 'open' | 'closed' | 'filled'
  created_at: string
  children: { name: string } | null
}

// ─── Helper: get profiles.id from auth uid ────────────────────────────────────

async function getProfileId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { profileId: null, error: 'Not authenticated' }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) return { profileId: null, error: 'Profile not found' }

  return { profileId: profile.id as string, error: null }
}

// ─── Get open jobs for logged-in parent ──────────────────────────────────────

export async function getJobs(): Promise<{ data: Job[] | null; error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { data: null, error: idError }

  const { data, error } = await supabase
    .from('jobs')
    .select('*, children(name)')
    .eq('parent_id', profileId)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// ─── Create a new job ─────────────────────────────────────────────────────────

export async function createJob(
  input: CreateJobInput
): Promise<{ data: Job | null; error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { data: null, error: idError }

  // Validate
  if (!input.child_id)           return { data: null, error: 'Please select a child' }
  if (!input.subject.trim())     return { data: null, error: 'Subject is required' }
  if (!input.description.trim()) return { data: null, error: 'Description is required' }
  if (input.grade_level < 1 || input.grade_level > 12)
                                 return { data: null, error: 'Grade must be between 1 and 12' }
  if (input.hours_per_week < 1)  return { data: null, error: 'Hours per week must be at least 1' }
  if (input.budget_per_hour <= 0) return { data: null, error: 'Budget must be greater than 0' }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      parent_id:       profileId,
      child_id:        input.child_id,
      subject:         input.subject.trim(),
      grade_level:     input.grade_level,
      description:     input.description.trim(),
      hours_per_week:  input.hours_per_week,
      budget_per_hour: input.budget_per_hour,
      is_negotiable:   input.is_negotiable,
      location_type:   input.location_type,
      status:          'open',
    })
    .select('*, children(name)')
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard/parent/jobs')
  return { data, error: null }
}