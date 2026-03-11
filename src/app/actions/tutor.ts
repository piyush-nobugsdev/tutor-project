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

export interface AcceptedClass {
  jobId: string
  subject: string
  gradeLevel: number
  description: string
  hoursPerWeek: number
  budgetPerHour: number
  isNegotiable: boolean
  locationType: 'online' | 'in_person' | 'both'
  childName: string
  parentName: string
}

export type TestSubject = 'math' | 'science' | 'english' | 'social_studies' | 'hindi'

export interface TestQuestion {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  // correct_answer intentionally NEVER included — graded server-side only
}

export interface TestResult {
  subject: string
  score: number    // maps to test_score column
  takenAt: string
}

export interface SubmitTestResult {
  score: number
  total: number
  passed: boolean
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

  // Only subjects where tutor has passed (is_qualified = true)
  const { data: qualifications } = await supabase
    .from('tutor_qualifications')
    .select('subject')
    .eq('tutor_id', tutorId)
    .eq('is_qualified', true)

  if (!qualifications || qualifications.length === 0) return []

  const qualifiedSubjects = qualifications.map((q) => q.subject)

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
    if (error.code === '23505') {
      return { success: false, message: 'You have already applied to this job.' }
    }
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: 'Application submitted successfully.' }
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
    .eq('tutor_id', tutorId)
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

// ─── getAcceptedJobs ──────────────────────────────────────────────────────────

export async function getAcceptedJobs(): Promise<AcceptedClass[]> {
  const { supabase, tutorId } = await getProfileId()

  const { data } = await supabase
    .from('applications')
    .select(
      `job_id,
       jobs (
         subject, grade_level, description, hours_per_week, budget_per_hour,
         is_negotiable, location_type,
         children ( name ),
         profiles ( full_name )
       )`
    )
    .eq('tutor_id', tutorId)
    .eq('status', 'accepted')
    .order('updated_at', { ascending: false })

  if (!data) return []

  return data.map((row) => {
    const job = (row.jobs as unknown as any[])?.[0] ?? row.jobs
    const child = Array.isArray(job?.children) ? job.children[0] : job?.children
    const parent = Array.isArray(job?.profiles) ? job.profiles[0] : job?.profiles

    return {
      jobId: row.job_id as string,
      subject: job?.subject ?? '',
      gradeLevel: job?.grade_level ?? 0,
      description: job?.description ?? '',
      hoursPerWeek: job?.hours_per_week ?? 0,
      budgetPerHour: job?.budget_per_hour ?? 0,
      isNegotiable: job?.is_negotiable ?? false,
      locationType: job?.location_type ?? 'online',
      childName: child?.name ?? 'Unknown',
      parentName: parent?.full_name ?? 'Unknown',
    }
  })
}

// ─── getTests ─────────────────────────────────────────────────────────────────

export async function getTests(): Promise<TestSubject[]> {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('test_questions')
    .select('subject')

  if (!data) return []

  const unique = Array.from(new Set(data.map((r) => r.subject))) as TestSubject[]
  return unique
}

// ─── getResults ───────────────────────────────────────────────────────────────

export async function getResults(): Promise<TestResult[]> {
  const { supabase, tutorId } = await getProfileId()

  // Select test_score (actual column name) aliased to score in the mapped object
  const { data } = await supabase
    .from('tutor_qualifications')
    .select('subject, test_score, created_at')
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false })

  if (!data) return []

  return data.map((r) => ({
    subject: r.subject as string,
    score: (r.test_score ?? 0) as number,
    takenAt: r.created_at as string,
  }))
}

// ─── getTestQuestions ─────────────────────────────────────────────────────────
// Returns questions WITHOUT correct_answer — safe to send to client.

export async function getTestQuestions(subject: string): Promise<TestQuestion[]> {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('test_questions')
    .select('id, question_text, option_a, option_b, option_c, option_d')
    .eq('subject', subject)
    .limit(10)

  return (data ?? []) as TestQuestion[]
}

// ─── submitTest ───────────────────────────────────────────────────────────────
// Grades answers entirely server-side. correct_answer never leaves the server.

export async function submitTest(
  subject: string,
  answers: Record<string, string>
): Promise<SubmitTestResult> {
  const { supabase, tutorId } = await getProfileId()

  const { data: questions } = await supabase
    .from('test_questions')
    .select('id, correct_answer')
    .eq('subject', subject)
    .limit(10)

  if (!questions || questions.length === 0) {
    return { score: 0, total: 0, passed: false }
  }

  let score = 0
  for (const q of questions) {
    if (answers[q.id] === q.correct_answer) score++
  }

  const total = questions.length
  const passed = score >= 7

  // Upsert using actual schema columns: test_score, is_qualified, qualified_at
  await supabase.from('tutor_qualifications').upsert(
    {
      tutor_id: tutorId,
      subject,
      test_score: score,
      is_qualified: passed,
      qualified_at: passed ? new Date().toISOString() : null,
    },
    { onConflict: 'tutor_id,subject' }
  )

  return { score, total, passed }
}