# Project Standards

The single source of truth for how this project stays coherent, when it is "done,"
and what makes the repository worth reading. Check work against this file at every gate.

---

## 1. Anti-Drift Audit

Drift is any divergence between what was decided and what exists. Each check below has a
**detection method** (how you catch it) and a **cadence** (when you run it). Nothing here
requires a tool you do not own — every check is a command or a read.

### 1.1 Contract drift

The `DataSource` interface is the source of truth. Both implementations must satisfy it
identically.

- **Detect:** `npx tsc --noEmit` — the compiler proves both impls match the interface.
  Run the swap test: same UI actions against Local and Supabase produce identical results.
- **Cadence:** every commit that touches `data/`, and before any merge to `main`.

### 1.2 Modularity drift

A feature must never reach into another feature's internals. Shared code lives in
`shared/`; cross-feature imports are the smell.

- **Detect:** `grep -rn "features/.*/" src/features --include=*.ts* | grep -v "own feature"`
  — any import from one feature folder into another is a violation. Shared code moves to
  `shared/`.
- **Cadence:** end of every build slice.

### 1.3 Comment / documentation drift

Every code block carries a comment explaining _why_, not just _what_. Patches erode this.

- **Detect:** manual read of the diff before commit — no block ships uncommented. The
  README and `docs/` reflect current reality, not a past plan.
- **Cadence:** every commit (read your own diff first).

### 1.4 Test drift

No feature ships without a colocated test. Coverage only moves up.

- **Detect:** `npm run test -- --coverage` — compare against the last recorded number.
  A drop is a failed gate.
- **Cadence:** end of every build slice; enforced again in CI.

### 1.5 Accessibility drift

Every interactive primitive is keyboard-operable and screen-reader labeled from line one.

- **Detect:** `npm run test:a11y` (jest-axe) green on every component. Manual keyboard
  walk: Tab / Shift-Tab / Enter / Escape reach and operate every control, focus visible.
- **Cadence:** on every new or changed component.

### 1.6 Type drift

`any` is banned. Types are asserted against the real data shape.

- **Detect:** `grep -rn ": any" src` returns nothing. `npx tsc --noEmit` is clean.
- **Cadence:** every commit.

### 1.7 Offline / reproducibility drift

The app must run fully offline with seeded local data and zero keys. Supabase is an
enhancement, never a hard dependency.

- **Detect:** in a clean checkout with no `.env`, `npm install && npm run dev` renders a
  fully populated UI. If it is blank, the offline guarantee is broken.
- **Cadence:** before every merge to `main`, and once from a fresh `git clone`.

### 1.8 Scope drift

Only features in the Definition of Done get built. The repository describes the software
on its own terms and never names external context it does not need.

- **Detect:** `npm run slop` sweeps for out-of-scope references; new features not on the
  DoD list are rejected or added deliberately.
- **Cadence:** every commit message, and a full-repo sweep before final delivery.

### 1.9 Green-main drift

`main` is always shippable.

- **Detect:** CI runs lint + type + unit + a11y + build on every push. Red main is a stop.
- **Cadence:** every push (automated).

### Audit ritual (run before any merge to main)

```bash
npm run typecheck     # types + contract conformance
npm run lint          # style + slop-tier rules
npm run test:coverage # unit/component, coverage threshold enforced
npm run test:a11y     # accessibility assertions
npm run build         # production build compiles
npm run slop          # anti-slop sweep: greps + knip + jscpd (see docs/ANTI_SLOP.md)
git diff --stat       # read what actually changed
```

All pass, or the merge does not happen. `npm run verify` chains the first six.
The slop tier (texture) is defined in `docs/ANTI_SLOP.md`.

---

## 2. Definition of Done

Two levels. A slice is not done until it clears the **per-slice** gate. The project is not
done until every **project-level** box is checked.

### 2.1 Per-slice Definition of Done

A build slice ships only when ALL are true:

- [ ] Code is modular — lives in its correct feature/shared folder, no cross-feature reach
- [ ] Every code block has a comment explaining its purpose
- [ ] Colocated test exists and passes (unit or component)
- [ ] Accessibility verified — keyboard path + ARIA, jest-axe green
- [ ] Types clean, no `any`, `tsc --noEmit` passes
- [ ] Offline still works (no new hard Supabase dependency)
- [ ] One atomic commit, conventional message, `main` left green

### 2.2 Project-level Definition of Done — MUST complete

**Data layer**

- [ ] `DataSource` interface defined and documented (the contract)
- [ ] `LocalDataSource` — offline seed of 500+ rows, implements the interface
- [ ] `SupabaseDataSource` — implements the same interface, byte-for-byte behavior
- [ ] Provider auto-selects Supabase when keys present, Local when absent
- [ ] Swap test passes — identical UX on both implementations

**Supabase**

- [ ] Tables: documents, folders, tags — with indexes for query performance
- [ ] Row-Level Security deny-by-default; explicit read + status-update policies only
- [ ] Migration SQL committed to the repo
- [ ] Same 500+ rows seeded server-side

**Features**

- [ ] Document list with correct table semantics (`<table>`, scope, caption)
- [ ] Filter + sort via custom hooks (not inline logic)
- [ ] Document detail view with managed focus
- [ ] Status update — write path through Redux Toolkit
- [ ] Toast feedback wired to an ARIA live region

**Owned UI primitives** (each keyboard + ARIA + tested)

- [ ] Button
- [ ] Table
- [ ] Badge
- [ ] Field (input/select)
- [ ] Toast

**Quality tier** (the proof, not the claim)

- [ ] Vitest + React Testing Library — unit/component coverage on hooks and primitives
- [ ] jest-axe — accessibility assertions on every component
- [ ] Cypress — at least one end-to-end flow: browse → filter → open → update status
- [ ] Coverage threshold set and enforced in CI

**Delivery**

- [ ] Dockerfile builds and runs the app
- [ ] GitHub Actions runs lint + type + test + a11y + build on every push
- [ ] Deployed preview (seeded, so it is never blank)
- [ ] README complete: run instructions, stack, scripts, live link

---

## 3. Repository Signals

These turn a working app into a repository worth reading. Each is a real artifact a
technical reviewer looks for, and each stands on its own engineering merit.

### 3.1 Commit history

- Conventional commits (`feat:`, `chore:`, `test:`, `fix:`, `docs:`), atomic, readable.
- History reads like a build log: reqs → scaffold → contract → impls → features → tests →
  ship. A reviewer can reconstruct the whole SDLC from `git log --oneline`.

### 3.2 README as SDLC narrative

Opens with what it does and how to run it in one command. Traces the arc:
requirements → design → contract → test → deploy. Live demo link at the top.

### 3.3 Architecture Decision Records (`docs/adr/`)

Short, dated entries for the calls that show judgment:

- Why one `DataSource` contract behind two implementations
- Why owned primitives over a component library
- Why Redux Toolkit for the write path
  Three ADRs demonstrate systems-analysis thinking better than any resume line.

### 3.4 Visible green status

- CI badge and coverage badge in the README. Green tests on the landing page prove the
  testing tier at a glance — the reviewer never has to take it on faith.

### 3.5 CHANGELOG.md

Keep-a-Changelog format. Shows the product evolving deliberately, not dumped in one push.

### 3.6 Issues + PRs used properly

Even solo: open an issue per feature, close it with a PR. The board and PR trail mirror an
agile, ticket-driven workflow without a word of explanation.

### 3.7 Accessibility statement

A short `docs/accessibility.md`: WCAG target, keyboard map, how a11y is tested. Rare in
comparable projects; immediately noticed by anyone who values it.

### 3.8 A design artifact

One wireframe or component sketch committed to `docs/`. Shows the design→engineering
bridge and covers the prototype/wireframe nice-to-have.

### 3.9 Seeded live demo

The deployed app is populated on first load. A blank demo reads as unfinished; a full one
reads as shipped.

---

## Standard met when

Every audit check passes clean · every Definition-of-Done box is ticked · every repository
signal is present · a stranger can clone, run offline in one command, read the history, and
understand exactly what was built and how it was verified — without ever being told why.
