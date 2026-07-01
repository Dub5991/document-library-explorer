// ARIA live region: role="status" + aria-live="polite" announces without stealing focus.
import styles from './Toast.module.css'

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div role="status" aria-live="polite" className={styles.toast}>
      {message}
    </div>
  )
}
