// Lazy Supabase client: never constructed at import time, so a keyless machine stays offline.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function hasSupabaseConfig(): boolean {
  return Boolean(url) && Boolean(anonKey)
}

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!hasSupabaseConfig()) {
    throw new Error(
      'Supabase config missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
    )
  }
  // Single instance reused across queries; the config check above guarantees the values are set.
  client ??= createClient(url, anonKey)
  return client
}
