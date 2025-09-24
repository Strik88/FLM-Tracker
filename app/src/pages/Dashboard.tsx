import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listMetascripts } from '../repositories/metascripts'
import { getLatestScope } from '../repositories/scopes'
import { listHabits } from '../repositories/habits'
import { listWeeklyReviews } from '../repositories/weeklyReviews'

export default function Dashboard() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  const configured = Boolean(url && key)
  const { user, signOut } = useAuth()

  const [metaHeart, setMetaHeart] = useState<string>('')
  const [scopeVision, setScopeVision] = useState<string>('')
  const [habitCount, setHabitCount] = useState<number>(0)
  const [lastReview, setLastReview] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const metas = await listMetascripts()
        if (metas.length) setMetaHeart(metas[0].heart_shift || '')
      } catch {}
      try {
        const sc = await getLatestScope()
        if (sc) setScopeVision(sc.apex_vision || '')
      } catch {}
      try {
        const h = await listHabits()
        setHabitCount(h.length)
      } catch {}
      try {
        const wr = await listWeeklyReviews()
        if (wr.length) setLastReview(`Week ${wr[0].week} – ${wr[0].year}`)
      } catch {}
    })()
  }, [])

  const showConfig = import.meta.env.DEV || !configured

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={() => signOut()} className="text-sm underline">Uitloggen</button>
      </div>
      {user && (
        <div className="text-sm text-gray-700">Ingelogd als: <span className="font-medium">{user.email}</span></div>
      )}
      {showConfig && (
        <div className={`rounded border px-3 py-2 text-sm ${configured ? 'border-green-300 bg-green-50 text-green-800' : 'border-yellow-300 bg-yellow-50 text-yellow-800'}`}>
          Supabase config: {configured ? 'gevonden' : 'niet gevonden'}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Metascript" link="/metascript" subtitle="Laatste" content={metaHeart || '—'} />
        <Card title="SCOPE" link="/scope" subtitle="Apex Vision" content={scopeVision || '—'} />
        <Card title="STAQ" link="/staq" subtitle="Aantal habits" content={String(habitCount)} />
        <Card title="Weekly Review" link="/weekly-review" subtitle="Laatste" content={lastReview || '—'} />
      </div>
    </div>
  )
}

function Card({ title, link, subtitle, content }: { title: string; link: string; subtitle: string; content: string }) {
  return (
    <Link to={link} className="block border rounded p-4 bg-white hover:shadow">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
      <div className="font-semibold truncate">{content}</div>
    </Link>
  )
}
