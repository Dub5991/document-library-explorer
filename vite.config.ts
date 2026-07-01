// Vite build config + Vitest test config (jsdom, jest-dom/jest-axe setup).
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The dev server otherwise watches the generated coverage/ report and fires a
  // full-page reload per file whenever `test:coverage` runs. Ignore it.
  server: {
    watch: {
      ignored: ['**/coverage/**'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    // Force the offline local source in tests regardless of a developer's .env,
    // so unit/component runs are hermetic and never depend on a live backend.
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/app/store.ts',
        'src/app/hooks.ts',
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
      ],
      thresholds: {
        statements: 85,
        branches: 70,
        functions: 85,
        lines: 85,
      },
    },
  },
})
