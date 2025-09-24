import { supabase } from '../lib/supabaseClient'
import type { ScopeRecord } from '../types'

export interface CreateScopeInput {
  apex_vision?: string
  apex_resonance?: number
  quarterly_goals?: string[]
  week_priorities?: string[]
  time_blocks?: Record<string, unknown>
  daily_focus?: Record<string, unknown>
  daily_energy?: number
}

export async function createScope(input: CreateScopeInput) {
  const { data: s } = await supabase.auth.getSession()
  const userId = s.session?.user.id
  if (!userId) throw new Error('Not authenticated')
  const payload = { user_id: userId, ...input }
  const { data, error } = await supabase.from('scopes').insert(payload).select('*').single()
  if (error) throw new Error(`Failed to create scope: ${error.message}`)
  return data as ScopeRecord
}

export async function listScopes() {
  const { data, error } = await supabase.from('scopes').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to list scopes: ${error.message}`)
  return (data ?? []) as ScopeRecord[]
}

export async function getScope(id: string) {
  const { data, error } = await supabase.from('scopes').select('*').eq('id', id).single()
  if (error) throw new Error(`Failed to get scope: ${error.message}`)
  return data as ScopeRecord
}

export async function getLatestScope() {
  const { data, error } = await supabase.from('scopes').select('*').order('created_at', { ascending: false }).limit(1).single()
  if (error && (error as any).code !== 'PGRST116') throw new Error(`Failed to get latest scope: ${error.message}`)
  return (data ?? null) as ScopeRecord | null
}

export async function deleteScope(id: string) {
  const { error } = await supabase.from('scopes').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete scope: ${error.message}`)
}

export async function restoreScope(record: ScopeRecord) {
  const { error } = await supabase.from('scopes').insert({
    id: record.id,
    user_id: record.user_id,
    date: record.date,
    apex_vision: record.apex_vision,
    apex_resonance: record.apex_resonance,
    quarterly_goals: record.quarterly_goals,
    week_priorities: record.week_priorities,
    time_blocks: record.time_blocks as any,
    daily_focus: record.daily_focus as any,
    daily_energy: record.daily_energy,
    created_at: record.created_at,
  })
  if (error) throw new Error(`Failed to restore scope: ${error.message}`)
}
