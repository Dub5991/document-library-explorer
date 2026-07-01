// Presentational document list: sortable headers + rows. All data/state is passed in.
import type { Document } from '../../../shared/types/document'
import type { SortField } from '../../../data/DataSource'
import { Table } from '../../../shared/ui/Table/Table'
import { SortableColumnHeader } from '../../../shared/ui/Table/SortableColumnHeader'
import { Badge } from '../../../shared/ui/Badge/Badge'
import { formatDate } from '../../../shared/lib/formatDate'
import styles from './DocumentTable.module.css'

type Sort = { field: SortField; direction: 'ascending' | 'descending' }

const COLUMNS: Array<{ field: SortField; label: string }> = [
  { field: 'title', label: 'Title' },
  { field: 'status', label: 'Status' },
  { field: 'updatedAt', label: 'Updated' },
]

type DocumentTableProps = {
  items: Document[]
  total: number
  loading: boolean
  error: string | null
  sort: Sort
  onSort: (field: SortField) => void
  onOpen: (id: string) => void
}

export function DocumentTable({
  items,
  total,
  loading,
  error,
  sort,
  onSort,
  onOpen,
}: DocumentTableProps) {
  return (
    <div>
      <p className={styles.summary} aria-live="polite">
        {loading ? 'Loading…' : `Showing ${items.length} of ${total} documents`}
      </p>

      {error && (
        <p role="alert" className={styles.empty}>
          {error}
        </p>
      )}

      {!error && (
        <Table>
          <caption className={styles.caption}>Document catalog</caption>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <SortableColumnHeader
                  key={column.field}
                  label={column.label}
                  sort={sort.field === column.field ? sort.direction : 'none'}
                  onSort={() => onSort(column.field)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.empty}>
                  No documents found
                </td>
              </tr>
            )}
            {items.map((doc) => (
              <tr key={doc.id}>
                <td>
                  {/* A button (not a row click) keeps opening keyboard-operable. */}
                  <button
                    type="button"
                    className={styles.titleButton}
                    onClick={() => onOpen(doc.id)}
                  >
                    {doc.title}
                  </button>
                </td>
                <td>
                  <Badge status={doc.status} />
                </td>
                <td>{formatDate(doc.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
