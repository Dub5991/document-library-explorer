// Labeled native <select>: keyboard-native, screen-reader-labeled via htmlFor/useId.
import { useId } from 'react'
import styles from './Select.module.css'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  id?: string
  disabled?: boolean
}

export function Select({
  label,
  value,
  onChange,
  options,
  id,
  disabled,
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={selectId}>
        {label}
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
