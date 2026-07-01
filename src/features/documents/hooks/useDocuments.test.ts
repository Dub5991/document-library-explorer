import { renderHook, waitFor } from '@testing-library/react'
import { useDocuments } from './useDocuments'

test('starts loading then resolves with seeded documents', async () => {
  const { result } = renderHook(() => useDocuments({ pageSize: 5 }))

  expect(result.current.loading).toBe(true)
  expect(result.current.items).toEqual([])

  await waitFor(() => expect(result.current.loading).toBe(false))

  expect(result.current.error).toBeNull()
  expect(result.current.items).toHaveLength(5)
  expect(result.current.total).toBeGreaterThan(5)
})

test('passes query params through to the data source (search filters results)', async () => {
  const { result } = renderHook(() => useDocuments({ search: 'invoice' }))

  await waitFor(() => expect(result.current.loading).toBe(false))

  expect(result.current.items.length).toBeGreaterThan(0)
  for (const doc of result.current.items) {
    expect(doc.title.toLowerCase()).toContain('invoice')
  }
})

test('re-queries when the query changes', async () => {
  const { result, rerender } = renderHook(
    ({ pageSize }: { pageSize: number }) => useDocuments({ pageSize }),
    { initialProps: { pageSize: 3 } },
  )

  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.items).toHaveLength(3)

  rerender({ pageSize: 7 })

  await waitFor(() => expect(result.current.items).toHaveLength(7))
})
