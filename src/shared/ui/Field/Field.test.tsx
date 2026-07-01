import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Field } from './Field'

test('label is associated with the input', () => {
  render(<Field label="Search" />)
  expect(screen.getByLabelText('Search')).toBeInTheDocument()
})

test('typing updates the input value', async () => {
  render(<Field label="Search" />)
  const input = screen.getByLabelText('Search')
  await userEvent.type(input, 'invoice')
  expect(input).toHaveValue('invoice')
})

test('error is exposed via aria-describedby and role=alert', () => {
  render(<Field label="Search" error="Required" />)
  const input = screen.getByLabelText('Search')
  expect(input).toHaveAccessibleDescription('Required')
  expect(screen.getByRole('alert')).toHaveTextContent('Required')
})

test('has no accessibility violations', async () => {
  const { container } = render(<Field label="Search" error="Required" />)
  expect(await axe(container)).toHaveNoViolations()
})
