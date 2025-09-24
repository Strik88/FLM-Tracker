import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getScope } from '../repositories/scopes'
import type { ScopeRecord } from '../types'

export default function ScopeDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<ScopeRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const rec = await getScope(id)
        setItem(rec)
      } catch (e: any) {
        setError(e.message)
      }
    })()
  }, [id])

  if (error) return <div className="text-red-700">{error}</div>
  if (!item) return <div>Laden…</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SCOPE Detail</h1>
        <Link to="/scope/history" className="text-sm underline">Terug</Link>
      </div>
      <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
      <Field label="Apex Vision">{item.apex_vision}</Field>
      <Field label="Resonantie">{item.apex_resonance}</Field>
      <Field label="Kwartaal doelen">{(item.quarterly_goals || []).join(', ')}</Field>
      <Field label="Week prioriteiten">{(item.week_priorities || []).join(', ')}</Field>
      <Field label="Tijdsblokken">{JSON.stringify(item.time_blocks)}</Field>
      <Field label="Daily focus">{JSON.stringify(item.daily_focus)}</Field>
      <Field label="Energie">{item.daily_energy}</Field>
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
