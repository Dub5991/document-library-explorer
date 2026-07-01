// App entry: mounts React, loads fonts + tokens before the reset/app styles.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
// Self-hosted variable fonts: Fraunces (display), Geist (UI), Geist Mono (tabular).
import '@fontsource-variable/fraunces/index.css'
import '@fontsource-variable/geist/index.css'
import '@fontsource-variable/geist-mono/index.css'
import './shared/tokens.css'
import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { ToastProvider } from './app/toast/ToastProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </StrictMode>,
)
