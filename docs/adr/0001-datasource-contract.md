# 0001. One DataSource contract behind two implementations

- Status: Accepted
- Date: 2026-07-01

## Context

The application reads and writes a document catalog: list with filter/sort/paginate,
fetch one document, update a status, and enumerate the folders and tags used as filter
options. Two runtime targets have to be supported:

- A fully offline mode that runs from a seeded in-memory dataset with no network and no
  credentials, so a clean checkout renders a populated UI with `npm run dev` alone.
- A server-backed mode against Postgres (Supabase) when credentials are present.

Without a boundary, query logic leaks into components and each screen ends up coupled to
whichever backend happens to be wired at the time. Swapping backends then means editing
every call site, and there is no single place to prove the two behave the same.

## Decision

Define one interface, `DataSource` (`src/data/DataSource.ts`), as the source of truth for
every read and write the UI can perform:

```ts
listDocuments(query: DocumentQuery): Promise<Page<Document>>
getDocument(id: string): Promise<Document>
updateStatus(id: string, status: Status): Promise<Document>
listFolders(): Promise<Folder[]>
listTags(): Promise<Tag[]>
```

`DocumentQuery` carries the full read intent (search, folderId, tagIds, status, sort,
page, pageSize), so filtering and sorting belong to the data layer, not the component.

Two implementations sit behind that interface:

- `LocalDataSource` (`src/data/local/`) filters, sorts, and paginates the in-memory seed.
- `SupabaseDataSource` (`src/data/supabase/`) issues the equivalent queries against
  Postgres and maps `snake_case` rows to the domain types.

The application imports a single value, `dataSource`, from the provider seam
(`src/data/provider.ts`). The provider resolves to `SupabaseDataSource` when
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (`hasSupabaseConfig()` in
`src/data/supabase/client.ts`) and to `LocalDataSource` otherwise. The Supabase client is
constructed lazily, so a machine with no keys never touches the network. Every consumer —
the `useDocuments` read hook and the Redux write thunk — depends only on the interface,
never on a concrete implementation.

## Consequences

Wins:

- The contract is the single source of truth. Reading `DataSource.ts` tells you every
  operation the UI can perform.
- Implementations are swappable at one seam. Selecting a backend is a config decision, not
  a code change across call sites.
- Offline is a first-class mode, not a mock. Absent keys, the app falls back to Local and
  still runs end to end.
- The two implementations are directly comparable, which makes a swap test possible: the
  same UI actions run against Local and Supabase must produce identical results. That test
  is the guard against the two drifting apart. TypeScript proves shape conformance
  (`npm run typecheck`); the swap test proves behavioral conformance.

Costs:

- Every new capability has to be added in three places: the interface and both
  implementations. A method that exists on only one implementation is a contract
  violation the compiler will reject.
- Behavioral parity is not free. Semantics that Postgres gives cheaply (case-insensitive
  search, tag-array overlap, stable pagination ordering) have to be reproduced by hand in
  the Local implementation, and vice versa. The swap test is what keeps them honest.
