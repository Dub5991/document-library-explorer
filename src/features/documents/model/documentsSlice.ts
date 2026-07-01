// Write-path slice: tracks in-flight/optimistic status updates by document id (read path stays in a plain hook).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { dataSource } from '../../../data/provider'
import type { Status } from '../../../shared/types/status'
import type { RootState } from '../../../app/store'

export type DocumentsState = {
  statusById: Record<string, Status>
  updating: Record<string, boolean>
  error: string | null
}

const initialState: DocumentsState = {
  statusById: {},
  updating: {},
  error: null,
}

export const updateDocumentStatus = createAsyncThunk(
  'documents/updateStatus',
  async ({ id, status }: { id: string; status: Status }) => {
    return dataSource.updateStatus(id, status)
  },
)

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateDocumentStatus.pending, (state, action) => {
        state.updating[action.meta.arg.id] = true
        state.error = null
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        const document = action.payload
        state.statusById[document.id] = document.status
        delete state.updating[document.id]
        state.error = null
      })
      .addCase(updateDocumentStatus.rejected, (state, action) => {
        delete state.updating[action.meta.arg.id]
        state.error = action.error.message ?? 'Failed to update status'
      })
  },
})

export const documentsReducer = documentsSlice.reducer

export function selectDocumentStatus(
  state: RootState,
  id: string,
  fallback: Status,
): Status {
  return state.documents.statusById[id] ?? fallback
}
