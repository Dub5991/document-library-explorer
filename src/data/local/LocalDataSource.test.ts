import { localDataSource } from './LocalDataSource'

test('lists documents with pagination metadata', async () => {
  const page = await localDataSource.listDocuments({ page: 1, pageSize: 10 })
  expect(page.items).toHaveLength(10)
  expect(page.total).toBeGreaterThanOrEqual(500)
  expect(page.page).toBe(1)
})

test('filters by search text, case-insensitively', async () => {
  const page = await localDataSource.listDocuments({
    search: 'vendor contract',
  })
  expect(page.items.length).toBeGreaterThan(0)
  for (const doc of page.items) {
    expect(doc.title.toLowerCase()).toContain('vendor contract')
  }
})

test('filters by status', async () => {
  const page = await localDataSource.listDocuments({
    status: ['approved'],
    pageSize: 500,
  })
  expect(page.items.length).toBeGreaterThan(0)
  for (const doc of page.items) {
    expect(doc.status).toBe('approved')
  }
})

test('sorts by title ascending', async () => {
  const page = await localDataSource.listDocuments({
    sort: { field: 'title', direction: 'ascending' },
    pageSize: 50,
  })
  const titles = page.items.map((d) => d.title)
  expect(titles).toEqual([...titles].sort())
})

test('getDocument returns the matching document', async () => {
  const doc = await localDataSource.getDocument('doc-0')
  expect(doc.id).toBe('doc-0')
})

test('getDocument throws for an unknown id', async () => {
  await expect(localDataSource.getDocument('missing')).rejects.toThrow()
})

test('updateStatus mutates status and updatedAt, and persists across calls', async () => {
  const before = await localDataSource.getDocument('doc-1')
  const updated = await localDataSource.updateStatus('doc-1', 'archived')
  expect(updated.status).toBe('archived')
  expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
    new Date(before.updatedAt).getTime(),
  )

  const refetched = await localDataSource.getDocument('doc-1')
  expect(refetched.status).toBe('archived')
})
