// The one contract every data implementation (local, Supabase) sits behind.
import type { Document } from '../shared/types/document'
import type { Folder } from '../shared/types/folder'
import type { Status } from '../shared/types/status'
import type { Tag } from '../shared/types/tag'

export type Page<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type SortField = 'title' | 'status' | 'updatedAt'

export type DocumentQuery = {
  search?: string
  folderId?: string
  tagIds?: string[]
  status?: Status[]
  sort?: { field: SortField; direction: 'ascending' | 'descending' }
  page?: number
  pageSize?: number
}

export interface DataSource {
  listDocuments(query: DocumentQuery): Promise<Page<Document>>
  getDocument(id: string): Promise<Document>
  updateStatus(id: string, status: Status): Promise<Document>
  // Filter option sources — folders and tags the UI offers as filter controls.
  listFolders(): Promise<Folder[]>
  listTags(): Promise<Tag[]>
}
