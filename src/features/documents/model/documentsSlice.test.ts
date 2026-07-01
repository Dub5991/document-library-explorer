import type { Document } from '../../../shared/types/document'
import { dataSource } from '../../../data/provider'
import { documentsReducer, updateDocumentStatus } from './documentsSlice'

vi.mock('../../../data/provider', () => ({
  dataSource: {
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

const baseDocument: Document = {
  id: 'doc-1',
  title: 'Contract',
  folderId: null,
  tagIds: [],
  status: 'draft',
  mimeType: 'application/pdf',
  sizeBytes: 1024,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

test('initial state has empty statusById/updating and no error', () => {
  const state = documentsReducer(undefined, { type: '@@INIT' })
  expect(state).toEqual({ statusById: {}, updating: {}, error: null })
})

test('pending marks the document as updating', () => {
  const action = updateDocumentStatus.pending('req-id', {
    id: 'doc-1',
    status: 'approved',
  })
  const state = documentsReducer(undefined, action)
  expect(state.updating['doc-1']).toBe(true)
  expect(state.error).toBeNull()
})

test('fulfilled sets statusById and clears updating', () => {
  const pendingState = documentsReducer(
    undefined,
    updateDocumentStatus.pending('req-id', { id: 'doc-1', status: 'approved' }),
  )
  const updated: Document = { ...baseDocument, status: 'approved' }
  const state = documentsReducer(
    pendingState,
    updateDocumentStatus.fulfilled(updated, 'req-id', {
      id: 'doc-1',
      status: 'approved',
    }),
  )
  expect(state.statusById['doc-1']).toBe('approved')
  expect(state.updating['doc-1']).toBeUndefined()
  expect(state.error).toBeNull()
})

test('rejected clears updating and sets an error message', () => {
  const pendingState = documentsReducer(
    undefined,
    updateDocumentStatus.pending('req-id', { id: 'doc-1', status: 'approved' }),
  )
  const state = documentsReducer(
    pendingState,
    updateDocumentStatus.rejected(new Error('network down'), 'req-id', {
      id: 'doc-1',
      status: 'approved',
    }),
  )
  expect(state.updating['doc-1']).toBeUndefined()
  expect(state.error).toBe('network down')
})

test('updateDocumentStatus thunk calls dataSource.updateStatus and dispatches fulfilled', async () => {
  const updated: Document = { ...baseDocument, status: 'archived' }
  vi.mocked(dataSource.updateStatus).mockResolvedValueOnce(updated)

  const dispatch = vi.fn()
  const thunk = updateDocumentStatus({ id: 'doc-1', status: 'archived' })
  const result = await thunk(dispatch, () => ({}), undefined)

  expect(dataSource.updateStatus).toHaveBeenCalledWith('doc-1', 'archived')
  expect(result.type).toBe('documents/updateStatus/fulfilled')
})
