// Supabase-backed DataSource: server-side filter/sort/paginate, rows mapped to domain types.
import type { DataSource, DocumentQuery, Page, SortField } from '../DataSource'
import type { Document } from '../../shared/types/document'
import type { Folder } from '../../shared/types/folder'
import type { Status } from '../../shared/types/status'
import type { Tag } from '../../shared/types/tag'
import { getSupabaseClient } from './client'

type DocumentRow = {
  id: string
  title: string
  folder_id: string | null
  tag_ids: string[]
  status: Status
  mime_type: string
  size_bytes: number
  created_at: string
  updated_at: string
}

type FolderRow = {
  id: string
  name: string
  parent_id: string | null
}

type TagRow = {
  id: string
  name: string
}

// updatedAt is the only field whose column name diverges from a naive camel->snake.
const SORT_COLUMN: Record<SortField, string> = {
  title: 'title',
  status: 'status',
  updatedAt: 'updated_at',
}

function toDocument(row: DocumentRow): Document {
  return {
    id: row.id,
    title: row.title,
    folderId: row.folder_id,
    tagIds: row.tag_ids,
    status: row.status,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toFolder(row: FolderRow): Folder {
  return { id: row.id, name: row.name, parentId: row.parent_id }
}

function toTag(row: TagRow): Tag {
  return { id: row.id, name: row.name }
}

export const supabaseDataSource: DataSource = {
  async listDocuments(query: DocumentQuery): Promise<Page<Document>> {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 25

    let builder = getSupabaseClient()
      .from('documents')
      .select('*', { count: 'exact' })

    if (query.search) builder = builder.ilike('title', `%${query.search}%`)
    if (query.folderId) builder = builder.eq('folder_id', query.folderId)
    if (query.status && query.status.length > 0) {
      builder = builder.in('status', query.status)
    }
    if (query.tagIds && query.tagIds.length > 0) {
      builder = builder.overlaps('tag_ids', query.tagIds)
    }

    if (query.sort) {
      builder = builder.order(SORT_COLUMN[query.sort.field], {
        ascending: query.sort.direction === 'ascending',
      })
    } else {
      // Stable ordering so range() pagination is deterministic across pages.
      builder = builder.order('id', { ascending: true })
    }

    const start = (page - 1) * pageSize
    const { data, count, error } = await builder.range(
      start,
      start + pageSize - 1,
    )
    if (error) throw new Error(error.message)

    return {
      items: (data ?? []).map(toDocument),
      total: count ?? 0,
      page,
      pageSize,
    }
  },

  async getDocument(id: string): Promise<Document> {
    const { data, error } = await getSupabaseClient()
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) throw new Error(`Document not found: ${id}`)
    return toDocument(data)
  },

  async updateStatus(id: string, status: Status): Promise<Document> {
    const { data, error } = await getSupabaseClient()
      .from('documents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) throw new Error(`Document not found: ${id}`)
    return toDocument(data)
  },

  async listFolders(): Promise<Folder[]> {
    const { data, error } = await getSupabaseClient()
      .from('folders')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map(toFolder)
  },

  async listTags(): Promise<Tag[]> {
    const { data, error } = await getSupabaseClient()
      .from('tags')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map(toTag)
  },
}
