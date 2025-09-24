import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMetascript } from '../repositories/metascripts'
import type { MetascriptRecord } from '../types'

export default function MetascriptDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<MetascriptRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const rec = await getMetascript(id)
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
        <h1 className="text-2xl font-semibold">Metascript Detail</h1>
        <Link to="/metascript/history" className="text-sm underline">Terug</Link>
      </div>
      <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()} · duur: {item.duration_minutes ?? 0} min</div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Scan">{[item.scan1, item.scan2, item.scan3].filter(Boolean).join(' ')}</Field>
        <Field label="Heart Shift">{item.heart_shift}</Field>
        <Field label="Head Shift (opties)">{item.head_shift_options}</Field>
        <Field label="Head Shift (resonant)">{item.head_shift_resonant}</Field>
        <Field label="Hat Shift (identiteit)">{item.hat_shift_identity}</Field>
        <Field label="Hat Shift (wijsheid)">{item.hat_shift_wisdom}</Field>
        <Field label="Actie">{item.integration_action}</Field>
        <Field label="Belichaming">{item.integration_embodiment}</Field>
      </div>
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
