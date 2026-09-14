import { defineConfig, devices } from '@playwright/test'

// Fumaça de produção: roda contra a URL publicada (GitHub Pages).
// É este teste que protege o deploy — ver 05-deploy.yml.
const BASE_URL = process.env.BASE_URL

if (!BASE_URL) {
  throw new Error('test:e2e:prod exige a variável BASE_URL (ex.: https://usuario.github.io/repo/).')
}

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.prod\.spec\.ts/,
  forbidOnly: !!process.env.CI,
  retries: 2,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
