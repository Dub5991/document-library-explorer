// RTK store: combines feature reducers; documents slice owns the status-update write path.
import { configureStore } from '@reduxjs/toolkit'
import { documentsReducer } from '../features/documents/model/documentsSlice'

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
