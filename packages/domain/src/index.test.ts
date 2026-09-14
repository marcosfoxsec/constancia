import { describe, expect, it } from 'vitest'

import * as dominio from './index.js'

describe('superfície pública do domínio', () => {
  it('exporta as funções que a interface consome', () => {
    const esperadas = [
      'calcularForca',
      'calcularSequencia',
      'dataCivil',
      'diaDaSemana',
      'diasEntre',
      'estaAgendado',
      'intervaloDeDias',
      'nivelDoDia',
      'nivelDoRegistro',
      'resultadoDoDia',
      'versaoVigente',
    ]
    for (const nome of esperadas) {
      expect(typeof dominio[nome as keyof typeof dominio]).toBe('function')
    }
  })

  it('a meia-vida da força é parte do contrato', () => {
    expect(dominio.MEIA_VIDA_EM_DIAS).toBe(30)
  })
})
