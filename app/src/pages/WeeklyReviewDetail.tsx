import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getWeeklyReview } from '../repositories/weeklyReviews'
import type { WeeklyReviewRecord } from '../types'

export default function WeeklyReviewDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<WeeklyReviewRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const rec = await getWeeklyReview(id)
        setItem(rec)
      } catch (e: any) {
        setError(e.message)
      }
    })()
  }, [id])

  if (error) return <div className="text-red-700">{error}</div>
  if (!item) return <div>Laden…</div>

  const fields = (item.fields || {}) as any

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Weekly Review Detail</h1>
        <Link to="/weekly-review/history" className="text-sm underline">Terug</Link>
      </div>
      <div className="text-sm text-gray-500">Week {item.week} – {item.year}</div>
      <Field label="Wins">{(fields.wins || []).join('\n')}</Field>
      <Field label="APEX Focus">{fields.apexFocus}</Field>
      <Field label="Volgende stap">{fields.nextStep}</Field>
      <Field label="SCOPE">{(fields.scope || []).join('\n')}</Field>
      <Field label="Resonantie">{item.resonance}</Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="border rounded p-3 bg-white">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="whitespace-pre-wrap text-sm">{children || '—'}</div>
    </div>
  )
}
