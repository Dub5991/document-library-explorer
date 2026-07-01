// Formats an ISO date string as a short human-readable date (e.g. "Jan 5, 2026").
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
