// jest-axe ships no types of its own; this is the tiny surface we use.
// Must stay import-free: a top-level import turns this into a module, and a
// module-scoped `declare module` can only augment an already-typed package.
// The matcher shape below is hand-typed (not `any`) to satisfy expect.extend
// structurally without importing vitest's own types into this file.
type AxeMatcherResult = { pass: boolean; message: () => string }

declare module 'jest-axe' {
  export function axe(html: Element | string): Promise<unknown>
  export const toHaveNoViolations: {
    toHaveNoViolations: (received: unknown) => AxeMatcherResult
  }
}
