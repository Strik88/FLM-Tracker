import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { createMetascript } from '../repositories/metascripts'

function useDuration() {
  const startRef = useRef<number>(Date.now())
  useEffect(() => { startRef.current = Date.now() }, [])
  const minutes = () => Math.max(1, Math.round((Date.now() - startRef.current) / 60000))
  const reset = () => { startRef.current = Date.now() }
  return { minutes, reset }
}

export default function Metascript() {
  const [step, setStep] = useState(1) // 1..5, 6=summary
  const totalSteps = 5

  // Fields
  const [scan1, setScan1] = useState('')
  const [scan2, setScan2] = useState('')
  const [scan3, setScan3] = useState('')
  const [heart, setHeart] = useState('')
  const [headOptions, setHeadOptions] = useState('')
  const [headResonant, setHeadResonant] = useState('')
  const [hatIdentity, setHatIdentity] = useState('')
  const [hatWisdom, setHatWisdom] = useState('')
  const [action, setAction] = useState('')
  const [embodiment, setEmbodiment] = useState('')

  const { minutes, reset } = useDuration()

  // UI state
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const progress = useMemo(() => Math.round((Math.min(step, totalSteps) / totalSteps) * 100), [step])

  function next() { setStep((s) => Math.min(s + 1, 6)) }
  function prev() { setStep((s) => Math.max(s - 1, 1)) }
  function goSummary() { setStep(6) }

  function clearAll() {
    setScan1(''); setScan2(''); setScan3('')
    setHeart(''); setHeadOptions(''); setHeadResonant('')
    setHatIdentity(''); setHatWisdom('')
    setAction(''); setEmbodiment('')
    reset()
    setStep(1)
  }

  async function saveFromSummary() {
    setSaving(true)
    try {
      const duration = minutes()
      await createMetascript({
        scan1, scan2, scan3,
        heart_shift: heart,
        head_shift_options: headOptions,
        head_shift_resonant: headResonant,
        hat_shift_identity: hatIdentity,
        hat_shift_wisdom: hatWisdom,
        integration_action: action,
        integration_embodiment: embodiment,
        duration_minutes: duration,
      })
      setToast('Metascript opgeslagen!')
      setTimeout(() => setToast(null), 2500)
    } catch (e: any) {
      setToast(e.message || 'Opslaan mislukt')
      setTimeout(() => setToast(null), 3500)
    } finally {
      setSaving(false)
    }
  }

  const summaryText = useMemo(() => ({
    scan: [scan1, scan2, scan3].filter(Boolean).join(' '),
    heart,
    head: headResonant,
    hat: hatIdentity,
    act: action,
  }), [scan1, scan2, scan3, heart, headResonant, hatIdentity, action])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Metascript</h1>
        <Link to="/metascript/history" className="text-sm underline">Geschiedenis</Link>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
        <div className="h-2 bg-indigo-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Steps */}
      {step === 1 && (
        <Section title="🔎 Scan">
          <TA value={scan1} onChange={setScan1} placeholder="Wat vraagt vandaag jouw aandacht?" />
          <TA value={scan2} onChange={setScan2} placeholder="Wat speelt er nu voor je?" />
          <TA value={scan3} onChange={setScan3} placeholder="Wat verwacht je of waar zie je tegenop?" />
        </Section>
      )}

      {step === 2 && (
        <Section title="❤️ Heart Shift">
          <TA value={heart} onChange={setHeart} placeholder="Wat wil je écht in deze situatie?" />
        </Section>
      )}

      {step === 3 && (
        <Section title="🧠 Head Shift">
          <TA value={headOptions} onChange={setHeadOptions} placeholder="Noem minimaal 3 opties…" />
          <TA value={headResonant} onChange={setHeadResonant} placeholder="Welke optie resoneert het meest en waarom?" />
        </Section>
      )}

      {step === 4 && (
        <Section title="👑 Hat Shift">
          <TA value={hatIdentity} onChange={setHatIdentity} placeholder="Wie wil je zijn hier? (identiteit)" />
          <TA value={hatWisdom} onChange={setHatWisdom} placeholder="Wat zegt die versie van jou tegen je?" />
        </Section>
      )}

      {step === 5 && (
        <Section title="🔗 Integratie & Actie">
          <IN value={action} onChange={setAction} placeholder="Eerste concrete actie" />
          <IN value={embodiment} onChange={setEmbodiment} placeholder="Hoe ga je dit vandaag belichamen?" />
        </Section>
      )}

      {step === 6 && (
        <Summary
          duration={minutes()}
          scan={summaryText.scan}
          heart={summaryText.heart}
          head={summaryText.head}
          hat={summaryText.hat}
          action={summaryText.act}
        />
      )}

      {/* Sticky nav */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur border-t px-3 py-3 flex items-center gap-3">
        {step > 1 && step <= totalSteps && (
          <button className="px-3 py-2 border rounded" onClick={prev}>← Terug</button>
        )}
        {step < totalSteps && (
          <button className="ml-auto px-3 py-2 bg-indigo-600 text-white rounded" onClick={next}>Volgende →</button>
        )}
        {step === totalSteps && (
          <button className="ml-auto px-3 py-2 bg-indigo-600 text-white rounded" onClick={goSummary}>Afronden →</button>
        )}
        {step === 6 && (
          <div className="ml-auto flex items-center gap-3">
            <button disabled={saving} className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" onClick={saveFromSummary}>
              {saving ? 'Opslaan…' : 'Opslaan'}
            </button>
            <button className="px-3 py-2 border rounded" onClick={clearAll}>Nieuwe Metascript</button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function TA({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <textarea className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
}

function IN({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <input className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
}

function Summary({ duration, scan, heart, head, hat, action }: { duration: number; scan: string; heart: string; head: string; hat: string; action: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-semibold">Samenvatting</h2>
      <Item label="⏱️ Tijdsduur">{duration} min</Item>
      <Item label="🔎 Scan">{scan || '—'}</Item>
      <Item label="❤️ Heart Shift">{heart || '—'}</Item>
      <Item label="🧠 Head Shift (resonant)">{head || '—'}</Item>
      <Item label="👑 Hat Shift (identiteit)">{hat || '—'}</Item>
      <Item label="🎯 Actie">{action || '—'}</Item>
    </div>
  )
}

function Item({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="border rounded p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="whitespace-pre-wrap text-sm">{children}</div>
    </div>
  )
}
