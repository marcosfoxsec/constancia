import { describe, expect, it } from 'vitest'

import { NOME_DO_PACOTE } from './index.js'

describe('esqueleto do domínio', () => {
  it('expõe o pacote', () => {
    expect(NOME_DO_PACOTE).toBe('@constancia/domain')
  })
})
