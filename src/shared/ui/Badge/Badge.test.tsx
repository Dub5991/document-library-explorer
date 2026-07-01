import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Badge } from './Badge'

test('renders the human-readable status label', () => {
  render(<Badge status="review" />)
  expect(screen.getByText('In Review')).toBeInTheDocument()
})

test('has no accessibility violations', async () => {
  const { container } = render(<Badge status="approved" />)
  expect(await axe(container)).toHaveNoViolations()
})
