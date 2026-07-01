# Document Library Explorer

[![CI](https://github.com/Dub5991/document-library-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/Dub5991/document-library-explorer/actions/workflows/ci.yml)
![coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)

**Live:** https://document-library-explorer.vercel.app

Browse, search, filter, and update status on a document catalog.

## Stack

React · TypeScript · Vite · Redux Toolkit · Supabase · owned UI primitives

## Run

```bash
npm install
npm run dev        # runs offline with seeded local data — no keys required
```

Supabase activates automatically when `.env` keys are present (see `.env.example`).

## Docker

```bash
docker build -t document-library-explorer .
docker run -p 8080:80 document-library-explorer
```

Serves the production build at `http://localhost:8080` via nginx.

## Scripts

| script        | purpose                                          |
| ------------- | ------------------------------------------------ |
| dev           | local dev server                                 |
| build         | production build                                 |
| lint          | eslint                                           |
| format        | prettier write                                   |
| format:check  | prettier check (CI)                              |
| typecheck     | tsc project build, no emit                       |
| test          | vitest unit/component                            |
| test:coverage | vitest with coverage thresholds enforced         |
| test:a11y     | jest-axe accessibility                           |
| e2e           | cypress end-to-end (headless)                    |
| e2e:open      | cypress interactive runner                       |
| verify        | typecheck + lint + format + coverage + a11y (CI) |

## Documentation

- [Architecture](docs/architecture.md) — the contract-behind-two-implementations structure.
- [Workflow](docs/workflow.md) — the browse → filter → open → update-status flow.
- [Accessibility](docs/accessibility.md) — WCAG 2.1 AA target, keyboard map, enforcement.
- ADRs:
  [0001 DataSource contract](docs/adr/0001-datasource-contract.md) ·
  [0002 Owned primitives](docs/adr/0002-owned-primitives.md) ·
  [0003 Redux write path](docs/adr/0003-redux-write-path.md)
- [CHANGELOG](CHANGELOG.md) — the build arc in Keep a Changelog format.

## Maintaining and extending

To add a data capability, add the method to the `DataSource` interface
(`src/data/DataSource.ts`), implement it in both `LocalDataSource`
(`src/data/local/`) and `SupabaseDataSource` (`src/data/supabase/`), cover it with a
colocated test, and keep the swap test green — the same UI actions must produce identical
results on both implementations. TypeScript enforces that a method on one implementation
exists on the other.

The tree is organized by responsibility: `features/` holds screen logic grouped by feature
(each with its own `ui/`, `hooks/`, `model/`); `shared/` holds owned UI primitives, tokens,
and types used across features; `data/` holds the contract, the provider seam, and the two
implementations; `app/` holds the store and app-level wiring. A feature never imports
another feature's internals — shared code moves to `shared/`.
