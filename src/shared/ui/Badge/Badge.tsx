// Status badge: color + text label together, never color alone (WCAG 1.4.1).
import type { Status } from '../../types/status'
import { STATUS_LABEL } from '../../types/status'
import styles from './Badge.module.css'

export function Badge({ status }: { status: Status }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
