// Verifies row->domain mapping and query construction against a fake query builder (no network).
import { beforeEach, describe, expect, test, vi } from 'vitest'

type Call = [method: string, args: unknown[]]

const harness = vi.hoisted(() => {
  let result: unknown = { data: null, count: 0, error: null }
  const calls: Call[] = []

  const builder: Record<string, unknown> = {}
  const record =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push([method, args])
      return builder
    }
  for (const method of [
    'select',
    'ilike',
    'eq',
    'in',
    'overlaps',
    'order',
    'range',
    'update',
    'maybeSingle',
  ]) {
    builder[method] = record(method)
  }
  // Awaiting any point in the chain resolves to the currently configured result.
  builder.then = (resolve: (value: unknown) => void) => resolve(result)

  return {
    calls,
    reset() {
      calls.length = 0
      result = { data: null, count: 0, error: null }
    },
    setResult(next: unknown) {
      result = next
    },
    lastArgs(method: string) {
      const found = [...calls].reverse().find(([name]) => name === method)
      return found?.[1]
    },
    client: {
      from(...args: unknown[]) {
        calls.push(['from', args])
        return builder
      },
    },
  }
})

vi.mock('./client', () => ({
  hasSupabaseConfig: () => true,
  getSupabaseClient: () => harness.client,
}))

import { supabaseDataSource } from './SupabaseDataSource'

const ROW = {
  id: 'doc-7',
  title: 'Vendor Contract 8',
  folder_id: 'f-contracts',
  tag_ids: ['t-0', 't-3'],
  status: 'approved' as const,
  mime_type: 'application/pdf',
  size_bytes: 204800,
  created_at: '2024-01-02T00:00:00.000Z',
  updated_at: '2024-06-02T00:00:00.000Z',
}

beforeEach(() => {
  harness.reset()
})

describe('listDocuments', () => {
  test('maps snake_case row fields to the camelCase Document shape', async () => {
    harness.setResult({ data: [ROW], count: 1, error: null })

    const page = await supabaseDataSource.listDocuments({})

    expect(page.items[0]).toEqual({
      id: 'doc-7',
      title: 'Vendor Contract 8',
      folderId: 'f-contracts',
      tagIds: ['t-0', 't-3'],
      status: 'approved',
      mimeType: 'application/pdf',
      sizeBytes: 204800,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-06-02T00:00:00.000Z',
    })
  })

  test('returns Page metadata with total taken from the exact count', async () => {
    harness.setResult({ data: [ROW], count: 137, error: null })

    const page = await supabaseDataSource.listDocuments({
      page: 3,
      pageSize: 25,
    })

    expect(page.total).toBe(137)
    expect(page.page).toBe(3)
    expect(page.pageSize).toBe(25)
  })

  test('translates each filter into its Postgres operator', async () => {
    harness.setResult({ data: [], count: 0, error: null })

    await supabaseDataSource.listDocuments({
      search: 'audit',
      folderId: 'f-legal',
      status: ['draft', 'review'],
      tagIds: ['t-1', 't-2'],
      sort: { field: 'updatedAt', direction: 'descending' },
    })

    expect(harness.lastArgs('ilike')).toEqual(['title', '%audit%'])
    expect(harness.lastArgs('eq')).toEqual(['folder_id', 'f-legal'])
    expect(harness.lastArgs('in')).toEqual(['status', ['draft', 'review']])
    expect(harness.lastArgs('overlaps')).toEqual(['tag_ids', ['t-1', 't-2']])
    expect(harness.lastArgs('order')).toEqual([
      'updated_at',
      { ascending: false },
    ])
  })

  test('paginates with a range derived from page and pageSize', async () => {
    harness.setResult({ data: [], count: 0, error: null })

    await supabaseDataSource.listDocuments({ page: 2, pageSize: 10 })

    expect(harness.lastArgs('range')).toEqual([10, 19])
  })

  test('propagates a query error instead of returning a partial page', async () => {
    harness.setResult({ data: null, count: null, error: { message: 'boom' } })

    await expect(supabaseDataSource.listDocuments({})).rejects.toThrow('boom')
  })
})

describe('getDocument', () => {
  test('maps the fetched row to a Document', async () => {
    harness.setResult({ data: ROW, error: null })

    const doc = await supabaseDataSource.getDocument('doc-7')

    expect(doc.folderId).toBe('f-contracts')
    expect(doc.mimeType).toBe('application/pdf')
    expect(doc.sizeBytes).toBe(204800)
  })

  test('throws "Document not found" when no row matches', async () => {
    harness.setResult({ data: null, error: null })

    await expect(supabaseDataSource.getDocument('missing')).rejects.toThrow(
      'Document not found: missing',
    )
  })
})

describe('updateStatus', () => {
  test('writes the new status and returns the mapped row', async () => {
    harness.setResult({ data: { ...ROW, status: 'archived' }, error: null })

    const doc = await supabaseDataSource.updateStatus('doc-7', 'archived')

    expect(doc.status).toBe('archived')
    const updateArgs = harness.lastArgs('update')?.[0] as Record<
      string,
      unknown
    >
    expect(updateArgs.status).toBe('archived')
    expect(typeof updateArgs.updated_at).toBe('string')
  })
})

describe('listFolders / listTags', () => {
  test('maps parent_id to parentId and orders folders by name', async () => {
    harness.setResult({
      data: [{ id: 'f-legal', name: 'Legal', parent_id: 'f-contracts' }],
      error: null,
    })

    const folders = await supabaseDataSource.listFolders()

    expect(folders[0]).toEqual({
      id: 'f-legal',
      name: 'Legal',
      parentId: 'f-contracts',
    })
    expect(harness.lastArgs('order')).toEqual(['name', { ascending: true }])
  })

  test('maps tag rows to the Tag shape', async () => {
    harness.setResult({
      data: [{ id: 't-0', name: 'vendor' }],
      error: null,
    })

    const tags = await supabaseDataSource.listTags()

    expect(tags).toEqual([{ id: 't-0', name: 'vendor' }])
  })
})
