// Verifies the controlled filter row renders controls and forwards user intent to callbacks.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import type { Folder } from '../../../shared/types/folder'
import type { Tag } from '../../../shared/types/tag'
import { DocumentFilters } from './DocumentFilters'

const folders: Folder[] = [
  { id: 'folder-1', name: 'Contracts', parentId: null },
  { id: 'folder-2', name: 'Invoices', parentId: null },
]

const tags: Tag[] = [
  { id: 'tag-1', name: 'Urgent' },
  { id: 'tag-2', name: 'Legal' },
]

function renderFilters(
  overrides: Partial<Parameters<typeof DocumentFilters>[0]> = {},
) {
  const props = {
    folders,
    folderId: null,
    onFolderChange: vi.fn(),
    selectedStatuses: [],
    onToggleStatus: vi.fn(),
    tags,
    selectedTagIds: [],
    onToggleTag: vi.fn(),
    onReset: vi.fn(),
    ...overrides,
  }
  render(<DocumentFilters {...props} />)
  return props
}

test('renders folder, status, and tag controls', () => {
  renderFilters()
  expect(screen.getByLabelText('Folder')).toBeInTheDocument()
  expect(
    screen.getByRole('checkbox', { name: 'In Review' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('checkbox', { name: 'Urgent' })).toBeInTheDocument()
})

test('checking a status calls onToggleStatus with that status', async () => {
  const { onToggleStatus } = renderFilters()
  await userEvent.click(screen.getByRole('checkbox', { name: 'Approved' }))
  expect(onToggleStatus).toHaveBeenCalledWith('approved')
})

test('changing folder calls onFolderChange with the folder id', async () => {
  const { onFolderChange } = renderFilters()
  await userEvent.selectOptions(screen.getByLabelText('Folder'), 'folder-2')
  expect(onFolderChange).toHaveBeenCalledWith('folder-2')
})

test('choosing "All folders" calls onFolderChange with null', async () => {
  const { onFolderChange } = renderFilters({ folderId: 'folder-1' })
  await userEvent.selectOptions(screen.getByLabelText('Folder'), 'All folders')
  expect(onFolderChange).toHaveBeenCalledWith(null)
})

test('Reset button calls onReset', async () => {
  const { onReset } = renderFilters()
  await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
  expect(onReset).toHaveBeenCalledOnce()
})

test('has no accessibility violations', async () => {
  const { container } = render(
    <DocumentFilters
      folders={folders}
      folderId={null}
      onFolderChange={() => {}}
      selectedStatuses={[]}
      onToggleStatus={() => {}}
      tags={tags}
      selectedTagIds={[]}
      onToggleTag={() => {}}
      onReset={() => {}}
    />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
