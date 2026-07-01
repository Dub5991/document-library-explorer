// Labeled input: label/input/error wired via useId, error announced via role="alert".
import { useId, type InputHTMLAttributes } from 'react'
import styles from './Field.module.css'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function Field({
  label,
  error,
  id,
  type = 'text',
  ...rest
}: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        className={styles.input}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
