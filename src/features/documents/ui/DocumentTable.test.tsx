import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { DocumentTable } from './DocumentTable'
import type { Document } from '../../../shared/types/document'

const rows: Document[] = [
  {
    id: 'doc-1',
    title: 'Vendor Contract 1',
    folderId: 'f-contracts',
    tagIds: ['t-0'],
    status: 'approved',
    mimeType: 'application/pdf',
    sizeBytes: 12345,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
]

const baseProps = {
  items: rows,
  total: 1,
  loading: false,
  error: null,
  sort: { field: 'title', direction: 'ascending' } as const,
  onSort: () => {},
  onOpen: () => {},
}

test('renders the summary and a row per document', () => {
  render(<DocumentTable {...baseProps} />)
  expect(screen.getByText('Showing 1 of 1 documents')).toBeInTheDocument()
  expect(screen.getByText('Vendor Contract 1')).toBeInTheDocument()
})

test('reflects the active sort field via aria-sort', () => {
  render(<DocumentTable {...baseProps} />)
  expect(screen.getByRole('columnheader', { name: 'Title' })).toHaveAttribute(
    'aria-sort',
    'ascending',
  )
})

test('clicking a header calls onSort with that field', async () => {
  const onSort = vi.fn()
  render(<DocumentTable {...baseProps} onSort={onSort} />)
  await userEvent.click(screen.getByRole('button', { name: 'Status' }))
  expect(onSort).toHaveBeenCalledWith('status')
})

test('clicking a title calls onOpen with the document id', async () => {
  const onOpen = vi.fn()
  render(<DocumentTable {...baseProps} onOpen={onOpen} />)
  await userEvent.click(
    screen.getByRole('button', { name: 'Vendor Contract 1' }),
  )
  expect(onOpen).toHaveBeenCalledWith('doc-1')
})

test('shows the empty state when there are no documents', () => {
  render(<DocumentTable {...baseProps} items={[]} total={0} />)
  expect(screen.getByText('No documents found')).toBeInTheDocument()
})

test('surfaces an error message via role=alert', () => {
  render(<DocumentTable {...baseProps} error="Failed to load documents" />)
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Failed to load documents',
  )
})

test('has no accessibility violations', async () => {
  const { container } = render(<DocumentTable {...baseProps} />)
  expect(await axe(container)).toHaveNoViolations()
})
