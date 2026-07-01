// Loads the folder and tag sets that populate the filter controls.
import { useEffect, useState } from 'react'
import { dataSource } from '../../../data/provider'
import type { Folder } from '../../../shared/types/folder'
import type { Tag } from '../../../shared/types/tag'

export function useFilterOptions(): { folders: Folder[]; tags: Tag[] } {
  const [folders, setFolders] = useState<Folder[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [nextFolders, nextTags] = await Promise.all([
          dataSource.listFolders(),
          dataSource.listTags(),
        ])
        if (cancelled) return
        setFolders(nextFolders)
        setTags(nextTags)
      } catch {
        // Filter options are non-critical: degrade to none so the list stays usable.
        if (cancelled) return
        setFolders([])
        setTags([])
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return { folders, tags }
}
