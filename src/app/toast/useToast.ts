// Toast context + accessor hook: showToast queues a message the ToastProvider renders.
import { createContext, useContext } from 'react'

export type ToastContextValue = {
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
