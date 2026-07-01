import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Toast } from './Toast'

test('renders nothing when there is no message', () => {
  const { container } = render(<Toast message={null} />)
  expect(container).toBeEmptyDOMElement()
})

test('announces the message via a polite live region', () => {
  render(<Toast message="Status updated" />)
  expect(screen.getByRole('status')).toHaveTextContent('Status updated')
})

test('has no accessibility violations', async () => {
  const { container } = render(<Toast message="Status updated" />)
  expect(await axe(container)).toHaveNoViolations()
})
