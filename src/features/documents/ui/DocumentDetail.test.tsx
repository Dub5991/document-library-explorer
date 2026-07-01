import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Provider } from 'react-redux'
import type { ReactElement } from 'react'
import { ToastProvider } from '../../../app/toast/ToastProvider'
import type { Document } from '../../../shared/types/document'
import { dataSource } from '../../../data/provider'
import { documentsReducer } from '../model/documentsSlice'
import { DocumentDetail } from './DocumentDetail'

vi.mock('../../../data/provider', () => ({
  dataSource: {
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

const seedDocument: Document = {
  id: 'doc-42',
  title: 'Client Agreement 42',
  folderId: 'f-contracts',
  tagIds: ['t-0', 't-3'],
  status: 'draft',
  mimeType: 'application/pdf',
  sizeBytes: 2_500_000,
  createdAt: '2025-06-01T00:00:00.000Z',
  updatedAt: '2025-12-01T00:00:00.000Z',
}

function renderDetail(onClose = vi.fn()): {
  onClose: ReturnType<typeof vi.fn>
} {
  const store = configureStore({ reducer: { documents: documentsReducer } })
  const ui: ReactElement = (
    <Provider store={store}>
      <ToastProvider>
        <DocumentDetail documentId="doc-42" onClose={onClose} />
      </ToastProvider>
    </Provider>
  )
  render(ui)
  return { onClose }
}

beforeEach(() => {
  vi.mocked(dataSource.getDocument).mockResolvedValue(seedDocument)
  vi.mocked(dataSource.updateStatus).mockImplementation(async (id, status) => ({
    ...seedDocument,
    id,
    status,
  }))
})

test('renders the seeded document title', async () => {
  renderDetail()
  expect(
    await screen.findByRole('heading', { name: 'Client Agreement 42' }),
  ).toBeInTheDocument()
})

test('Escape key calls onClose', async () => {
  const { onClose } = renderDetail()
  await screen.findByRole('heading', { name: 'Client Agreement 42' })

  await userEvent.keyboard('{Escape}')

  expect(onClose).toHaveBeenCalledTimes(1)
})

test('the Close button calls onClose', async () => {
  const { onClose } = renderDetail()
  await screen.findByRole('heading', { name: 'Client Agreement 42' })

  await userEvent.click(screen.getByRole('button', { name: 'Close' }))

  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking the backdrop calls onClose', async () => {
  const { onClose } = renderDetail()
  await screen.findByRole('heading', { name: 'Client Agreement 42' })

  await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }))

  expect(onClose).toHaveBeenCalledTimes(1)
})

test('changing the status dispatches the update and reflects the new status', async () => {
  renderDetail()
  await screen.findByRole('heading', { name: 'Client Agreement 42' })

  const select = screen.getByLabelText('Update status')
  expect(select).toHaveValue('draft')

  await userEvent.selectOptions(select, 'approved')

  expect(dataSource.updateStatus).toHaveBeenCalledWith('doc-42', 'approved')
  await waitFor(() => expect(select).toHaveValue('approved'))
  expect(screen.getByText('Approved', { selector: 'span' })).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent(
    'Status updated to Approved',
  )
})

test('the open dialog has no accessibility violations', async () => {
  const { container } = (() => {
    const store = configureStore({ reducer: { documents: documentsReducer } })
    return render(
      <Provider store={store}>
        <ToastProvider>
          <DocumentDetail documentId="doc-42" onClose={vi.fn()} />
        </ToastProvider>
      </Provider>,
    )
  })()

  await screen.findByRole('heading', { name: 'Client Agreement 42' })

  expect(await axe(container)).toHaveNoViolations()
})
