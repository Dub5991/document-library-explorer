// Fuzzy search combobox: filters the list as you type and offers jump-to suggestions.
import { useId, useState, type KeyboardEvent } from 'react'
import { useDocumentSuggestions } from '../hooks/useDocumentSuggestions'
import { Badge } from '../../../shared/ui/Badge/Badge'
import styles from './DocumentSearch.module.css'

type DocumentSearchProps = {
  value: string
  onChange: (value: string) => void
  onOpen: (id: string) => void
}

export function DocumentSearch({
  value,
  onChange,
  onOpen,
}: DocumentSearchProps) {
  const suggestions = useDocumentSuggestions(value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputId = useId()
  const listboxId = useId()

  const showList = open && suggestions.length > 0

  function selectAt(index: number) {
    const doc = suggestions[index]
    if (!doc) return
    onOpen(doc.id)
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      selectAt(activeIndex)
    } else if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div className={styles.combobox}>
      <label htmlFor={inputId} className={styles.label}>
        Search
      </label>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        className={styles.input}
        value={value}
        placeholder="Search documents by title…"
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        // Selection uses onMouseDown + preventDefault, so a real blur means focus left.
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul id={listboxId} role="listbox" className={styles.listbox}>
          {suggestions.map((doc, index) => (
            <li
              key={doc.id}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={
                index === activeIndex ? styles.optionActive : styles.option
              }
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                selectAt(index)
              }}
            >
              <span className={styles.optionTitle}>{doc.title}</span>
              <Badge status={doc.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
