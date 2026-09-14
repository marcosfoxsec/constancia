import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'domain',
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/index.ts'],
      // O portão do CLAUDE.md: 90% ou mais neste pacote.
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
})
