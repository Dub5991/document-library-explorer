// Vite build config + Vitest test config (jsdom, jest-dom/jest-axe setup).
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
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
