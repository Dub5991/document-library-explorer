// Behavior + a11y coverage for the Button primitive.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Button } from './Button'

test('renders label and fires onClick', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Save</Button>)
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(onClick).toHaveBeenCalledOnce()
})

test('disabled button does not fire onClick', async () => {
  const onClick = vi.fn()
  render(
    <Button onClick={onClick} disabled>
      Save
    </Button>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(onClick).not.toHaveBeenCalled()
})

test('has no accessibility violations', async () => {
  const { container } = render(<Button>Save</Button>)
  expect(await axe(container)).toHaveNoViolations()
})
