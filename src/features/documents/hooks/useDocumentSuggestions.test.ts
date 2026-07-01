import { renderHook, waitFor } from '@testing-library/react'
import { useDocumentSuggestions } from './useDocumentSuggestions'

test('returns no suggestions for an empty term', async () => {
  const { result } = renderHook(() => useDocumentSuggestions(''))
  await waitFor(() => expect(result.current).toEqual([]))
})

test('returns fuzzy-ranked matches for a term', async () => {
  const { result } = renderHook(() => useDocumentSuggestions('vendor', 5))
  await waitFor(() => expect(result.current.length).toBeGreaterThan(0))
  expect(result.current.length).toBeLessThanOrEqual(5)
  for (const doc of result.current) {
    expect(doc.title.toLowerCase()).toContain('vendor')
  }
})

test('caps the number of suggestions at the limit', async () => {
  const { result } = renderHook(() => useDocumentSuggestions('a', 3))
  await waitFor(() => expect(result.current.length).toBeGreaterThan(0))
  expect(result.current.length).toBeLessThanOrEqual(3)
})
