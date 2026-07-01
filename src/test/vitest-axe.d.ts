// Type augmentation so Vitest's `expect` knows about jest-axe's matcher.
import 'vitest'

interface CustomMatchers<R = unknown> {
  toHaveNoViolations(): R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
