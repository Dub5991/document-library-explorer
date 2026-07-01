// Toast delivery: holds the current message, auto-clears it, and renders the Toast primitive.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Toast } from '../../shared/ui/Toast/Toast'
import { ToastContext } from './useToast'

const TOAST_DURATION_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((next: string) => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    setMessage(next)
    timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS)
  }, [])

  // Clear a pending timer on unmount so it can't fire against a gone component.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast message={message} />
    </ToastContext.Provider>
  )
}
