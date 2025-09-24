import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createWeeklyReview } from '../repositories/weeklyReviews'

function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

export default function WeeklyReview() {
  const week = useMemo(() => getWeekNumber(new Date()), [])
  const year = new Date().getFullYear()

  const [wins1, setWins1] = useState('')
  const [wins2, setWins2] = useState('')
  const [wins3, setWins3] = useState('')
  const [apexFocus, setApexFocus] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [top1, setTop1] = useState('')
  const [top2, setTop2] = useState('')
  const [top3, setTop3] = useState('')
  const [resonance, setResonance] = useState(7)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  async function onSave() {
    setMessage(null)
    setSaving(true)
    try {
      const fields = {
        wins: [wins1, wins2, wins3],
        apexFocus,
        nextStep,
        scope: [top1, top2, top3],
      }
      await createWeeklyReview({ week, year, resonance, fields })
      setMessage('Weekly Review opgeslagen!')
      setWins1(''); setWins2(''); setWins3('')
      setApexFocus(''); setNextStep('')
      setTop1(''); setTop2(''); setTop3('')
      setResonance(7)
    } catch (e: any) {
      setMessage(e.message || 'Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  function toMarkdown() {
    const wins = [wins1, wins2, wins3].filter(Boolean)
    return [
      `# Weekly Review – Week ${week} ${year}`,
      '',
      `## Wins`,
      ...wins.map((w, i) => `- ${i + 1}. ${w}`),
      '',
      `## APEX Focus`,
      apexFocus || '-',
      '',
      `## Volgende stap`,
      nextStep || '-',
      '',
      `## SCOPE`,
      [top1, top2, top3].filter(Boolean).map((t, i) => `- Top ${i + 1}: ${t}`).join('\n') || '-',
      '',
      `## Resonantie`,
      String(resonance),
    ].join('\n')
  }

  async function onCopyMarkdown() {
    try {
      await navigator.clipboard.writeText(toMarkdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  function onPrintPDF() {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Weekly Review</h1>
        <Link to="/weekly-review/history" className="text-sm underline">Geschiedenis</Link>
      </div>
      <div className="text-sm text-gray-600">Week {week} – {year}</div>

      {/* Wins */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold flex items-center gap-2">
          <span>🏆 Wins</span>
        </div>
        <div className="p-4 space-y-3">
          <input className="w-full border rounded p-2" placeholder="Win 1" value={wins1} onChange={(e) => setWins1(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Win 2" value={wins2} onChange={(e) => setWins2(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Win 3" value={wins3} onChange={(e) => setWins3(e.target.value)} />
        </div>
      </section>

      {/* APEX & Next */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold flex items-center gap-2">
          <span>🏔️ APEX Focus</span>
        </div>
        <div className="p-4 space-y-3">
          <textarea className="w-full border rounded p-2" placeholder="Waar gaat jouw focus deze week heen?" value={apexFocus} onChange={(e) => setApexFocus(e.target.value)} />
          <h3 className="font-medium">➡️ Volgende stap</h3>
          <textarea className="w-full border rounded p-2" placeholder="Wat is de eerstvolgende concrete stap?" value={nextStep} onChange={(e) => setNextStep(e.target.value)} />
        </div>
      </section>

      {/* SCOPE */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-semibold flex items-center gap-2">
          <span>📋 SCOPE deze week</span>
        </div>
        <div className="p-4 space-y-3">
          <input className="w-full border rounded p-2" placeholder="Top 1" value={top1} onChange={(e) => setTop1(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Top 2" value={top2} onChange={(e) => setTop2(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Top 3" value={top3} onChange={(e) => setTop3(e.target.value)} />
        </div>
      </section>

      {/* Resonance */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold flex items-center gap-2">
          <span>💫 Resonantie</span>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{resonance}</div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Score: {resonance}</label>
            <input aria-label="Resonantie" type="range" min={1} max={10} value={resonance} onChange={(e) => setResonance(Number(e.target.value))} />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button disabled={saving} onClick={onSave} className="bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded">
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
        <button onClick={onPrintPDF} className="border px-4 py-2 rounded">Exporteer (PDF)</button>
        <button onClick={onCopyMarkdown} className="border px-4 py-2 rounded">Kopieer als Markdown</button>
        {message && <div className="text-sm">{message}</div>}
        {copied && <div className="text-sm text-green-700">Gekopieerd!</div>}
      </div>
    </div>
  )
}
