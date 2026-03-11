'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// All tutor-side server actions live here, mirroring:
//   src/app/actions/children.ts  (parent)
//   src/app/actions/jobs.ts      (parent)
//   src/app/actions/applications.ts (parent)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AvailableJob {
  id: string
  subject: string
  grade_level: number
  description: string
  hours_per_week: number
  budget_per_hour: number
  is_negotiable: boolean
  location_type: 'online' | 'in_person' | 'both'
  created_at: string
}

export interface ApplyResult {
  success: boolean
  message: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getProfileId() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/tutor')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  return { supabase, tutorId: profile.id as string }
}

// ─── getAvailableJobs ─────────────────────────────────────────────────────────

export async function getAvailableJobs(): Promise<AvailableJob[]> {
  const { supabase, tutorId } = await getProfileId()

  // Fetch tutor's qualified subjects
  const { data: qualifications } = await supabase
    .from('tutor_qualifications')
    .select('subject')
    .eq('tutor_id', tutorId)

  if (!qualifications || qualifications.length === 0) return []

  const qualifiedSubjects = qualifications.map((q) => q.subject)

  // Fetch open jobs matching qualified subjects — include description for modal
  const { data: jobs } = await supabase
    .from('jobs')
    .select(
      'id, subject, grade_level, description, hours_per_week, budget_per_hour, is_negotiable, location_type, created_at'
    )
    .eq('status', 'open')
    .in('subject', qualifiedSubjects)
    .order('created_at', { ascending: false })

  return (jobs ?? []) as AvailableJob[]
}

// ─── applyToJob ───────────────────────────────────────────────────────────────

export async function applyToJob(jobId: string): Promise<ApplyResult> {
  const { supabase, tutorId } = await getProfileId()

  const { error } = await supabase.from('applications').insert({
    job_id: jobId,
    tutor_id: tutorId,
    status: 'pending',
  })

  if (error) {
    // Postgres unique violation code — duplicate application
    if (error.code === '23505') {
      return {
        success: false,
        message: 'You have already applied to this job.',
      }
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }

  return {
    success: true,
    message: 'Application submitted successfully.',
  }
}

// ─── TutorApplication types ───────────────────────────────────────────────────

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface TutorApplication {
  applicationId: string
  status: ApplicationStatus
  appliedAt: string

  subject: string
  gradeLevel: number
  budgetPerHour: number
  hoursPerWeek: number
  locationType: 'online' | 'in_person' | 'both'

  childName: string
  parentName: string
}

export interface TutorApplicationDetail extends TutorApplication {
  description: string
  isNegotiable: boolean
}

// ─── getTutorApplications ─────────────────────────────────────────────────────

export async function getTutorApplications(): Promise<TutorApplication[]> {
  const { supabase, tutorId } = await getProfileId()

  const { data } = await supabase
    .from('applications')
    .select(
      `id, status, created_at,
       jobs (
         subject, grade_level, budget_per_hour, hours_per_week, location_type,
         children ( name ),
         profiles ( full_name )
       )`
    )
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false })

  if (!data) return []

  return data.map((row) => {
    // Supabase joins return arrays even for single FK — access with [0]
    const job = (row.jobs as unknown as any[])[0] ?? row.jobs
    const child = Array.isArray(job?.children) ? job.children[0] : job?.children
    const parent = Array.isArray(job?.profiles) ? job.profiles[0] : job?.profiles

    return {
      applicationId: row.id as string,
      status: row.status as ApplicationStatus,
      appliedAt: row.created_at as string,

      subject: job?.subject ?? '',
      gradeLevel: job?.grade_level ?? 0,
      budgetPerHour: job?.budget_per_hour ?? 0,
      hoursPerWeek: job?.hours_per_week ?? 0,
      locationType: job?.location_type ?? 'online',

      childName: child?.name ?? 'Unknown',
      parentName: parent?.full_name ?? 'Unknown',
    }
  })
}

// ─── getApplicationDetail ─────────────────────────────────────────────────────

export async function getApplicationDetail(
  applicationId: string
): Promise<TutorApplicationDetail | null> {
  const { supabase, tutorId } = await getProfileId()

  const { data } = await supabase
    .from('applications')
    .select(
      `id, status, created_at,
       jobs (
         subject, grade_level, description, budget_per_hour, hours_per_week,
         location_type, is_negotiable,
         children ( name ),
         profiles ( full_name )
       )`
    )
    .eq('id', applicationId)
    .eq('tutor_id', tutorId) // RLS: tutor can only see their own
    .single()

  if (!data) return null

  const job = (data.jobs as unknown as any[])?.[0] ?? data.jobs
  const child = Array.isArray(job?.children) ? job.children[0] : job?.children
  const parent = Array.isArray(job?.profiles) ? job.profiles[0] : job?.profiles

  return {
    applicationId: data.id as string,
    status: data.status as ApplicationStatus,
    appliedAt: data.created_at as string,

    subject: job?.subject ?? '',
    gradeLevel: job?.grade_level ?? 0,
    description: job?.description ?? '',
    budgetPerHour: job?.budget_per_hour ?? 0,
    hoursPerWeek: job?.hours_per_week ?? 0,
    locationType: job?.location_type ?? 'online',
    isNegotiable: job?.is_negotiable ?? false,

    childName: child?.name ?? 'Unknown',
    parentName: parent?.full_name ?? 'Unknown',
  }
}