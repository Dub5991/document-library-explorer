# Primary workflow

The main flow is: browse the document list, narrow it with filters and sorting, open a
document, change its status, and see the change confirmed. Each step names the module that
carries it.

```
  ┌─────────────┐   sort / filter    ┌──────────────────┐
  │  Browse     │ ─────────────────▶ │  Narrowed list   │
  │  the list   │                    │                  │
  └──────┬──────┘                    └────────┬─────────┘
         │                                    │ open a document
         │                                    ▼
         │                           ┌──────────────────┐
         │                           │  Document detail  │
         │                           └────────┬─────────┘
         │                                    │ change status
         │                                    ▼
         │                           ┌──────────────────┐
         │                           │  Dispatch thunk   │
         │                           │  updateStatus     │
         │                           └────────┬─────────┘
         │                                    │ fulfilled
         │                                    ▼
         │                           ┌──────────────────┐
         └────── list reflects ───── │  Toast confirms   │
                 new status          │  (aria-live)      │
                                     └──────────────────┘
```

## Walkthrough

1. **Browse.** `DocumentTable` (`features/documents/ui/DocumentTable.tsx`) renders the
   list. It calls `useDocuments`, which asks `dataSource.listDocuments` for a page and
   returns `items`, `total`, `loading`, and `error`. The table shows title, a status
   `Badge`, and the updated date.

2. **Sort.** Each column header is a `SortableColumnHeader` — a `<th scope="col">` with a
   button trigger and `aria-sort`. Activating it flips the sort field or direction, which
   changes the `DocumentQuery` and re-runs `useDocuments`. Clicking the active column
   toggles direction; a new column starts ascending.

3. **Filter.** `DocumentFilters` (`features/documents/ui/DocumentFilters.tsx`) renders the
   search `Field`, the folder `Select`, and `fieldset`/`legend` groups of status and tag
   checkboxes. Its state is owned by `useDocumentQuery`, which folds each control into the
   `DocumentQuery` — omitting empty constraints — and resets to page one on any change.

4. **Open detail.** Selecting a document loads it with `dataSource.getDocument(id)` and
   presents its detail, including the status control.

5. **Change status.** The status control dispatches `updateDocumentStatus` from
   `documentsSlice` (`features/documents/model/documentsSlice.ts`). The thunk calls
   `dataSource.updateStatus(id, status)`. While in flight, `updating[id]` is set; on
   success the returned status is committed to `statusById[id]`; on failure the error is
   recorded. Components read the current value through `selectDocumentStatus`.

6. **Confirm.** On `fulfilled`, the `Toast` (`shared/ui/Toast`) renders the confirmation
   in an `aria-live="polite"` `role="status"` region, so assistive technology announces it
   without moving focus. The list reflects the new status through `selectDocumentStatus`.

Steps 1 and 2 are built (the read-only sortable list). Steps 3 through 6 — the filter
wiring, the detail view, the status control, and the toast confirmation — are the
write-path slice landing now; the primitives, hooks, and slice they compose are in place.
