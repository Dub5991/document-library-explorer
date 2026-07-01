# 0002. Owned UI primitives instead of a component library

- Status: Accepted
- Date: 2026-07-01

## Context

Accessibility is a first-class requirement: every interactive element has to be
keyboard-operable and screen-reader labeled, and that has to be verifiable, not asserted.
The interface surface is small and specific — a sortable table, status badges, a labeled
input, a labeled select, a form of filter controls, a button, and a status toast.

A third-party component library supplies these shapes, but it also owns their semantics.
When keyboard behavior or ARIA wiring is wrong, the fix lives inside the dependency, and
the exact markup rendered can shift under a version bump. For a surface this small, the
library's breadth is weight the project does not use, and its opacity works against the
requirement to control and test accessibility at the source.

## Decision

Build the primitives in-house under `src/shared/ui/`: `Button`, `Table` (plus
`SortableColumnHeader`), `Badge`, `Field`, `Select`, and `Toast`. Each wraps a native
element and adds only the semantics the application needs:

- `Button` renders a native `<button>` with an explicit `type`.
- `SortableColumnHeader` is a `<th scope="col">` with a button trigger and `aria-sort`,
  so sorting is keyboard-native via Enter and Space.
- `Field` wires label, input, and error message together with `useId`, and exposes the
  error through `aria-invalid` and `role="alert"`.
- `Select` is a labeled native `<select>`, keyboard-native by construction.
- `Badge` pairs a status color with its text label, so state is never conveyed by color
  alone (WCAG 1.4.1).
- `Toast` is an `aria-live="polite"` region with `role="status"` that announces without
  stealing focus.

Focus is handled once, globally: a `:focus-visible` rule in `src/index.css` paints the
`--focus-ring` token, so every owned control shows the same visible ring. Each primitive
carries a colocated jest-axe test, and `npm run test:a11y` runs them as an accessibility
gate.

## Consequences

Wins:

- Semantics are controlled at the primitive level. The exact element, role, and ARIA
  attributes are visible in a few lines of the project's own code.
- Accessibility is testable at the source. jest-axe runs against the real markup on every
  primitive, and the keyboard path is native because the primitives wrap native elements.
- No component-library dependency to install, size, or track across versions. The rendered
  markup does not move unless this repository moves it.

Costs:

- More code to own and maintain. Behavior that a library would supply — variants, edge
  cases, future primitives — is this project's responsibility to build and test.
- No library ecosystem. There are no prebuilt complex widgets to reach for; anything
  beyond the current set has to be written and covered here.

This is the trade taken deliberately: total control of semantics and zero dependency
weight, paid for in code to maintain. It holds while the interface surface stays small; a
much larger surface would reopen the question.
