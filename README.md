# Document Library Explorer

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
