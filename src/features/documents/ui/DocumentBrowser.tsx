// Container: owns query + selection state, composes filters, table, and the detail view.
import { useState } from 'react'
import { useDocumentQuery } from '../hooks/useDocumentQuery'
import { useDocuments } from '../hooks/useDocuments'
import { useFilterOptions } from '../hooks/useFilterOptions'
import { DocumentFilters } from './DocumentFilters'
import { DocumentTable } from './DocumentTable'
import { DocumentDetail } from './DocumentDetail'

export function DocumentBrowser() {
  const query = useDocumentQuery()
  const { items, total, loading, error } = useDocuments(query.query)
  const { folders, tags } = useFilterOptions()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      <DocumentFilters
        search={query.filters.search}
        onSearchChange={query.setSearch}
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
