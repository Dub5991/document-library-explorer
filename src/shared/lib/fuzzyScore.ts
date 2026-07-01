// Subsequence fuzzy matcher: returns a relevance score, or null when the query
// is not a subsequence of the text. Higher scores rank matches nearer the top.
export function fuzzyScore(query: string, text: string): number | null {
  const needle = query.trim().toLowerCase()
  if (!needle) return null

  const haystack = text.toLowerCase()
  let score = 0
  let queryIndex = 0
  let previousMatch = -2

  for (let i = 0; i < haystack.length && queryIndex < needle.length; i++) {
    if (haystack[i] !== needle[queryIndex]) continue

    let charScore = 1
    if (previousMatch === i - 1) charScore += 2 // consecutive run
    if (i === 0 || haystack[i - 1] === ' ') charScore += 3 // start of a word
    score += charScore
    previousMatch = i
    queryIndex++
  }

  return queryIndex === needle.length ? score : null
}
