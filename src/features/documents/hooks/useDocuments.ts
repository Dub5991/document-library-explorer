// Read-path hook: fetches a page of documents from dataSource, tracks loading/error state.
import { useEffect, useState } from 'react'
import { dataSource } from '../../../data/provider'
import type { DocumentQuery } from '../../../data/DataSource'
import type { Document } from '../../../shared/types/document'

export type UseDocumentsResult = {
  items: Document[]
  total: number
  loading: boolean
  error: string | null
}

type ResultState = {
  queryKey: string | null
  items: Document[]
  total: number
  error: string | null
}

export function useDocuments(query: DocumentQuery): UseDocumentsResult {
  const [state, setState] = useState<ResultState>({
    queryKey: null,
    items: [],
    total: 0,
    error: null,
  })

  // Serialize the query so object identity churn (e.g. a new literal each render)
  // doesn't retrigger the effect — only a real change in query contents does.
  // `loading` is derived by comparing this key against the last resolved query,
  // so the effect only ever calls setState from its async callbacks (never synchronously).
  const queryKey = JSON.stringify(query)

  useEffect(() => {
    let cancelled = false

    dataSource
      .listDocuments(query)
      .then((page) => {
        if (cancelled) return
        setState({
          queryKey,
          items: page.items,
          total: page.total,
          error: null,
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          queryKey,
          items: [],
          total: 0,
          error:
            err instanceof Error ? err.message : 'Failed to load documents',
        })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- queryKey is the intentional dependency
  }, [queryKey])

  return {
    items: state.items,
    total: state.total,
    loading: state.queryKey !== queryKey,
    error: state.error,
  }
}
