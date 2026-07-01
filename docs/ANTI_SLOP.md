# Anti-Slop Audit

Slop is any pattern that reads as unreviewed generation — typed or generated, the origin
doesn't matter. The standard: every line survives a senior engineer's read. This file
pairs with `STANDARDS.md` (drift guards structure; this guards _texture_).

Each check: **detect** (a command or litmus) + **cadence** (when it runs).

---

## 1. Restated-code comments

A comment that says what the line already says is noise wearing a badge.

- **Litmus:** delete the comment. If nothing is lost, it was slop. Every surviving
  comment answers _why_ or _what breaks if this changes_ — never _what_.
- **Cadence:** read your own diff, every commit.

```ts
// BAD:  // set loading to true
// GOOD: // optimistic flag flips before the request so the row never flickers
```

## 2. Chatty / apologetic comments

The loudest AI tell: `in a real app`, `for simplicity`, `you might want to`,
`note that`, `basically`. This IS the real app.

- **Detect:** `grep -rniE "in a real (app|application|project)|for simplicity|you (may|might|could) want|note that|basically|obviously|simply" src`
- **Cadence:** every commit. Zero matches, always.

## 3. Generic naming

`handleData`, `processItems`, `temp`, `result2`, `helper`, a `utils` grab-bag.

- **Detect:** `grep -rnE "handleData|processItems|\btemp\b|\bdata2\b|\bresult[0-9]\b|myFunction" src`
  plus the stranger test: a name must tell a stranger what it does — `applyStatusFilter`
  passes, `handleChange2` fails.
- **Cadence:** per slice.

## 4. Dead code, unused exports, phantom deps

Generation leaves orphans: imports never used, helpers never called, deps never imported.

- **Detect:** ESLint `no-unused-vars` (CI) · `npx knip` for unused exports/files/deps.
- **Cadence:** per slice.

## 5. Placeholder residue

`TODO`, `FIXME`, `foo`/`bar`, `lorem`, `example.com`, dummy keys.

- **Detect:** `grep -rniE "TODO|FIXME|XXX|HACK|\bfoo\b|\bbar\b|lorem|example\.com|your-?api-?key" src`
- **Cadence:** every commit; hard zero before merge to `main`.

## 6. Type escape hatches

`any`, `as any`, `as unknown as`, bare `@ts-ignore`.

- **Detect:** `grep -rnE ": any|as any|as unknown as|@ts-ignore" src` — ESLint
  `no-explicit-any` enforces in CI. An `@ts-expect-error` survives only with a reason
  comment on the same line.
- **Cadence:** every commit.

## 7. Defensive noise

try/catch that only logs and rethrows · optional-chaining spam on values the types
guarantee · null checks the compiler already rules out. Errors are handled at the
boundary (`DataSource`, the error boundary) — not re-feared on every line.

- **Detect:** `grep -c "?\." src/features -r` — a file with dozens of hits on typed data
  is fear, not rigor. Manual read of every try/catch: it must _do_ something (fallback,
  toast, recovery) or it goes.
- **Cadence:** per slice.

## 8. Copy-paste duplication

Regenerated similar blocks instead of one extracted function — the signature of
no-memory generation.

- **Detect:** `npx jscpd src --threshold 3` (local, no service). Over 3% duplication
  fails the gate.
- **Cadence:** per slice.

## 9. Pattern inconsistency

Mixed idioms scream multiple unreviewed generations stitched together.

- **Detect:** `grep -rn "\.then(" src` — the codebase standard is async/await, zero hits.
  `grep -rn "fetch(" src --include=*.tsx` outside `data/` — components never fetch; the
  contract does.
- **Cadence:** per slice.

## 10. Theater tests

Tests with no assertions, snapshot-everything suites, or asserting a mock was called
instead of asserting behavior.

- **Detect:** `grep -rL "expect(" src --include=*.test.*` returns nothing · ESLint
  `vitest/expect-expect` in CI · read each test: it must fail if the feature breaks.
- **Cadence:** every slice.

## 11. Debug leftovers

- **Detect:** ESLint `no-console` (allow `console.error` in the error boundary only)
  - `no-debugger`, both CI-enforced.
- **Cadence:** every commit (automated).

## 12. Prose slop — README, docs, commits

Emoji headers · badge walls · marketing adjectives (`blazing`, `seamless`, `robust`,
`cutting-edge`, `leverage`, `effortless`) · "This project demonstrates…" openers.

- **Detect:** `grep -rniE "blazing|seamless|robust|cutting-edge|leverag|effortless|state-of-the-art|demonstrates" README.md docs/`
  · read-aloud test: if it sounds like a landing page, cut it. Commits: imperative mood,
  ≤72-char subject, no emoji, no essay bodies.
- **Cadence:** any touch to docs or a commit message.

---

## Automation — rules that make five checks free

The slop tier lives in `eslint.config.js`:

```jsonc
"@typescript-eslint/no-unused-vars": "error",   // check 4
"@typescript-eslint/no-explicit-any": "error",  // check 6
"no-console": ["error", { "allow": ["error"] }],// check 11
"no-debugger": "error",                         // check 11
"vitest/expect-expect": "error"                 // check 10 (test files)
```

## Slop sweep

`npm run slop` runs `scripts/slop-sweep.sh` (the greps above), then `knip`
(dead code / unused deps) and `jscpd` (duplication). It is part of `npm run verify`
and runs in CI on every push.

---

## Clean when

Every grep returns silence · knip and jscpd pass · every comment survives the delete
test · every name survives the stranger test · every test fails when the feature breaks ·
the README reads like an engineer wrote it for another engineer.
