export interface MetascriptRecord {
  id: string
  user_id: string
  date: string
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
  created_at: string
}

export interface ScopeRecord {
  id: string
  user_id: string
  date: string
  apex_vision?: string
  apex_resonance?: number
  quarterly_goals?: string[]
  week_priorities?: string[]
  time_blocks?: Record<string, unknown>
  daily_focus?: Record<string, unknown>
  daily_energy?: number
  created_at: string
}

export interface HabitRecord {
  id: string
  user_id: string
  name: string
  kind: 'hardline' | 'mainline'
  icon?: string
  sort_order: number
  created_at: string
}

export interface HabitLogRecord {
  id: string
  user_id: string
  habit_id: string
  date: string
  status: 'checked' | 'missed' | 'not_checked'
  created_at: string
}

export interface WeeklyReviewRecord {
  id: string
  user_id: string
  week: number
  year: number
  resonance?: number
  fields?: Record<string, unknown>
  created_at: string
}
