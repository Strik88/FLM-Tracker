import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createHabit, deleteHabit, listHabits, reorderHabits } from '../repositories/habits'
import { computeProgress, getStartOfWeek, getWeekStatus, getStreaks, toggleHabitDay } from '../repositories/habitLogs'
import type { HabitRecord } from '../types'

function formatLocal(d: Date) {
  return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' })
}

function isoLocal(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isSameWeek(a: Date, b: Date) {
  const sa = getStartOfWeek(a)
  const sb = getStartOfWeek(b)
  return sa.getFullYear() === sb.getFullYear() && sa.getMonth() === sb.getMonth() && sa.getDate() === sb.getDate()
}

export default function Staq() {
  const [habits, setHabits] = useState<HabitRecord[]>([])
  const [name, setName] = useState('')
  const [kind, setKind] = useState<'hardline' | 'mainline'>('hardline')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [draggedHabit, setDraggedHabit] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const h = await listHabits()
        setHabits(h)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function addHabit() {
    if (!name.trim()) return
    try {
      const h = await createHabit(name.trim(), kind)
      setHabits((v) => [...v, h])
      setName('')
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function removeHabit(id: string) {
    try {
      await deleteHabit(id)
      setHabits((v) => v.filter((h) => h.id !== id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function handleReorder(draggedId: string, targetId: string) {
    const draggedIndex = habits.findIndex(h => h.id === draggedId)
    const targetIndex = habits.findIndex(h => h.id === targetId)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    // Optimistic update
    const newHabits = [...habits]
    const [draggedHabit] = newHabits.splice(draggedIndex, 1)
    newHabits.splice(targetIndex, 0, draggedHabit)
    setHabits(newHabits)
    
    try {
      await reorderHabits(newHabits.map(h => h.id))
    } catch (e: any) {
      setError(e.message)
      // Revert on error
      const h = await listHabits()
      setHabits(h)
    }
  }

  if (loading) return <div>Laden…</div>
  if (error) return <div className="text-red-700">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">STAQ Tracker</h1>
        <Link to="/staq" className="text-sm underline">Geschiedenis</Link>
      </div>

      <div className="flex gap-2 items-center">
        <input className="border rounded p-2" placeholder="Nieuwe gewoonte (bijv. Morning Workout)" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="border rounded p-2" value={kind} onChange={(e) => setKind(e.target.value as any)}>
          <option value="hardline">Hardline (non-negotiable)</option>
          <option value="mainline">Mainline (flex)</option>
        </select>
        <button onClick={addHabit} className="bg-indigo-600 text-white px-3 py-2 rounded">Toevoegen</button>
      </div>

      <div className="grid gap-4">
        {habits.map((h) => (
          <HabitRow 
            key={h.id} 
            habit={h} 
            onRemove={() => removeHabit(h.id)}
            onDragStart={() => setDraggedHabit(h.id)}
            onDragEnd={() => setDraggedHabit(null)}
            onDrop={(targetId: string) => {
              if (draggedHabit && draggedHabit !== targetId) {
                handleReorder(draggedHabit, targetId)
              }
            }}
            isDragging={draggedHabit === h.id}
          />
        ))}
      </div>
    </div>
  )
}

function HabitRow({ 
  habit, 
  onRemove, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  isDragging 
}: { 
  habit: HabitRecord; 
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
  isDragging: boolean;
}) {
  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek())
  const [week, setWeek] = useState<{ date: string; status: 'checked' | 'missed' | 'not_checked' }[]>([])
  const [streaks, setStreaks] = useState<{ current: number; best: number }>({ current: 0, best: 0 })
  const progress = useMemo(() => computeProgress(week), [week])

  async function load() {
    const data = await getWeekStatus(habit.id, weekStart)
    setWeek(data)
    const st = await getStreaks(habit.id)
    setStreaks(st)
  }

  useEffect(() => { load() }, [])
  useEffect(() => { load() }, [weekStart])

  function shiftWeek(delta: number) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + delta * 7)
    setWeekStart(d)
  }

  async function toggle(idx: number) {
    const target = week[idx]
    const selectedWeekIsPast = !isSameWeek(weekStart, new Date()) && weekStart < getStartOfWeek(new Date())

    // Future guard only for current week; allow today
    if (!selectedWeekIsPast) {
      const todayStr = isoLocal(new Date())
      if (target.date > todayStr) return
    }

    // optimistic update
    const prev = week
    const nextStatus = target.status === 'checked' ? 'not_checked' : 'checked'
    setWeek((w) => w.map((it, i) => (i === idx ? { ...it, status: nextStatus } : it)))

    try {
      await toggleHabitDay(habit.id, target.date)
      // refresh from server and streaks
      const [freshWeek, st] = await Promise.all([
        getWeekStatus(habit.id, weekStart),
        getStreaks(habit.id),
      ])
      setWeek(freshWeek)
      setStreaks(st)
    } catch (e) {
      setWeek(prev)
    }
  }

  const days = ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO']
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return formatLocal(d)
  })

  return (
    <div 
      className={`border rounded p-3 bg-white transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(habit.id)
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-800 px-1 py-1 bg-gray-100 rounded text-lg font-bold">
            ≡
          </div>
          <div className="font-medium">{habit.name} {habit.kind === 'hardline' ? '🔥' : '💎'}</div>
        </div>
        <button onClick={onRemove} className="text-sm underline hover:text-red-600">Verwijderen</button>
      </div>

      <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
        <div>Streak: <span className="font-semibold">{streaks.current}</span> (beste: {streaks.best})</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border rounded" onClick={() => shiftWeek(-1)}>← Vorige week</button>
          <button className="px-2 py-1 border rounded" onClick={() => setWeekStart(getStartOfWeek())}>Deze week</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {week.map((d, i) => (
          <button
            aria-label={`Toggle ${days[i]}`}
            key={d.date}
            onClick={() => toggle(i)}
            className={`rounded p-2 text-center transition-transform duration-150 ${d.status === 'checked' ? 'bg-green-500 text-white scale-100 hover:scale-105' : d.status === 'missed' ? 'bg-red-100 text-red-700 hover:scale-105' : 'bg-gray-100 text-gray-700 hover:scale-105'}`}
          >
            <div className="text-xs font-semibold">{days[i]}</div>
            <div className="text-[10px] opacity-70">{dates[i]}</div>
          </button>
        ))}
      </div>

      <div className="h-2 bg-gray-200 rounded">
        <div className="h-2 bg-green-500 rounded" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-xs text-gray-600 mt-1">Weekprogressie: {progress}%</div>
    </div>
  )
}
