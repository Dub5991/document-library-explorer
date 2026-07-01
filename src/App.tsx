// Root component: the document browser is the whole app surface for now.
import { DocumentBrowser } from './features/documents/ui/DocumentBrowser'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Document Library Explorer</h1>
        <p className={styles.subtitle}>
          Browse, search, filter, and update status across the catalog.
        </p>
      </header>
      <main>
        <DocumentBrowser />
      </main>
    </div>
  )
}

export default App
