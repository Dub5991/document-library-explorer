# Supabase backend

Optional backend for Document Library Explorer. The app runs fully offline against the
local seed with no keys set; it switches to Supabase only when both
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present in `.env`.

## Apply schema and seed

With the Supabase CLI, from the repo root:

```sh
supabase db push          # runs migrations/0001_init.sql
psql "$DATABASE_URL" -f supabase/seed.sql
```

Or in the dashboard SQL editor, run the contents of `migrations/0001_init.sql`
first, then `seed.sql`.

## Connect the app

Copy the project URL and anon key into `.env`:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Restart the dev server. The provider auto-detects the keys and selects the
Supabase data source; remove them to fall back to local.

## Access model

Row-Level Security is on for all three tables. Policies grant public read on
folders, tags, and documents, plus an update on documents for status
transitions. No insert or delete policies exist, so those operations are denied.
