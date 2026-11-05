import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'

function spaFallback(): Plugin {
  return {
    name: 'spa-fallback',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist')
      const indexPath = resolve(dist, 'index.html')
      copyFileSync(indexPath, resolve(dist, '404.html'))
      copyFileSync(indexPath, resolve(dist, '200.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
