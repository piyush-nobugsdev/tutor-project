'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobWithCount {
  id: string
  subject: string
  grade_level: number
  description: string
  hours_per_week: number
  budget_per_hour: number
  is_negotiable: boolean
  location_type: string
  status: string
  created_at: string
  application_count: number
  children: { name: string } | null
}

export interface ApplicationSummary {
  id: string
  job_id: string
  cover_letter: string | null
  proposed_rate: number | null
  created_at: string
  // Supabase returns joined rows as arrays even for single foreign key relations
  profiles: {
    id: string
    full_name: string
    email: string
  }[] | null
}

export interface ApplicationDetail {
  id: string
  job_id: string
  cover_letter: string | null
  proposed_rate: number | null
  created_at: string
  // Supabase returns joined rows as arrays — access with [0]
  profiles: {
    id: string
    full_name: string
    email: string
    role: string
  }[] | null
  jobs: {
    subject: string
    grade_level: number
    budget_per_hour: number
    is_negotiable: boolean
    hours_per_week: number
    description: string
    location_type: string
  }[] | null
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getProfileId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { profileId: null, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { profileId: null, error: 'Profile not found' }
  return { profileId: profile.id as string, error: null }
}

// ─── Get jobs with application counts ────────────────────────────────────────

export async function getJobsWithCounts(): Promise<{
  data: JobWithCount[] | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { data: null, error: idError }

  const { data, error } = await supabase
    .from('jobs')
    .select(`*, children(name), applications(count)`)
    .eq('parent_id', profileId)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }

  const jobs = (data ?? []).map(job => ({
    ...job,
    application_count: job.applications?.[0]?.count ?? 0,
  })) as JobWithCount[]

  return { data: jobs, error: null }
}

// ─── Get one job ──────────────────────────────────────────────────────────────

export async function getJob(jobId: string): Promise<{
  data: JobWithCount | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { data: null, error: idError }

  const { data, error } = await supabase
    .from('jobs')
    .select(`*, children(name), applications(count)`)
    .eq('id', jobId)
    .eq('parent_id', profileId)
    .single()

  if (error) return { data: null, error: error.message }

  return {
    data: { ...data, application_count: data.applications?.[0]?.count ?? 0 } as JobWithCount,
    error: null,
  }
}

// ─── Get all applications for a job ──────────────────────────────────────────

export async function getApplications(jobId: string): Promise<{
  data: ApplicationSummary[] | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('applications')
    .select(`id, job_id, cover_letter, proposed_rate, created_at, profiles(id, full_name, email)`)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as unknown as ApplicationSummary[], error: null }
}

// ─── Get single application detail ───────────────────────────────────────────

export async function getApplicationDetail(applicationId: string): Promise<{
  data: ApplicationDetail | null
  error: string | null
}> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      cover_letter,
      proposed_rate,
      created_at,
      profiles(id, full_name, email, role),
      jobs(subject, grade_level, budget_per_hour, is_negotiable, hours_per_week, description, location_type)
    `)
    .eq('id', applicationId)
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as unknown as ApplicationDetail, error: null }
}