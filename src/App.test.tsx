// Smoke test proving the Vitest + RTL + jest-axe pipeline runs green.
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import App from './App'

test('renders without crashing', () => {
  render(<App />)
  expect(screen.getByText('Document Library Explorer')).toBeInTheDocument()
})

test('has no accessibility violations', async () => {
  const { container } = render(<App />)
  expect(await axe(container)).toHaveNoViolations()
})
