import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listWeeklyReviews, deleteWeeklyReview, restoreWeeklyReview } from '../repositories/weeklyReviews'
import type { WeeklyReviewRecord } from '../types'
import { useToast } from '../context/ToastContext'

export default function WeeklyReviewHistory() {
  const [items, setItems] = useState<WeeklyReviewRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const [lastDeleted, setLastDeleted] = useState<WeeklyReviewRecord | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await listWeeklyReviews()
        setItems(data)
      } catch (e: any) {
        setError(e.message)
      }
    })()
  }, [])

  async function onDelete(id: string) {
    const snap = items.find((x) => x.id === id) || null
    if (!confirm('Weet je zeker dat je deze review wilt verwijderen?')) return
    try {
      await deleteWeeklyReview(id)
      setItems((v) => v.filter((i) => i.id !== id))
      setLastDeleted(snap)
      showToast({
        message: 'Review verwijderd',
        actionLabel: 'Ongedaan maken',
        onAction: async () => {
          if (lastDeleted) {
            try {
              await restoreWeeklyReview(lastDeleted)
              const data = await listWeeklyReviews()
              setItems(data)
            } catch {}
          }
        },
      })
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (error) return <div className="text-red-700">{error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Weekly Reviews</h1>
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="border rounded p-3 flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">Week {r.week} – {r.year}</div>
              <div className="text-sm text-gray-500">Resonantie: {r.resonance ?? '—'}</div>
              <Link className="text-sm underline" to={`/weekly-review/${r.id}`}>Bekijken</Link>
            </div>
            <button onClick={() => onDelete(r.id)} className="text-sm text-red-700 underline">Verwijderen</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
