// Root component. Real routing/layout lands in the BUILD station slices.
// For now: prove the data contract is wired end-to-end, fully offline.
import { useEffect, useState } from 'react'
import { dataSource } from './data/provider'

function App() {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    dataSource
      .listDocuments({ pageSize: 1 })
      .then((page) => setTotal(page.total))
  }, [])

  return (
    <div>
      <h1>Document Library Explorer</h1>
      <p>{total === null ? 'Loading…' : `${total} documents loaded`}</p>
    </div>
  )
}

export default App
