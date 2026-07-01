// Slice 1: sortable document list table — read-only, no filters/detail view yet.
import { useState } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import type { SortField } from '../../../data/DataSource'
import { Table } from '../../../shared/ui/Table/Table'
import { SortableColumnHeader } from '../../../shared/ui/Table/SortableColumnHeader'
import { Badge } from '../../../shared/ui/Badge/Badge'
import { formatDate } from '../../../shared/lib/formatDate'
import styles from './DocumentTable.module.css'

type SortState = { field: SortField; direction: 'ascending' | 'descending' }

const COLUMNS: Array<{ field: SortField; label: string }> = [
  { field: 'title', label: 'Title' },
  { field: 'status', label: 'Status' },
  { field: 'updatedAt', label: 'Updated' },
]

export function DocumentTable() {
  const [sort, setSort] = useState<SortState>({
    field: 'title',
    direction: 'ascending',
  })

  const { items, total, loading, error } = useDocuments({ sort })

  function handleSort(field: SortField) {
    setSort((current) =>
      current.field === field
        ? {
            field,
            direction:
              current.direction === 'ascending' ? 'descending' : 'ascending',
          }
        : { field, direction: 'ascending' },
    )
  }

  return (
    <div>
      <p className={styles.summary}>
        {loading ? 'Loading…' : `Showing ${items.length} of ${total} documents`}
      </p>

      {error && (
        <p role="alert" className={styles.empty}>
          {error}
        </p>
      )}

      {!error && (
        <Table>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <SortableColumnHeader
                  key={column.field}
                  label={column.label}
                  sort={sort.field === column.field ? sort.direction : 'none'}
                  onSort={() => handleSort(column.field)}
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
                <td>{doc.title}</td>
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
