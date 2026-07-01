// Owned button: native <button> + tokens, no library. Focus ring is global (index.css).
import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary'
}

export function Button({
  variant = 'default',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const variantClass = variant === 'primary' ? styles.primary : ''
  return (
    <button
      type={type}
      className={[styles.button, variantClass, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
