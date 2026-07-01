import { fireEvent, render, screen } from '@testing-library/react'
import { useFocusTrap } from './useFocusTrap'

function TrappedDialog({ active }: { active: boolean }) {
  const ref = useFocusTrap(active)
  return (
    <div>
      <button type="button">Outside</button>
      <div ref={ref}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </div>
    </div>
  )
}

test('moves focus to the first focusable element on activate', () => {
  render(<TrappedDialog active={true} />)
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
})

test('Tab from the last element wraps back to the first', () => {
  render(<TrappedDialog active={true} />)
  const last = screen.getByRole('button', { name: 'Last' })
  last.focus()

  fireEvent.keyDown(document, { key: 'Tab' })

  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
})

test('Shift+Tab from the first element wraps to the last', () => {
  render(<TrappedDialog active={true} />)
  const first = screen.getByRole('button', { name: 'First' })
  first.focus()

  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

  expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
})

test('restores focus to the previously focused element on deactivate', () => {
  const outside = document.createElement('button')
  outside.textContent = 'Opener'
  document.body.appendChild(outside)
  outside.focus()

  const { rerender } = render(<TrappedDialog active={true} />)
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()

  rerender(<TrappedDialog active={false} />)
  expect(outside).toHaveFocus()

  document.body.removeChild(outside)
})
