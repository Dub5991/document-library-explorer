// Owns filter/sort/pagination state and derives a clean DocumentQuery for the data layer.
import { useCallback, useMemo, useState } from 'react'
import type { DocumentQuery, SortField } from '../../../data/DataSource'
import type { Status } from '../../../shared/types/status'

type SortDirection = 'ascending' | 'descending'

type Sort = {
  field: SortField
  direction: SortDirection
}

type Filters = {
  search: string
  folderId: string | null
  statuses: Status[]
  tagIds: string[]
}

export type UseDocumentQueryResult = {
  query: DocumentQuery
  filters: Filters
  sort: Sort
  page: number
  setSearch: (search: string) => void
  setFolder: (folderId: string | null) => void
  toggleStatus: (status: Status) => void
  toggleTag: (tagId: string) => void
  setSort: (field: SortField) => void
  setPage: (page: number) => void
  reset: () => void
}

const DEFAULT_SORT: Sort = { field: 'updatedAt', direction: 'descending' }

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((existing) => existing !== value)
    : [...values, value]
}

export function useDocumentQuery(): UseDocumentQueryResult {
  const [search, setSearchState] = useState('')
  const [folderId, setFolderId] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<Status[]>([])
  const [tagIds, setTagIds] = useState<string[]>([])
  const [sort, setSortState] = useState<Sort>(DEFAULT_SORT)
  const [page, setPage] = useState(1)

  const setSearch = useCallback((next: string) => {
    setSearchState(next)
    setPage(1)
  }, [])

  const setFolder = useCallback((next: string | null) => {
    setFolderId(next)
    setPage(1)
  }, [])

  const toggleStatus = useCallback((status: Status) => {
    setStatuses((current) => toggle(current, status))
    setPage(1)
  }, [])

  const toggleTag = useCallback((tagId: string) => {
    setTagIds((current) => toggle(current, tagId))
    setPage(1)
  }, [])

  // Same field flips direction; a new field starts ascending.
  const setSort = useCallback((field: SortField) => {
    setSortState((current) =>
      current.field === field
        ? {
            field,
            direction:
              current.direction === 'ascending' ? 'descending' : 'ascending',
          }
        : { field, direction: 'ascending' },
    )
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setSearchState('')
    setFolderId(null)
    setStatuses([])
    setTagIds([])
    setSortState(DEFAULT_SORT)
    setPage(1)
  }, [])

  // Empty filters are omitted so the DataSource query carries only active constraints.
  const query = useMemo<DocumentQuery>(() => {
    const trimmedSearch = search.trim()
    return {
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
      ...(folderId ? { folderId } : {}),
      ...(statuses.length > 0 ? { status: statuses } : {}),
      ...(tagIds.length > 0 ? { tagIds } : {}),
      sort,
      page,
    }
  }, [search, folderId, statuses, tagIds, sort, page])

  const filters = useMemo<Filters>(
    () => ({ search, folderId, statuses, tagIds }),
    [search, folderId, statuses, tagIds],
  )

  return {
    query,
    filters,
    sort,
    page,
    setSearch,
    setFolder,
    toggleStatus,
    toggleTag,
    setSort,
    setPage,
    reset,
  }
}
