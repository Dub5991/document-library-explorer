import { renderHook, waitFor } from '@testing-library/react'
import { useFilterOptions } from './useFilterOptions'

test('loads folders and tags from the data source', async () => {
  const { result } = renderHook(() => useFilterOptions())
  await waitFor(() => expect(result.current.folders.length).toBeGreaterThan(0))
  expect(result.current.tags.length).toBeGreaterThan(0)
})
