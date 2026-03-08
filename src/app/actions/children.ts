'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Child, CreateChildInput } from '@/types/database'

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

// ─── Get all children for the logged-in parent ────────────────────────────────

export async function getChildren(): Promise<{ data: Child[] | null; error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { data: null, error: idError }

  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', profileId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// ─── Create a new child profile ───────────────────────────────────────────────

export async function createChild(
  input: CreateChildInput
): Promise<{ data: Child | null; error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { data: null, error: idError }

  const name = input.name.trim()
  if (!name || name.length < 2) return { data: null, error: 'Name must be at least 2 characters' }

  const grade = Number(input.grade_level)
  if (!grade || grade < 1 || grade > 12) return { data: null, error: 'Grade must be between 1 and 12' }

  const { data, error } = await supabase
    .from('children')
    .insert({ parent_id: profileId, name, grade_level: grade })
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard/parent/children')
  return { data, error: null }
}

// ─── Delete a child profile ───────────────────────────────────────────────────

export async function deleteChild(childId: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient()
  const { profileId, error: idError } = await getProfileId(supabase)
  if (idError || !profileId) return { error: idError }

  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .eq('parent_id', profileId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/parent/children')
  return { error: null }
}