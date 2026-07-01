# 0003. Redux Toolkit for the write path, plain hooks for the read path

- Status: Accepted
- Date: 2026-07-01

## Context

The application has two kinds of state with different shapes.

Reads are query-driven and local to a view. A list screen holds filter, sort, and page
state, derives a `DocumentQuery`, and asks the `DataSource` for a page. The result belongs
to that screen; nothing else needs it. This is fetch-render state with a clear owner and a
short lifetime.

The status write is different. Updating a document's status is an async operation with an
in-flight period and a failure mode, and its outcome is shared: the row in the list, a
detail view, and a toast confirmation all care about the same result. That is exactly the
state a component-local `useState` handles badly — it has to be lifted, threaded, or
duplicated across the consumers.

## Decision

Split the two.

Reads stay in plain hooks that call the `DataSource` directly:

- `useDocumentQuery` owns filter/sort/page state and memoizes a clean `DocumentQuery`,
  omitting empty constraints.
- `useDocuments` takes that query and calls `dataSource.listDocuments`, tracking
  `loading` and `error`. It keys the effect on a serialized query and guards against
  stale responses, so an in-flight request never overwrites a newer one.

No global store is involved in a read, because no read result is shared.

The write goes through a Redux Toolkit slice (`documentsSlice`) with an async thunk:

- `updateDocumentStatus` is a `createAsyncThunk` that calls `dataSource.updateStatus`.
- `pending` sets an `updating[id]` flag and clears any prior error.
- `fulfilled` commits the returned status into `statusById[id]` and clears the flag.
- `rejected` clears the flag and records the error message.

Any component reads the current status with `selectDocumentStatus(state, id, fallback)`,
which returns the slice's value when present and the document's own status otherwise. The
in-flight and error state is trackable from one place, and the store is the single owner
of the write outcome.

## Consequences

- A clear boundary: query-driven reads live with the view that runs them; the shared,
  trackable write outcome lives in the store. The boundary matches how each kind of state
  is actually used.
- The cost is two state mechanisms in one application. That is accepted because the
  alternative is worse in both directions: putting reads in Redux adds ceremony to state
  that has one short-lived owner, and putting the write in local state forces the shared
  outcome to be lifted and threaded through every consumer. Each mechanism is used where
  it fits, and the seam between them is the `DataSource`, which both sides call.
- The store surface stays small — one slice, tracking status by id — so the Redux side
  carries only the state that genuinely needs to be shared.
