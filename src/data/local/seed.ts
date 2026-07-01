// Deterministic seed data: folders, tags, and 500+ documents. No backend required.
import type { Document } from '../../shared/types/document'
import type { Folder } from '../../shared/types/folder'
import type { Status } from '../../shared/types/status'
import type { Tag } from '../../shared/types/tag'
import { createRng } from './rng'

export const FOLDERS: Folder[] = [
  { id: 'f-contracts', name: 'Contracts', parentId: null },
  { id: 'f-invoices', name: 'Invoices', parentId: null },
  { id: 'f-policies', name: 'Policies', parentId: null },
  { id: 'f-reports', name: 'Reports', parentId: null },
  { id: 'f-manuals', name: 'Manuals', parentId: null },
  { id: 'f-memos', name: 'Memos', parentId: null },
  { id: 'f-hr', name: 'Human Resources', parentId: null },
  { id: 'f-legal', name: 'Legal', parentId: 'f-contracts' },
]

export const TAGS: Tag[] = [
  'vendor',
  'client',
  'internal',
  'compliance',
  'finance',
  'onboarding',
  'safety',
  'q1',
  'q2',
  'q3',
  'q4',
  'urgent',
  'confidential',
  'audit',
].map((name, i) => ({ id: `t-${i}`, name }))

const SUBJECTS = [
  'Vendor',
  'Client',
  'Employee',
  'Facilities',
  'IT',
  'Marketing',
  'Sales',
  'Product',
  'Finance',
  'Operations',
]

const DOC_TYPES = [
  'Contract',
  'Invoice',
  'Policy',
  'Report',
  'Manual',
  'Memo',
  'Agreement',
  'Handbook',
  'Summary',
  'Audit',
]

const MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]

const STATUS_WEIGHTS: Array<[Status, number]> = [
  ['draft', 0.15],
  ['review', 0.15],
  ['approved', 0.55],
  ['archived', 0.15],
]

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)]
}

function pickStatus(rng: () => number): Status {
  const roll = rng()
  let cumulative = 0
  for (const [status, weight] of STATUS_WEIGHTS) {
    cumulative += weight
    if (roll <= cumulative) return status
  }
  return 'approved'
}

function pastIsoDate(rng: () => number, daysAgoMax: number): string {
  const daysAgo = Math.floor(rng() * daysAgoMax)
  const ms = daysAgo * 24 * 60 * 60 * 1000
  return new Date(1735689600000 - ms).toISOString()
}

function generateDocuments(count: number, seed = 42): Document[] {
  const rng = createRng(seed)
  const documents: Document[] = []

  for (let i = 0; i < count; i++) {
    const subject = pick(rng, SUBJECTS)
    const docType = pick(rng, DOC_TYPES)
    const folder = pick(rng, FOLDERS)
    const tagCount = 1 + Math.floor(rng() * 3)
    const tagIds = Array.from(
      new Set(Array.from({ length: tagCount }, () => pick(rng, TAGS).id)),
    )
    const createdAt = pastIsoDate(rng, 730)
    const updatedAt = pastIsoDate(rng, 180)

    documents.push({
      id: `doc-${i}`,
      title: `${subject} ${docType} ${i + 1}`,
      folderId: folder.id,
      tagIds,
      status: pickStatus(rng),
      mimeType: pick(rng, MIME_TYPES),
      sizeBytes: 10_000 + Math.floor(rng() * 5_000_000),
      createdAt: createdAt < updatedAt ? createdAt : updatedAt,
      updatedAt: createdAt < updatedAt ? updatedAt : createdAt,
    })
  }

  return documents
}

export const SEED_DOCUMENTS = generateDocuments(520)
