import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export type ToastOptions = {
  message: string
  actionLabel?: string
  onAction?: () => void
  durationMs?: number
}

type ToastContextValue = {
  showToast: (opts: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([])
  const timers = useRef<number[]>([])

  const showToast = useCallback((opts: ToastOptions) => {
    setToasts((t) => [...t, opts])
    const ms = opts.durationMs ?? 3000
    const id = window.setTimeout(() => {
      setToasts((t) => t.slice(1))
    }, ms)
    timers.current.push(id)
  }, [])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((t, idx) => (
          <div key={idx} className="bg-gray-900 text-white text-sm px-4 py-2 rounded shadow flex items-center gap-3">
            <span>{t.message}</span>
            {t.actionLabel && t.onAction && (
              <button
                aria-label={t.actionLabel}
                className="underline"
                onClick={() => {
                  t.onAction?.()
                  setToasts((curr) => curr.filter((_, i) => i !== idx))
                }}
              >
                {t.actionLabel}
              </button>
            )}
          </div>)
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
