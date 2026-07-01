// Fuzzy typeahead source: loads the catalog once, then ranks it against the term.
import { useEffect, useMemo, useState } from 'react'
import { dataSource } from '../../../data/provider'
import { fuzzyScore } from '../../../shared/lib/fuzzyScore'
import type { Document } from '../../../shared/types/document'

const CATALOG_PAGE_SIZE = 1000

export function useDocumentSuggestions(term: string, limit = 8): Document[] {
  const [catalog, setCatalog] = useState<Document[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const page = await dataSource.listDocuments({
          pageSize: CATALOG_PAGE_SIZE,
        })
        if (!cancelled) setCatalog(page.items)
      } catch {
        if (!cancelled) setCatalog([])
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    if (!term.trim()) return []
    return catalog
      .map((doc) => ({ doc, score: fuzzyScore(term, doc.title) }))
      .filter((ranked) => ranked.score !== null)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit)
      .map((ranked) => ranked.doc)
  }, [catalog, term, limit])
}
