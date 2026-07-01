// Accessible modal dialog: shows one document's metadata and drives the status-update write path.
import { useEffect, useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useToast } from '../../../app/toast/useToast'
import { Badge } from '../../../shared/ui/Badge/Badge'
import { Button } from '../../../shared/ui/Button/Button'
import { Select } from '../../../shared/ui/Select/Select'
import { formatDate } from '../../../shared/lib/formatDate'
import { useFocusTrap } from '../../../shared/lib/useFocusTrap'
import type { Status } from '../../../shared/types/status'
import { STATUS_LABEL } from '../../../shared/types/status'
import { useDocument } from '../hooks/useDocument'
import {
  selectDocumentStatus,
  updateDocumentStatus,
} from '../model/documentsSlice'
import styles from './DocumentDetail.module.css'

const STATUS_ORDER: Status[] = ['draft', 'review', 'approved', 'archived']

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  const rounded = unit === 0 ? size : Math.round(size * 10) / 10
  return `${rounded} ${units[unit]}`
}

export function DocumentDetail({
  documentId,
  onClose,
}: {
  documentId: string
  onClose: () => void
}) {
  const { document: doc, loading, error } = useDocument(documentId)
  const containerRef = useFocusTrap(true)
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const titleId = useId()

  const currentStatus = useAppSelector((state) =>
    selectDocumentStatus(state, documentId, doc?.status ?? 'draft'),
  )
  const updating = useAppSelector(
    (state) => state.documents.updating[documentId] ?? false,
  )

  // Escape closes the dialog; document-level so it fires regardless of focus target.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleStatusChange(next: Status) {
    const result = await dispatch(
      updateDocumentStatus({ id: documentId, status: next }),
    )
    if (updateDocumentStatus.fulfilled.match(result)) {
      showToast(`Status updated to ${STATUS_LABEL[next]}`)
    }
  }

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        aria-label="Close dialog"
        className={styles.backdrop}
        onClick={onClose}
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
      >
        <h2 id={titleId} className={styles.title}>
          {doc ? doc.title : loading ? 'Loading document' : 'Document'}
        </h2>

        {loading && <p role="status">Loading document…</p>}
        {error && <p role="alert">{error}</p>}

        {doc && (
          <>
            <dl className={styles.meta}>
              <div className={styles.row}>
                <dt>Status</dt>
                <dd>
                  <Badge status={currentStatus} />
                </dd>
              </div>
              <div className={styles.row}>
                <dt>Folder</dt>
                <dd>{doc.folderId ?? 'None'}</dd>
              </div>
              <div className={styles.row}>
                <dt>Tags</dt>
                <dd>
                  {doc.tagIds.length > 0 ? doc.tagIds.join(', ') : 'None'}
                </dd>
              </div>
              <div className={styles.row}>
                <dt>Type</dt>
                <dd>{doc.mimeType}</dd>
              </div>
              <div className={styles.row}>
                <dt>Size</dt>
                <dd>{formatBytes(doc.sizeBytes)}</dd>
              </div>
              <div className={styles.row}>
                <dt>Created</dt>
                <dd>{formatDate(doc.createdAt)}</dd>
              </div>
              <div className={styles.row}>
                <dt>Updated</dt>
                <dd>{formatDate(doc.updatedAt)}</dd>
              </div>
            </dl>

            <div className={styles.statusUpdater}>
              <Select
                label="Update status"
                value={currentStatus}
                disabled={updating}
                onChange={(value) => handleStatusChange(value as Status)}
                options={STATUS_ORDER.map((status) => ({
                  value: status,
                  label: STATUS_LABEL[status],
                }))}
              />
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
