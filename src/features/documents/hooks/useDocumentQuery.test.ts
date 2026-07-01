// Verifies the derived DocumentQuery reflects filter/sort/page state changes.
import { act, renderHook } from '@testing-library/react'
import { useDocumentQuery } from './useDocumentQuery'

test('initial query carries only default sort and page', () => {
  const { result } = renderHook(() => useDocumentQuery())
  expect(result.current.query).toEqual({
    sort: { field: 'updatedAt', direction: 'descending' },
    page: 1,
  })
})

test('setSearch updates query.search and resets page to 1', () => {
  const { result } = renderHook(() => useDocumentQuery())
  act(() => result.current.setPage(3))
  act(() => result.current.setSearch('invoice'))
  expect(result.current.query.search).toBe('invoice')
  expect(result.current.query.page).toBe(1)
})

test('blank search is omitted from the derived query', () => {
  const { result } = renderHook(() => useDocumentQuery())
  act(() => result.current.setSearch('   '))
  expect(result.current.query.search).toBeUndefined()
})

test('toggleStatus adds then removes a status', () => {
  const { result } = renderHook(() => useDocumentQuery())
  act(() => result.current.toggleStatus('review'))
  expect(result.current.query.status).toEqual(['review'])
  act(() => result.current.toggleStatus('review'))
  expect(result.current.query.status).toBeUndefined()
})

test('setSort flips direction when the same field repeats', () => {
  const { result } = renderHook(() => useDocumentQuery())
  act(() => result.current.setSort('title'))
  expect(result.current.query.sort).toEqual({
    field: 'title',
    direction: 'ascending',
  })
  act(() => result.current.setSort('title'))
  expect(result.current.query.sort).toEqual({
    field: 'title',
    direction: 'descending',
  })
})

test('reset clears every active filter back to defaults', () => {
  const { result } = renderHook(() => useDocumentQuery())
  act(() => result.current.setSearch('invoice'))
  act(() => result.current.setFolder('folder-1'))
  act(() => result.current.toggleTag('tag-1'))
  act(() => result.current.setSort('title'))
  act(() => result.current.reset())
  expect(result.current.query).toEqual({
    sort: { field: 'updatedAt', direction: 'descending' },
    page: 1,
  })
})
