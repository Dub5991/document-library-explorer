import { renderHook, waitFor } from '@testing-library/react'
import type { Document } from '../../../shared/types/document'
import { dataSource } from '../../../data/provider'
import { useDocument } from './useDocument'

vi.mock('../../../data/provider', () => ({
  dataSource: {
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const sampleDocument: Document = {
  id: 'doc-7',
  title: 'Vendor Contract 7',
  folderId: 'f-contracts',
  tagIds: ['t-0'],
  status: 'draft',
  mimeType: 'application/pdf',
  sizeBytes: 2048,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

test('starts loading then resolves with the fetched document', async () => {
  vi.mocked(dataSource.getDocument).mockResolvedValueOnce(sampleDocument)

  const { result } = renderHook(() => useDocument('doc-7'))

  expect(result.current.loading).toBe(true)
  expect(result.current.document).toBeNull()

  await waitFor(() => expect(result.current.loading).toBe(false))

  expect(result.current.document).toEqual(sampleDocument)
  expect(result.current.error).toBeNull()
  expect(dataSource.getDocument).toHaveBeenCalledWith('doc-7')
})

test('a null id stays idle and never fetches', () => {
  const { result } = renderHook(() => useDocument(null))

  expect(result.current.loading).toBe(false)
  expect(result.current.document).toBeNull()
  expect(result.current.error).toBeNull()
  expect(dataSource.getDocument).not.toHaveBeenCalled()
})

test('surfaces an error message when the fetch rejects', async () => {
  vi.mocked(dataSource.getDocument).mockRejectedValueOnce(
    new Error('Document not found: doc-x'),
  )

  const { result } = renderHook(() => useDocument('doc-x'))

  await waitFor(() => expect(result.current.loading).toBe(false))

  expect(result.current.document).toBeNull()
  expect(result.current.error).toBe('Document not found: doc-x')
})
