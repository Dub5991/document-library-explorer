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

## Scripts

| script       | purpose                                 |
| ------------ | --------------------------------------- |
| dev          | local dev server                        |
| build        | production build                        |
| lint         | eslint                                  |
| format       | prettier write                          |
| format:check | prettier check (CI)                     |
| typecheck    | tsc project build, no emit              |
| test         | vitest unit/component                   |
| test:a11y    | jest-axe accessibility                  |
| e2e          | cypress end-to-end (headless)           |
| e2e:open     | cypress interactive runner              |
| verify       | typecheck + lint + format + test + a11y |
