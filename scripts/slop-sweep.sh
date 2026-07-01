#!/usr/bin/env bash
# Anti-slop grep gate: fails if any texture violation is found in src/. See docs/ANTI_SLOP.md.
set -euo pipefail

fail=0

check() {
  local label="$1"
  local pattern="$2"
  if grep -rniE "$pattern" src >/dev/null 2>&1; then
    echo "FAIL: $label"
    grep -rniE "$pattern" src || true
    fail=1
  else
    echo "ok: $label"
  fi
}

check "chatty comments" "in a real (app|application)|for simplicity|you (may|might|could) want|basically|obviously|note that"
check "placeholder residue" "\b(TODO|FIXME|XXX|HACK)\b|\bfoo\b|\bbar\b|lorem|example\.com|your-?api-?key"
check "type escape hatches" ": any|as any|as unknown as|@ts-ignore"
check "generic naming" "handleData|processItems|\btemp\b|\bdata2\b|\bresult[0-9]\b|myFunction"

# async/await is the standard — no raw .then() chains.
if grep -rn "\.then(" src >/dev/null 2>&1; then
  echo "FAIL: mixed async (.then)"
  grep -rn "\.then(" src || true
  fail=1
else
  echo "ok: async/await"
fi

# Every test file must assert.
if grep -rL "expect(" src --include=*.test.ts --include=*.test.tsx | grep . >/dev/null 2>&1; then
  echo "FAIL: theater test (no expect)"
  grep -rL "expect(" src --include=*.test.ts --include=*.test.tsx
  fail=1
else
  echo "ok: tests assert"
fi

exit $fail
