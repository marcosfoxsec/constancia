import { describe, expect, it } from 'vitest'

import { somarDias, type DataCivil, type DiaDaSemana } from './data.js'
import { calcularForca, MEIA_VIDA_EM_DIAS } from './forca.js'
import type { Registro, VersaoDoHabito } from './tipos.js'

const TODOS: readonly DiaDaSemana[] = [0, 1, 2, 3, 4, 5, 6]
const UTEIS: readonly DiaDaSemana[] = [0, 1, 2, 3, 4]
const SEGUNDA: DataCivil = '2026-09-14'

function versao(mudancas: Partial<VersaoDoHabito> = {}): VersaoDoHabito {
  return {
    id: 'v1',
    habitoId: 'h1',
    validoDesde: SEGUNDA,
    meta: 10,
    metaMinima: 1,
    diasDaSemana: TODOS,
    ...mudancas,
  }
}

function registros(padrao: string): Registro[] {
  const saida: Registro[] = []
  for (const [i, marca] of [...padrao].entries()) {
    if (marca === '.') continue
    saida.push({ habitoId: 'h1', data: somarDias(SEGUNDA, i), valor: marca === 'X' ? 10 : 1 })
  }
  return saida
}

function forcaDe(padrao: string, mudancas: Partial<VersaoDoHabito> = {}, diasExtras = 0) {
  return calcularForca({
    versoes: [versao(mudancas)],
    registros: registros(padrao),
    de: SEGUNDA,
    ate: somarDias(SEGUNDA, padrao.length - 1 + diasExtras),
  })
}

describe('calcularForca', () => {
  it('começa em zero', () => {
    expect(forcaDe('')).toBe(0)
    expect(forcaDe('....')).toBe(0)
  })

  it('sobe com o cumprimento e satura perto de 1', () => {
    expect(forcaDe('X'.repeat(365))).toBeGreaterThan(0.99)
    expect(forcaDe('X'.repeat(365))).toBeLessThanOrEqual(1)
  })

  it('cresce devagar: uma semana perfeita ainda não é um hábito firme', () => {
    expect(forcaDe('XXXXXXX')).toBeLessThan(0.2)
  })

  it('cai pela metade a cada meia-vida de abandono', () => {
    const cheia = forcaDe('X'.repeat(365))
    const depois = forcaDe('X'.repeat(365) + '.'.repeat(MEIA_VIDA_EM_DIAS + 1))
    expect(depois / cheia).toBeCloseTo(0.5, 2)
  })

  it('só a versão mínima sustenta metade da força', () => {
    expect(forcaDe('m'.repeat(365))).toBeCloseTo(0.5, 2)
  })

  it('dia de folga não mexe na força', () => {
    const ateSexta = forcaDe('XXXXX', { diasDaSemana: UTEIS })
    const ateDomingo = forcaDe('XXXXX', { diasDaSemana: UTEIS }, 2)
    expect(ateDomingo).toBe(ateSexta)
  })

  it('o dia de hoje, ainda aberto, não derruba a força', () => {
    const ateOntem = forcaDe('XXXXX')
    const incluindoHoje = forcaDe('XXXXX', {}, 1)
    expect(incluindoHoje).toBe(ateOntem)
  })

  it('ignora dias sem versão vigente', () => {
    const resultado = calcularForca({
      versoes: [versao({ validoDesde: '2026-09-16' })],
      registros: registros('XXX'),
      de: SEGUNDA,
      ate: somarDias(SEGUNDA, 2),
    })
    expect(resultado).toBeCloseTo(1 - Math.pow(0.5, 1 / MEIA_VIDA_EM_DIAS), 6)
  })
})
