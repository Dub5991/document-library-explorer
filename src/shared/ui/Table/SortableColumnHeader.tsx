// <th scope="col"> with a button trigger + aria-sort, keyboard-native (Enter/Space).
import styles from './Table.module.css'

type SortDirection = 'ascending' | 'descending' | 'none'

export function SortableColumnHeader({
  label,
  sort,
  onSort,
}: {
  label: string
  sort: SortDirection
  onSort: () => void
}) {
  return (
    <th scope="col" aria-sort={sort}>
      <button type="button" className={styles.sortButton} onClick={onSort}>
        {label}
        <span aria-hidden="true">
          {sort === 'ascending' ? '▲' : sort === 'descending' ? '▼' : ''}
        </span>
      </button>
    </th>
  )
}
