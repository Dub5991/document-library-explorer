// Behavior + a11y coverage for the Select primitive.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Select } from './Select'

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
]

test('label is associated with the control', () => {
  render(
    <Select
      label="Status"
      value="draft"
      onChange={() => {}}
      options={options}
    />,
  )
  expect(screen.getByLabelText('Status')).toBeInTheDocument()
})

test('selecting an option fires onChange with the value', async () => {
  const onChange = vi.fn()
  render(
    <Select
      label="Status"
      value="draft"
      onChange={onChange}
      options={options}
    />,
  )
  await userEvent.selectOptions(screen.getByLabelText('Status'), 'approved')
  expect(onChange).toHaveBeenCalledWith('approved')
})

test('has no accessibility violations', async () => {
  const { container } = render(
    <Select
      label="Status"
      value="draft"
      onChange={() => {}}
      options={options}
    />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
