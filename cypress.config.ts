// Cypress e2e config: dev server base URL for `npm run dev`.
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents() {},
  },
})
