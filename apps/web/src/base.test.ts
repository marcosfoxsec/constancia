import { describe, expect, it } from 'vitest'

describe('esqueleto do app', () => {
  it('tem um ponto de entrada', async () => {
    const modulo = await import('./App.js')
    expect(typeof modulo.App).toBe('function')
  })
})
