import { supabase } from '../lib/supabaseClient'
import type { WeeklyReviewRecord } from '../types'

export interface CreateWeeklyReviewInput {
  week: number
  year: number
  resonance?: number
  fields?: Record<string, unknown>
}

export async function createWeeklyReview(input: CreateWeeklyReviewInput) {
  const { data: s } = await supabase.auth.getSession()
  const userId = s.session?.user.id
  if (!userId) throw new Error('Not authenticated')
  const payload = { user_id: userId, ...input }
  const { data, error } = await supabase
    .from('weekly_reviews')
    .insert(payload)
    .select('*')
    .single()
  if (error) throw new Error(`Failed to create weekly review: ${error.message}`)
  return data as WeeklyReviewRecord
}

export async function listWeeklyReviews() {
  const { data, error } = await supabase
    .from('weekly_reviews')
    .select('*')
    .order('year', { ascending: false })
    .order('week', { ascending: false })
  if (error) throw new Error(`Failed to list weekly reviews: ${error.message}`)
  return (data ?? []) as WeeklyReviewRecord[]
}

export async function getWeeklyReview(id: string) {
  const { data, error } = await supabase
    .from('weekly_reviews')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(`Failed to get weekly review: ${error.message}`)
  return data as WeeklyReviewRecord
}

export async function deleteWeeklyReview(id: string) {
  const { error } = await supabase.from('weekly_reviews').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete weekly review: ${error.message}`)
}

export async function restoreWeeklyReview(record: WeeklyReviewRecord) {
  const { error } = await supabase.from('weekly_reviews').insert({
    id: record.id,
    user_id: record.user_id,
    week: record.week,
    year: record.year,
    resonance: record.resonance,
    fields: record.fields as any,
    created_at: record.created_at,
  })
  if (error) throw new Error(`Failed to restore weekly review: ${error.message}`)
}
