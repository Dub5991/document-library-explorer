// jest-axe ships no types of its own; this is the tiny surface we use.
// Must stay import-free: a top-level import turns this into a module, and a
// module-scoped `declare module` can only augment an already-typed package.
declare module 'jest-axe' {
  export function axe(html: Element | string): Promise<unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const toHaveNoViolations: any
}
