import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMetascripts, deleteMetascript, restoreMetascript } from '../repositories/metascripts'
import type { MetascriptRecord } from '../types'
import { useToast } from '../context/ToastContext'

export default function MetascriptHistory() {
  const [items, setItems] = useState<MetascriptRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const [lastDeleted, setLastDeleted] = useState<MetascriptRecord | null>(null)

  async function load() {
    try {
      const data = await listMetascripts()
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(id: string) {
    const it = items.find((x) => x.id === id) || null
    if (!confirm('Weet je zeker dat je deze entry wilt verwijderen?')) return
    try {
      await deleteMetascript(id)
      setItems((v) => v.filter((i) => i.id !== id))
      setLastDeleted(it)
      showToast({
        message: 'Metascript verwijderd',
        actionLabel: 'Ongedaan maken',
        onAction: async () => {
          if (lastDeleted) {
            try {
              await restoreMetascript(lastDeleted)
              await load()
            } catch (e) {
              // silently ignore; could show an error toast
            }
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
      <h1 className="text-2xl font-semibold">Metascript Geschiedenis</h1>
      <ul className="space-y-2">
        {items.map((m) => (
          <li key={m.id} className="border rounded p-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-gray-500">{new Date(m.created_at).toLocaleString()}</div>
              <div className="font-medium truncate max-w-md">{m.heart_shift || '(geen heart)'}</div>
              <Link className="text-sm underline" to={`/metascript/${m.id}`}>Bekijken</Link>
            </div>
            <button onClick={() => onDelete(m.id)} className="text-sm text-red-700 underline">Verwijderen</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
