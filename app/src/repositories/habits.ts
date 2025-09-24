import { supabase } from '../lib/supabaseClient'
import type { HabitRecord } from '../types'

export async function listHabits() {
  const { data, error } = await supabase.from('habits').select('*').order('sort_order', { ascending: true })
  if (error) throw new Error(`Failed to list habits: ${error.message}`)
  return (data ?? []) as HabitRecord[]
}

export async function createHabit(name: string, kind: 'hardline' | 'mainline', icon?: string) {
  const { data: s } = await supabase.auth.getSession()
  const userId = s.session?.user.id
  if (!userId) throw new Error('Not authenticated')
  
  // Get the next sort_order value
  const { data: maxData } = await supabase
    .from('habits')
    .select('sort_order')
    .eq('user_id', userId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  
  const nextOrder = maxData?.sort_order ? maxData.sort_order + 1 : 1
  
  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, name, kind, icon, sort_order: nextOrder })
    .select('*')
    .single()
  if (error) throw new Error(`Failed to create habit: ${error.message}`)
  return data as HabitRecord
}

export async function deleteHabit(id: string) {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete habit: ${error.message}`)
}

export async function reorderHabits(habitIds: string[]) {
  const { data: s } = await supabase.auth.getSession()
  const userId = s.session?.user.id
  if (!userId) throw new Error('Not authenticated')
  
  // Update each habit with its new sort_order
  const updates = habitIds.map((id, index) => 
    supabase
      .from('habits')
      .update({ sort_order: index + 1 })
      .eq('id', id)
      .eq('user_id', userId)
  )
  
  const results = await Promise.all(updates)
  
  // Check if any update failed
  const errors = results.filter(result => result.error)
  if (errors.length > 0) {
    throw new Error(`Failed to reorder habits: ${errors[0].error?.message}`)
  }
}
