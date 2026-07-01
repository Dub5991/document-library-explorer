// Container: owns query + selection state, composes filters, table, and the detail view.
import { useState } from 'react'
import { useDocumentQuery } from '../hooks/useDocumentQuery'
import { useDocuments } from '../hooks/useDocuments'
import { useFilterOptions } from '../hooks/useFilterOptions'
import { DocumentSearch } from './DocumentSearch'
import { DocumentFilters } from './DocumentFilters'
import { DocumentTable } from './DocumentTable'
import { DocumentDetail } from './DocumentDetail'
import styles from './DocumentBrowser.module.css'

export function DocumentBrowser() {
  const query = useDocumentQuery()
  const { items, total, loading, error } = useDocuments(query.query)
  const { folders, tags } = useFilterOptions()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      <div className={styles.controls}>
        <DocumentSearch
          value={query.filters.search}
          onChange={query.setSearch}
          onOpen={setOpenId}
        />
        <DocumentFilters
          folders={folders}
          folderId={query.filters.folderId}
          onFolderChange={query.setFolder}
          selectedStatuses={query.filters.statuses}
          onToggleStatus={query.toggleStatus}
          tags={tags}
          selectedTagIds={query.filters.tagIds}
          onToggleTag={query.toggleTag}
          onReset={query.reset}
        />
      </div>
      <DocumentTable
        items={items}
        total={total}
        loading={loading}
        error={error}
        sort={query.sort}
        onSort={query.setSort}
        onOpen={setOpenId}
      />
      {openId && (
        <DocumentDetail documentId={openId} onClose={() => setOpenId(null)} />
      )}
    </div>
  )
}
