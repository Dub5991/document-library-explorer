// App entry: mounts React, loads tokens before the reset/app styles.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/tokens.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
