import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function Trigger({ message }: { message: string }) {
  const { showToast } = useToast()
  return (
    <button type="button" onClick={() => showToast(message)}>
      Announce
    </button>
  )
}

test('showToast announces the message in a status region', async () => {
  render(
    <ToastProvider>
      <Trigger message="Status updated to Approved" />
    </ToastProvider>,
  )

  expect(screen.queryByRole('status')).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Announce' }))

  expect(screen.getByRole('status')).toHaveTextContent(
    'Status updated to Approved',
  )
})

test('the message auto-clears after the timeout', () => {
  vi.useFakeTimers()
  try {
    render(
      <ToastProvider>
        <Trigger message="Saved" />
      </ToastProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'Announce' }).click()
    })
    expect(screen.getByRole('status')).toHaveTextContent('Saved')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  } finally {
    vi.useRealTimers()
  }
})

test('useToast throws when used outside a ToastProvider', () => {
  expect(() => render(<Trigger message="x" />)).toThrow(
    'useToast must be used within a ToastProvider',
  )
})
