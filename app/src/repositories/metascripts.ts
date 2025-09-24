import { supabase } from '../lib/supabaseClient'
import type { MetascriptRecord } from '../types'

export interface CreateMetascriptInput {
  scan1?: string
  scan2?: string
  scan3?: string
  heart_shift?: string
  head_shift_options?: string
  head_shift_resonant?: string
  hat_shift_identity?: string
  hat_shift_wisdom?: string
  integration_action?: string
  integration_embodiment?: string
  duration_minutes?: number
}

export async function createMetascript(input: CreateMetascriptInput) {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('Not authenticated')
  const payload = { user_id: userId, ...input }
  const { data, error } = await supabase.from('metascripts').insert(payload).select('*').single()
  if (error) throw new Error(`Failed to create metascript: ${error.message}`)
  return data as MetascriptRecord
}

export async function listMetascripts() {
  const { data, error } = await supabase
    .from('metascripts')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw new Error(`Failed to list metascripts: ${error.message}`)
  return (data ?? []) as MetascriptRecord[]
}

export async function getMetascript(id: string) {
  const { data, error } = await supabase.from('metascripts').select('*').eq('id', id).single()
  if (error) throw new Error(`Failed to get metascript: ${error.message}`)
  return data as MetascriptRecord
}

export async function deleteMetascript(id: string) {
  const { error } = await supabase.from('metascripts').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete metascript: ${error.message}`)
}

export async function restoreMetascript(record: MetascriptRecord) {
  // Re-insert with original id and timestamps
  const { error } = await supabase.from('metascripts').insert({
    id: record.id,
    user_id: record.user_id,
    date: record.date,
    scan1: record.scan1,
    scan2: record.scan2,
    scan3: record.scan3,
    heart_shift: record.heart_shift,
    head_shift_options: record.head_shift_options,
    head_shift_resonant: record.head_shift_resonant,
    hat_shift_identity: record.hat_shift_identity,
    hat_shift_wisdom: record.hat_shift_wisdom,
    integration_action: record.integration_action,
    integration_embodiment: record.integration_embodiment,
    duration_minutes: record.duration_minutes,
    created_at: record.created_at,
  })
  if (error) throw new Error(`Failed to restore metascript: ${error.message}`)
}
