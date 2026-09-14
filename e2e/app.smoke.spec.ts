import { expect, test } from '@playwright/test'

test('o app carrega e mostra o esqueleto', async ({ page }) => {
  const erros: string[] = []
  page.on('pageerror', (e) => erros.push(e.message))

  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(erros).toEqual([])
})
