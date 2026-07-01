import { fuzzyScore } from './fuzzyScore'

test('returns null when the query is empty', () => {
  expect(fuzzyScore('', 'Vendor Contract')).toBeNull()
})

test('returns null when the query is not a subsequence', () => {
  expect(fuzzyScore('xyz', 'Vendor Contract')).toBeNull()
})

test('matches a subsequence spanning word boundaries', () => {
  expect(fuzzyScore('vcon', 'Vendor Contract')).not.toBeNull()
})

test('is case-insensitive', () => {
  expect(fuzzyScore('VENDOR', 'vendor contract')).not.toBeNull()
})

test('ranks a prefix match above a scattered match', () => {
  const prefix = fuzzyScore('ven', 'Vendor Contract')!
  const scattered = fuzzyScore('vnr', 'Vendor Contract')!
  expect(prefix).toBeGreaterThan(scattered)
})

test('ranks a start-of-word match above a mid-word match', () => {
  const wordStart = fuzzyScore('con', 'Vendor Contract')!
  const midWord = fuzzyScore('end', 'Vendor Contract')!
  expect(wordStart).toBeGreaterThan(midWord)
})
