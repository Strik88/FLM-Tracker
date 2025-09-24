import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createScope, getLatestScope } from '../repositories/scopes'

export default function Scope() {
  const [apexVision, setApexVision] = useState('')
  const [apexRes, setApexRes] = useState(5)
  const [goals, setGoals] = useState<string[]>(['', '', '', ''])
  const [weekPrio, setWeekPrio] = useState<string[]>(['', '', ''])
  const [timeBlocks, setTimeBlocks] = useState({ deepWork: '', meetings: '', sport: '', fun: '' })
  const [dailyFocus, setDailyFocus] = useState({ main: '', quick: '', fun: '' })
  const [dailyEnergy, setDailyEnergy] = useState(7)

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const latest = await getLatestScope()
        if (latest) {
          setApexVision(latest.apex_vision || '')
          setApexRes(latest.apex_resonance || 5)
          setGoals(latest.quarterly_goals || ['', '', '', ''])
          setWeekPrio(latest.week_priorities || ['', '', ''])
          setTimeBlocks((latest.time_blocks as any) || { deepWork: '', meetings: '', sport: '', fun: '' })
          setDailyFocus((latest.daily_focus as any) || { main: '', quick: '', fun: '' })
          setDailyEnergy(latest.daily_energy || 7)
        }
      } catch (e) {
        // ignore load error for now
      }
    })()
  }, [])

  async function onSave() {
    setMessage(null)
    setSaving(true)
    try {
      await createScope({
        apex_vision: apexVision,
        apex_resonance: apexRes,
        quarterly_goals: goals,
        week_priorities: weekPrio,
        time_blocks: timeBlocks,
        daily_focus: dailyFocus,
        daily_energy: dailyEnergy,
      })
      setMessage('SCOPE opgeslagen!')
    } catch (e: any) {
      setMessage(e.message || 'Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  function resonanceFeedback(v: number) {
    if (v <= 3) return 'Deze visie voelt nog niet als de jouwe. Wat mist er?'
    if (v <= 6) return 'Er is iets, maar het resoneert nog niet volledig. Verfijn het.'
    if (v <= 8) return 'Dit begint te voelen als jouw pad! Maak het nog specifieker.'
    return 'JA! Dit is het. Dit is wie je wilt zijn! 🔥'
  }

  function applyPreset(hours: { deepWork: string; meetings: string; sport: string; fun: string }) {
    setTimeBlocks(hours)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SCOPE Planner</h1>
        <Link to="/scope/history" className="text-sm underline">Geschiedenis</Link>
      </div>

      {/* Apex Vision Card */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-semibold flex items-center gap-2">
          <span>🏔️ Apex Vision</span>
        </div>
        <div className="p-4 space-y-3">
          <textarea className="w-full border rounded p-2" placeholder="Beschrijf je ultieme visie…" value={apexVision} onChange={(e) => setApexVision(e.target.value)} />
          <div className="flex items-center gap-3">
            <label className="text-sm">Resonantie: {apexRes}</label>
            <input aria-label="Apex resonantie" type="range" min={1} max={10} value={apexRes} onChange={(e) => setApexRes(Number(e.target.value))} />
          </div>
          <div className="text-sm text-gray-600 italic">{resonanceFeedback(apexRes)}</div>
        </div>
      </section>

      {/* Quarterly Goals Card */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-semibold flex items-center gap-2">
          <span>📅 Kwartaaldoelen</span>
        </div>
        <div className="p-4 space-y-3">
          {goals.map((g, i) => (
            <input key={i} className="w-full border rounded p-2" placeholder={`Doel ${i + 1}`} value={g} onChange={(e) => setGoals(goals.map((v, idx) => (idx === i ? e.target.value : v)))} />
          ))}
        </div>
      </section>

      {/* Week Priorities Card */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-semibold flex items-center gap-2">
          <span>📆 Weekprioriteiten</span>
        </div>
        <div className="p-4 space-y-3">
          {weekPrio.map((p, i) => (
            <input key={i} className="w-full border rounded p-2" placeholder={`Prioriteit ${i + 1}`} value={p} onChange={(e) => setWeekPrio(weekPrio.map((v, idx) => (idx === i ? e.target.value : v)))} />
          ))}
        </div>
      </section>

      {/* Time Blocks Card with presets */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold flex items-center gap-2">
          <span>⏱️ Tijdsblokken</span>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-600 self-center mr-2">Presets:</span>
            <button className="px-2 py-1 border rounded" onClick={() => applyPreset({ deepWork: '8u', meetings: '4u', sport: '5u', fun: '10u' })}>Balanced</button>
            <button className="px-2 py-1 border rounded" onClick={() => applyPreset({ deepWork: '12u', meetings: '2u', sport: '4u', fun: '6u' })}>Focus</button>
            <button className="px-2 py-1 border rounded" onClick={() => applyPreset({ deepWork: '6u', meetings: '6u', sport: '4u', fun: '8u' })}>Meetings</button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {(['deepWork', 'meetings', 'sport', 'fun'] as const).map((k) => (
              <input key={k} className="w-full border rounded p-2" placeholder={k} value={(timeBlocks as any)[k]} onChange={(e) => setTimeBlocks({ ...timeBlocks, [k]: e.target.value })} />
            ))}
          </div>
        </div>
      </section>

      {/* Daily Focus Card */}
      <section className="bg-white rounded-2xl shadow p-0 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold flex items-center gap-2">
          <span>☀️ Daily Focus</span>
        </div>
        <div className="p-4 space-y-3">
          {(['main', 'quick', 'fun'] as const).map((k) => (
            <input
              key={k}
              className="w-full border rounded p-2"
              placeholder={k === 'main' ? 'Belangrijkste taak' : k === 'quick' ? 'Snelle win' : 'Iets leuks'}
              value={(dailyFocus as any)[k]}
              onChange={(e) => setDailyFocus({ ...dailyFocus, [k]: e.target.value })}
            />
          ))}
          <div className="flex items-center gap-3">
            <label className="text-sm">Energie: {dailyEnergy}</label>
            <input aria-label="Energie" type="range" min={1} max={10} value={dailyEnergy} onChange={(e) => setDailyEnergy(Number(e.target.value))} />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button disabled={saving} onClick={onSave} className="bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded">
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
        {message && <div className="text-sm">{message}</div>}
      </div>
    </div>
  )
}
