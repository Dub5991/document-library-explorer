// Smoke test proving the jest-axe a11y pipeline runs green.
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import App from './App'

test('has no accessibility violations', async () => {
  const { container } = render(<App />)
  expect(await axe(container)).toHaveNoViolations()
})
