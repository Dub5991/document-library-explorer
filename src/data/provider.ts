// Single seam the app imports from. Becomes env-conditional once Supabase lands.
import type { DataSource } from './DataSource'
import { localDataSource } from './local/LocalDataSource'

export const dataSource: DataSource = localDataSource
