// Styled <table> wrapper. Rows/cells stay plain HTML — no behavior to wrap.
import type { TableHTMLAttributes } from 'react'
import styles from './Table.module.css'

export function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={styles.table} {...props} />
}
