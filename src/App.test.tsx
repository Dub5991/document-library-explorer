// Proves the app renders and the document table loads real seeded data end-to-end.
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import App from './App'

test('renders and loads the document table', async () => {
  render(<App />)
  expect(screen.getByText('Document Library Explorer')).toBeInTheDocument()
  expect(
    await screen.findByText(/Showing \d+ of \d+ documents/),
  ).toBeInTheDocument()
  expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
})

test('has no accessibility violations once loaded', async () => {
  const { container } = render(<App />)
  await screen.findByText(/Showing \d+ of \d+ documents/)
  expect(await axe(container)).toHaveNoViolations()
})
