# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Repository scaffold: Vite + React + TypeScript, organized into a feature-sliced
  structure (`features/`, `shared/`, `data/`, `app/`).
- Quality toolchain: Vitest and React Testing Library for unit and component tests,
  jest-axe for accessibility assertions, Cypress for end-to-end flows, Husky pre-commit
  hooks, and a GitHub Actions CI pipeline.
- Design tokens (`shared/tokens.css`) and owned UI primitives: `Button`, `Table` with
  `SortableColumnHeader`, `Badge`, `Field`, `Select`, and `Toast` — each keyboard-operable,
  ARIA-labeled, and covered by a colocated jest-axe test.
- `DataSource` contract (`data/DataSource.ts`): the single interface for
  `listDocuments`, `getDocument`, `updateStatus`, `listFolders`, and `listTags`, with the
  `DocumentQuery` read model.
- `LocalDataSource` with an in-memory seed of documents, folders, and tags, filtering,
  sorting, and pagination fully offline with no keys.
- Redux Toolkit store and the documents write-path slice: `updateDocumentStatus` async
  thunk tracking the in-flight flag, committed status, and error per document id.
- Document list: a read-only sortable table wired through `useDocuments`, showing title,
  status badge, and updated date.
- Filter panel and the `useDocumentQuery` hook: search, folder, status, and tag controls
  deriving a clean `DocumentQuery`.
- `SupabaseDataSource`: the same contract against Postgres, with server-side filter, sort,
  and pagination and row-to-domain mapping, behind a lazily constructed client.
- Containerization: a multi-stage `Dockerfile` serving the production build via nginx.
- Project standards (`docs/STANDARDS.md`) with an anti-drift audit and Definition of Done,
  the anti-slop gate (`docs/ANTI_SLOP.md`), and an enforced coverage threshold.
- Documentation set: architecture and workflow diagrams, three Architecture Decision
  Records, and an accessibility statement under `docs/`.
- Vercel deployment with an SPA rewrite configuration and a live link in the README.

### Changed

- The data provider seam (`data/provider.ts`) selects `SupabaseDataSource` when Supabase
  config is present and falls back to `LocalDataSource` otherwise, keeping the app
  runnable offline.
