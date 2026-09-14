import { expect, test } from '@playwright/test'

// Esqueleto. O teste completo (manifest válido, service worker registrado,
// tela Hoje renderizando) entra no bloco 6 do PROMPT-MESTRE.
test('a URL publicada responde e renderiza', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
