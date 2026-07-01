# Accessibility

## Target

WCAG 2.1 Level AA. Every interactive element is keyboard-operable and screen-reader
labeled from the first line it ships, and that is verified in tests rather than asserted.

## Keyboard map

| Key         | Reaches / does                                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab         | Moves forward through focusable controls: sortable column headers, the search field, the folder select, the status and tag checkboxes, and buttons |
| Shift + Tab | Moves backward through the same order                                                                                                              |
| Enter       | Activates a focused button — a sortable column header, or Reset                                                                                    |
| Space       | Activates a focused button, toggles a focused checkbox, opens a focused native select                                                              |
| Escape      | Reserved for dismissing the document detail dialog (see In progress)                                                                               |

Sorting is keyboard-native because each sortable header is a real `<button>` inside its
`<th>`; the select and checkboxes are native elements, so their keyboard behavior is the
platform's, not a re-implementation.

## Affordances in place

- **Semantic table.** Column headers are `<th scope="col">`, so each cell is associated
  with its header for assistive technology (`shared/ui/Table/SortableColumnHeader.tsx`).
- **Sortable headers.** A sortable header carries `aria-sort` set to `ascending`,
  `descending`, or `none`, and its trigger is a native button.
- **Filter groups.** The status and tag filters are `<fieldset>` groups with a `<legend>`,
  so the group's purpose is announced with each checkbox (`DocumentFilters.tsx`).
- **Labeled inputs.** `Field` ties label and input together with `useId`; an error is
  exposed via `aria-invalid` and announced through `role="alert"`. `Select` is a labeled
  native `<select>`.
- **Status not by color alone.** `Badge` renders the status color together with its text
  label, meeting WCAG 1.4.1 (`shared/ui/Badge/Badge.tsx`).
- **Live confirmation.** `Toast` is a `role="status"` `aria-live="polite"` region, so a
  status change is announced without stealing focus (`shared/ui/Toast/Toast.tsx`).
- **Visible focus.** A single `:focus-visible` rule in `src/index.css` paints the
  `--focus-ring` token, so every owned control shows the same visible ring, including in
  the dark-scheme token set.

## In progress

The document detail view — `role="dialog"` with `aria-modal`, a focus trap, and Escape to
dismiss — and the status control that writes through the Redux slice are the write-path
slice landing now. The primitives and the aria-live toast they build on are already in
place and tested.

## How it is enforced

- **jest-axe on every primitive.** Each owned primitive has a colocated test asserting no
  accessibility violations. `npm run test:a11y` runs that suite.
- **Lint rules.** `eslint-plugin-jsx-a11y` (recommended flat config) runs in `npm run
lint` and in CI, catching missing labels, roles, and handlers at the source.
- **The audit ritual.** `npm run verify` chains typecheck, lint, format, coverage, and the
  a11y suite; a manual keyboard walk (Tab / Shift-Tab / Enter / Space reach and operate
  every control, focus visible) is part of the per-component gate in `docs/STANDARDS.md`.
