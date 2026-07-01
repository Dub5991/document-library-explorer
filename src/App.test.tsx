// Proves the app renders and loads the offline seed end-to-end.
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import App from './App'

test('renders and loads the offline document count', async () => {
  render(<App />)
  expect(screen.getByText('Document Library Explorer')).toBeInTheDocument()
  expect(await screen.findByText(/\d+ documents loaded/)).toBeInTheDocument()
})

test('has no accessibility violations once loaded', async () => {
  const { container } = render(<App />)
  await screen.findByText(/\d+ documents loaded/)
  expect(await axe(container)).toHaveNoViolations()
})
