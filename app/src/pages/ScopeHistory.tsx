import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listScopes, deleteScope, restoreScope } from '../repositories/scopes'
import type { ScopeRecord } from '../types'
import { useToast } from '../context/ToastContext'

export default function ScopeHistory() {
  const [items, setItems] = useState<ScopeRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const [lastDeleted, setLastDeleted] = useState<ScopeRecord | null>(null)

  async function load() {
    try {
      const data = await listScopes()
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(id: string) {
    const snap = items.find((x) => x.id === id) || null
    if (!confirm('Weet je zeker dat je deze SCOPE wilt verwijderen?')) return
    try {
      await deleteScope(id)
      setItems((v) => v.filter((i) => i.id !== id))
      setLastDeleted(snap)
      showToast({
        message: 'SCOPE verwijderd',
        actionLabel: 'Ongedaan maken',
        onAction: async () => {
          if (lastDeleted) {
            try {
              await restoreScope(lastDeleted)
              await load()
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
      <h1 className="text-2xl font-semibold">SCOPE Geschiedenis</h1>
      <ul className="space-y-2">
        {items.map((s) => (
          <li key={s.id} className="border rounded p-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-gray-500">{new Date(s.created_at).toLocaleString()}</div>
              <div className="font-medium truncate max-w-md">{s.apex_vision || '(zonder visie)'} </div>
              <Link className="text-sm underline" to={`/scope/${s.id}`}>Bekijken</Link>
            </div>
            <button onClick={() => onDelete(s.id)} className="text-sm text-red-700 underline">Verwijderen</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
