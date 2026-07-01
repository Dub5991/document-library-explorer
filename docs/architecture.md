# Architecture

The shape of the system is one contract with two implementations behind a single seam.
The UI depends on the contract; a config decision picks which implementation answers.

```
                        UI layer
  ┌──────────────────────────────────────────────────────────┐
  │  features/documents/ui        shared/ui (owned primitives) │
  │   DocumentTable                Button  Table  Badge         │
  │   DocumentFilters              Field   Select Toast         │
  └───────┬───────────────────────────────┬───────────────────┘
          │ read path                      │ write path
          ▼                                ▼
  useDocumentQuery ─▶ useDocuments   Redux store (app/store.ts)
          (DocumentQuery)             documentsSlice
          │                            updateDocumentStatus (thunk)
          │                                │
          └────────────┬───────────────────┘
                       ▼
              data seam:  provider.ts  (exports `dataSource`)
                       │
                       ▼
              interface:  DataSource
              listDocuments · getDocument · updateStatus
              listFolders   · listTags
                       │
        ┌──────────────┴───────────────┐
        ▼                               ▼
  LocalDataSource                 SupabaseDataSource
  in-memory seed                  Postgres (Supabase)
  (no network, no keys)           snake_case rows → domain types

  selection: SupabaseDataSource when VITE_SUPABASE_URL and
  VITE_SUPABASE_ANON_KEY are set; LocalDataSource otherwise.
```

## Layers

**UI.** `features/documents` holds the screen logic — the list table and the filter
panel — composed from the owned primitives in `shared/ui`. Components never fetch; they
call a hook or dispatch a thunk. This keeps data access out of the render tree and behind
the contract.

**Read path.** `useDocumentQuery` owns filter, sort, and page state and derives a
`DocumentQuery` with only the active constraints. `useDocuments` takes that query, calls
`dataSource.listDocuments`, and exposes `items`, `total`, `loading`, and `error`. It keys
its effect on the serialized query and discards stale responses, so a slower earlier
request cannot overwrite a newer result. Read results are local to the view; nothing
about a read touches the store.

**Write path.** A status change dispatches `updateDocumentStatus`, a Redux Toolkit async
thunk that calls `dataSource.updateStatus`. The `documentsSlice` tracks the in-flight
flag per id, commits the returned status into `statusById` on success, and records the
error on failure. The store owns the write outcome because it is shared across the row,
any detail view, and the toast. ADR 0003 records why reads and writes use different
mechanisms.

**Data seam.** Every consumer imports one value, `dataSource`, from `provider.ts`. That
is the only place a backend is chosen. When Supabase config is present the provider
resolves to `SupabaseDataSource`; otherwise it resolves to `LocalDataSource`. The
Supabase client is built lazily, so a keyless machine never opens a connection.

**Contract and implementations.** `DataSource` is the interface every screen depends on.
`LocalDataSource` filters, sorts, and paginates the in-memory seed. `SupabaseDataSource`
runs the equivalent queries against Postgres and maps rows to the domain types. Because
both satisfy the same interface, the same UI actions can be run against either and
compared — the swap test. ADR 0001 records this decision; ADR 0002 records why the UI
primitives are owned rather than pulled from a library.
