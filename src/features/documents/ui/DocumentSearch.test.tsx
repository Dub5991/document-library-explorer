import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { DocumentSearch } from './DocumentSearch'

function Harness({ onOpen = () => {} }: { onOpen?: (id: string) => void }) {
  const [value, setValue] = useState('')
  return <DocumentSearch value={value} onChange={setValue} onOpen={onOpen} />
}

test('exposes a labeled combobox input', () => {
  render(<Harness />)
  const input = screen.getByRole('combobox', { name: 'Search' })
  expect(input).toHaveAttribute('aria-expanded', 'false')
})

test('shows fuzzy suggestions as the user types', async () => {
  render(<Harness />)
  await userEvent.type(screen.getByRole('combobox'), 'vendor')
  const options = await screen.findAllByRole('option')
  expect(options.length).toBeGreaterThan(0)
  expect(options[0].textContent?.toLowerCase()).toContain('vendor')
})

test('clicking a suggestion opens that document', async () => {
  const onOpen = vi.fn()
  render(<Harness onOpen={onOpen} />)
  await userEvent.type(screen.getByRole('combobox'), 'vendor')
  const option = (await screen.findAllByRole('option'))[0]
  await userEvent.click(option)
  expect(onOpen).toHaveBeenCalledOnce()
})

test('keyboard down-arrow then Enter opens the active suggestion', async () => {
  const onOpen = vi.fn()
  render(<Harness onOpen={onOpen} />)
  const input = screen.getByRole('combobox')
  await userEvent.type(input, 'vendor')
  await screen.findAllByRole('option')
  await userEvent.keyboard('{ArrowDown}{Enter}')
  expect(onOpen).toHaveBeenCalledOnce()
})

test('has no accessibility violations with suggestions open', async () => {
  const { container } = render(<Harness />)
  await userEvent.type(screen.getByRole('combobox'), 'vendor')
  await screen.findAllByRole('option')
  expect(await axe(container)).toHaveNoViolations()
})
