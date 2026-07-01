// Controlled filter panel: renders search/folder/status/tag controls; owns no state itself.
import { Button } from '../../../shared/ui/Button/Button'
import { Field } from '../../../shared/ui/Field/Field'
import { Select } from '../../../shared/ui/Select/Select'
import type { Folder } from '../../../shared/types/folder'
import type { Status } from '../../../shared/types/status'
import { STATUS_LABEL } from '../../../shared/types/status'
import type { Tag } from '../../../shared/types/tag'
import styles from './DocumentFilters.module.css'

const STATUS_ORDER: Status[] = ['draft', 'review', 'approved', 'archived']

const ALL_FOLDERS_VALUE = ''

type DocumentFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  folders: Folder[]
  folderId: string | null
  onFolderChange: (id: string | null) => void
  selectedStatuses: Status[]
  onToggleStatus: (status: Status) => void
  tags: Tag[]
  selectedTagIds: string[]
  onToggleTag: (id: string) => void
  onReset: () => void
}

export function DocumentFilters({
  search,
  onSearchChange,
  folders,
  folderId,
  onFolderChange,
  selectedStatuses,
  onToggleStatus,
  tags,
  selectedTagIds,
  onToggleTag,
  onReset,
}: DocumentFiltersProps) {
  const folderOptions = [
    { value: ALL_FOLDERS_VALUE, label: 'All folders' },
    ...folders.map((folder) => ({ value: folder.id, label: folder.name })),
  ]

  return (
    <div className={styles.filters}>
      <Field
        label="Search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <Select
        label="Folder"
        value={folderId ?? ALL_FOLDERS_VALUE}
        onChange={(value) =>
          onFolderChange(value === ALL_FOLDERS_VALUE ? null : value)
        }
        options={folderOptions}
      />

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Status</legend>
        {STATUS_ORDER.map((status) => (
          <label key={status} className={styles.option}>
            <input
              type="checkbox"
              checked={selectedStatuses.includes(status)}
              onChange={() => onToggleStatus(status)}
            />
            {STATUS_LABEL[status]}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Tags</legend>
        {tags.map((tag) => (
          <label key={tag.id} className={styles.option}>
            <input
              type="checkbox"
              checked={selectedTagIds.includes(tag.id)}
              onChange={() => onToggleTag(tag.id)}
            />
            {tag.name}
          </label>
        ))}
      </fieldset>

      <Button onClick={onReset}>Reset</Button>
    </div>
  )
}
