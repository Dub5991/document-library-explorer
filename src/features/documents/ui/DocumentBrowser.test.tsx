import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { documentsReducer } from '../model/documentsSlice'
import { ToastProvider } from '../../../app/toast/ToastProvider'
import { DocumentBrowser } from './DocumentBrowser'

function renderBrowser() {
  const store = configureStore({ reducer: { documents: documentsReducer } })
  return render(
    <Provider store={store}>
      <ToastProvider>
        <DocumentBrowser />
      </ToastProvider>
    </Provider>,
  )
}

function totalFromSummary(): number {
  const summary = screen.getByText(/of \d+ documents/)
  const match = summary.textContent?.match(/of (\d+)/)
  return match ? Number(match[1]) : 0
}

test('renders the filter panel and the loaded document list', async () => {
  renderBrowser()
  expect(
    await screen.findByText(/Showing \d+ of \d+ documents/),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Search')).toBeInTheDocument()
  expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
})

test('typing a search term narrows the results', async () => {
  renderBrowser()
  await screen.findByText(/Showing \d+ of \d+ documents/)
  const totalBefore = totalFromSummary()

  await userEvent.type(screen.getByLabelText('Search'), 'Vendor Contract')

  await waitFor(() => expect(totalFromSummary()).toBeLessThan(totalBefore))
})

test('opening a document reveals the detail dialog', async () => {
  renderBrowser()
  await screen.findByText(/Showing \d+ of \d+ documents/)

  const [, tbody] = screen.getAllByRole('rowgroup')
  await userEvent.click(within(tbody).getAllByRole('button')[0])

  expect(await screen.findByRole('dialog')).toBeInTheDocument()
})

test('has no accessibility violations once loaded', async () => {
  const { container } = renderBrowser()
  await screen.findByText(/Showing \d+ of \d+ documents/)
  expect(await axe(container)).toHaveNoViolations()
})
