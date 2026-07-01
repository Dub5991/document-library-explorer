import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Table } from './Table'
import { SortableColumnHeader } from './SortableColumnHeader'

function renderTable(sort: 'ascending' | 'descending' | 'none') {
  return render(
    <Table>
      <thead>
        <tr>
          <SortableColumnHeader label="Name" sort={sort} onSort={() => {}} />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>invoice.pdf</td>
        </tr>
      </tbody>
    </Table>,
  )
}

test('exposes sort state via aria-sort', () => {
  renderTable('ascending')
  expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
    'aria-sort',
    'ascending',
  )
})

test('clicking the header button triggers onSort', async () => {
  const onSort = vi.fn()
  render(
    <table>
      <thead>
        <tr>
          <SortableColumnHeader label="Name" sort="none" onSort={onSort} />
        </tr>
      </thead>
    </table>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Name' }))
  expect(onSort).toHaveBeenCalledOnce()
})

test('has no accessibility violations', async () => {
  const { container } = renderTable('none')
  expect(await axe(container)).toHaveNoViolations()
})
