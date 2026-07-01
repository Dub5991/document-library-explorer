// Root component. Real routing/layout lands in later BUILD station slices.
import { DocumentTable } from './features/documents/ui/DocumentTable'

function App() {
  return (
    <div>
      <h1>Document Library Explorer</h1>
      <DocumentTable />
    </div>
  )
}

export default App
