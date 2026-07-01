// Proves the seed shape: 500+ rows, every reference (folder/tag/status) resolves.
import { FOLDERS, SEED_DOCUMENTS, TAGS } from './seed'

const FOLDER_IDS = new Set(FOLDERS.map((f) => f.id))
const TAG_IDS = new Set(TAGS.map((t) => t.id))
const VALID_STATUSES = new Set(['draft', 'review', 'approved', 'archived'])

test('generates at least 500 documents', () => {
  expect(SEED_DOCUMENTS.length).toBeGreaterThanOrEqual(500)
})

test('every document references a real folder, real tags, and a valid status', () => {
  for (const doc of SEED_DOCUMENTS) {
    expect(doc.folderId === null || FOLDER_IDS.has(doc.folderId)).toBe(true)
    for (const tagId of doc.tagIds) {
      expect(TAG_IDS.has(tagId)).toBe(true)
    }
    expect(VALID_STATUSES.has(doc.status)).toBe(true)
    expect(new Date(doc.createdAt).getTime()).toBeLessThanOrEqual(
      new Date(doc.updatedAt).getTime(),
    )
  }
})

test('document ids are unique', () => {
  const ids = new Set(SEED_DOCUMENTS.map((d) => d.id))
  expect(ids.size).toBe(SEED_DOCUMENTS.length)
})
