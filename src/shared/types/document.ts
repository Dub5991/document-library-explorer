// The core catalog entity. tagIds/folderId reference Tag/Folder by id, not by embedding.
import type { Status } from './status'

export type Document = {
  id: string
  title: string
  folderId: string | null
  tagIds: string[]
  status: Status
  mimeType: string
  sizeBytes: number
  createdAt: string
  updatedAt: string
}
