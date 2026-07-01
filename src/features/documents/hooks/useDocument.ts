// Read-path hook: fetches a single document by id; idle (no fetch) while id is null.
import { useEffect, useState } from 'react'
import { dataSource } from '../../../data/provider'
import type { Document } from '../../../shared/types/document'

export type UseDocumentResult = {
  document: Document | null
  loading: boolean
  error: string | null
}

type ResultState = {
  resolvedId: string | null
  document: Document | null
  error: string | null
}

export function useDocument(id: string | null): UseDocumentResult {
  const [state, setState] = useState<ResultState>({
    resolvedId: null,
    document: null,
    error: null,
  })

  useEffect(() => {
    if (id === null) return

    let cancelled = false

    async function load(documentId: string) {
      try {
        const document = await dataSource.getDocument(documentId)
        if (cancelled) return
        setState({ resolvedId: documentId, document, error: null })
      } catch (err: unknown) {
        if (cancelled) return
        setState({
          resolvedId: documentId,
          document: null,
          error: err instanceof Error ? err.message : 'Failed to load document',
        })
      }
    }

    void load(id)

    // Guards a resolved request from writing state after id changed or unmount.
    return () => {
      cancelled = true
    }
  }, [id])

  // Derive loading by comparing the resolved id against the requested one, so the
  // effect only ever calls setState from its async callbacks (never synchronously).
  const settled = id !== null && state.resolvedId === id
  return {
    document: settled ? state.document : null,
    loading: id !== null && !settled,
    error: settled ? state.error : null,
  }
}
