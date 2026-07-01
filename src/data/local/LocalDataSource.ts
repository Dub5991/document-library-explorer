// Offline DataSource impl: filters/sorts/paginates the in-memory seed, no network.
import type { DataSource, DocumentQuery, Page } from '../DataSource'
import type { Document } from '../../shared/types/document'
import { SEED_DOCUMENTS } from './seed'

const documents: Document[] = SEED_DOCUMENTS.map((doc) => ({ ...doc }))

function matches(doc: Document, query: DocumentQuery): boolean {
  if (
    query.search &&
    !doc.title.toLowerCase().includes(query.search.toLowerCase())
  ) {
    return false
  }
  if (query.folderId && doc.folderId !== query.folderId) return false
  if (
    query.status &&
    query.status.length > 0 &&
    !query.status.includes(doc.status)
  ) {
    return false
  }
  if (query.tagIds && query.tagIds.length > 0) {
    const hasTag = query.tagIds.some((tagId) => doc.tagIds.includes(tagId))
    if (!hasTag) return false
  }
  return true
}

function compare(
  a: Document,
  b: Document,
  sort: NonNullable<DocumentQuery['sort']>,
): number {
  const direction = sort.direction === 'ascending' ? 1 : -1
  const left = a[sort.field]
  const right = b[sort.field]
  return left < right ? -direction : left > right ? direction : 0
}

export const localDataSource: DataSource = {
  async listDocuments(query: DocumentQuery): Promise<Page<Document>> {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 25

    let results = documents.filter((doc) => matches(doc, query))
    if (query.sort) {
      results = [...results].sort((a, b) => compare(a, b, query.sort!))
    }

    const start = (page - 1) * pageSize
    return {
      items: results.slice(start, start + pageSize),
      total: results.length,
      page,
      pageSize,
    }
  },

  async getDocument(id: string): Promise<Document> {
    const doc = documents.find((d) => d.id === id)
    if (!doc) throw new Error(`Document not found: ${id}`)
    return doc
  },

  async updateStatus(id: string, status) {
    const doc = documents.find((d) => d.id === id)
    if (!doc) throw new Error(`Document not found: ${id}`)
    doc.status = status
    doc.updatedAt = new Date().toISOString()
    return doc
  },
}
