import { supabase } from '../lib/supabaseClient'

export type HabitStatus = 'checked' | 'missed' | 'not_checked'

function pad2(n: number) { return n.toString().padStart(2, '0') }
function formatDateLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function startOfWeek(d = new Date()) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = (date.getDay() + 6) % 7 // Monday=0
  date.setDate(date.getDate() - day)
  date.setHours(0, 0, 0, 0)
  return date
}

export function getStartOfWeek(date = new Date()) {
  return startOfWeek(date)
}

export async function getWeekStatus(habitId: string, weekStart = startOfWeek()) {
  const dates: string[] = Array.from({ length: 7 }).map((_, i) => {
    const dt = new Date(weekStart)
    dt.setDate(weekStart.getDate() + i)
    return formatDateLocal(dt)
  })
  const { data, error } = await supabase
    .from('habit_logs')
    .select('date,status')
    .eq('habit_id', habitId)
    .gte('date', dates[0])
    .lte('date', dates[6])
  if (error) throw new Error(`Failed to get week status: ${error.message}`)
  const map = new Map<string, HabitStatus>()
  for (const r of data ?? []) map.set(r.date as string, r.status as HabitStatus)
  return dates.map((d) => ({ date: d, status: (map.get(d) ?? 'not_checked') as HabitStatus }))
}

export async function toggleHabitDay(habitId: string, date: string) {
  const { data: s } = await supabase.auth.getSession()
  const userId = s.session?.user.id
  if (!userId) throw new Error('Not authenticated')
  const { data: existing, error: readErr } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .maybeSingle()
  if (readErr) throw new Error(`Failed to read day: ${readErr.message}`)

  if (!existing) {
    const { error } = await supabase
      .from('habit_logs')
      .insert({ user_id: userId, habit_id: habitId, date, status: 'checked' })
    if (error) throw new Error(`Failed to check day: ${error.message}`)
    return 'checked' as HabitStatus
  }
  const newStatus = existing.status === 'checked' ? 'not_checked' : 'checked'
  const { error } = await supabase
    .from('habit_logs')
    .update({ status: newStatus })
    .eq('id', existing.id)
  if (error) throw new Error(`Failed to toggle day: ${error.message}`)
  return newStatus as HabitStatus
}

export function computeProgress(statuses: { status: HabitStatus }[]) {
  const total = statuses.length || 1
  const done = statuses.filter((s) => s.status === 'checked').length
  return Math.round((done / total) * 100)
}

export async function getStreaks(habitId: string): Promise<{ current: number; best: number }> {
  const since = new Date()
  since.setDate(since.getDate() - 180)
  const { data, error } = await supabase
    .from('habit_logs')
    .select('date,status')
    .eq('habit_id', habitId)
    .gte('date', formatDateLocal(since))
    .order('date', { ascending: true })
  if (error) throw new Error(`Failed to get streaks: ${error.message}`)

  if (!data || data.length === 0) return { current: 0, best: 0 }

  // Build contiguous timeline from first log date to today (local)
  const firstDate = new Date(data[0].date as string)
  const today = new Date()
  const dayMs = 24 * 60 * 60 * 1000
  const start = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate())
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const filled: { date: string; status: HabitStatus }[] = []
  for (let t = start.getTime(); t <= end.getTime(); t += dayMs) {
    const d = formatDateLocal(new Date(t))
    const found = data.find((x) => (x.date as string) === d)
    filled.push({ date: d, status: (found?.status as HabitStatus) ?? 'not_checked' })
  }

  // Best streak: max consecutive checked anywhere
  let best = 0
  let run = 0
  for (const r of filled) {
    if (r.status === 'checked') { run += 1; best = Math.max(best, run) } else { run = 0 }
  }

  // Current streak: consecutive checked ending at the last checked date
  const lastCheckedIdx = [...filled].map((r) => r.status).lastIndexOf('checked')
  let current = 0
  if (lastCheckedIdx >= 0) {
    for (let i = lastCheckedIdx; i >= 0; i--) {
      if (filled[i].status === 'checked') current += 1
      else break
    }
  }

  return { current, best }
}
