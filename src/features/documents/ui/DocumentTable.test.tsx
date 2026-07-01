import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { DocumentTable } from './DocumentTable'

test('renders seeded document rows once loaded', async () => {
  render(<DocumentTable />)
  expect(screen.getByText('Loading…')).toBeInTheDocument()

  expect(
    await screen.findByText(/Showing \d+ of \d+ documents/),
  ).toBeInTheDocument()
  expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
})

test('clicking a sortable header toggles aria-sort and re-queries', async () => {
  render(<DocumentTable />)
  await screen.findByText(/Showing \d+ of \d+ documents/)

  const titleHeader = screen.getByRole('columnheader', { name: 'Title' })
  expect(titleHeader).toHaveAttribute('aria-sort', 'ascending')

  await userEvent.click(screen.getByRole('button', { name: 'Title' }))

  expect(
    await screen.findByText(/Showing \d+ of \d+ documents/),
  ).toBeInTheDocument()
  expect(titleHeader).toHaveAttribute('aria-sort', 'descending')
})

test('has no accessibility violations once loaded', async () => {
  const { container } = render(<DocumentTable />)
  await screen.findByText(/Showing \d+ of \d+ documents/)
  expect(await axe(container)).toHaveNoViolations()
})
