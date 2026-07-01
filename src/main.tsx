// App entry: mounts React, loads tokens before the reset/app styles.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
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
