// Single seam the app imports from: Supabase when both env keys are present, else offline local.
import type { DataSource } from './DataSource'
import { localDataSource } from './local/LocalDataSource'
import { hasSupabaseConfig } from './supabase/client'
import { supabaseDataSource } from './supabase/SupabaseDataSource'

export const dataSource: DataSource = hasSupabaseConfig()
  ? supabaseDataSource
  : localDataSource
