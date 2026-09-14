import { describe, expect, it } from 'vitest'

import { somarDias, type DataCivil, type DiaDaSemana } from './data.js'
import { calcularSequencia } from './sequencia.js'
import type { Registro, VersaoDoHabito } from './tipos.js'

const TODOS: readonly DiaDaSemana[] = [0, 1, 2, 3, 4, 5, 6]
const UTEIS: readonly DiaDaSemana[] = [0, 1, 2, 3, 4]
// 14 de setembro de 2026 é uma segunda-feira.
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

/** Um caractere por dia a partir de `de`: X cumpriu, m ficou no mínimo, . ficou aberto. */
function registros(de: DataCivil, padrao: string): Registro[] {
  const saida: Registro[] = []
  for (const [i, marca] of [...padrao].entries()) {
    if (marca === '.') continue
    saida.push({ habitoId: 'h1', data: somarDias(de, i), valor: marca === 'X' ? 10 : 1 })
  }
  return saida
}

function sequenciaDe(padrao: string, mudancas: Partial<VersaoDoHabito> = {}, diasExtras = 0) {
  return calcularSequencia({
    versoes: [versao(mudancas)],
    registros: registros(SEGUNDA, padrao),
    de: SEGUNDA,
    ate: somarDias(SEGUNDA, padrao.length - 1 + diasExtras),
  })
}

describe('calcularSequencia', () => {
  it('conta os dias cumpridos seguidos', () => {
    expect(sequenciaDe('XXXXX')).toEqual({ atual: 5, melhor: 5, faltas: 0, emResgate: false })
  })

  it('uma falta isolada não zera a sequência', () => {
    // A regra "nunca falhar duas vezes": uma falta é acidente.
    expect(sequenciaDe('XX.XX')).toEqual({ atual: 4, melhor: 4, faltas: 1, emResgate: false })
  })

  it('duas faltas seguidas quebram', () => {
    expect(sequenciaDe('XX..XX')).toEqual({ atual: 2, melhor: 2, faltas: 2, emResgate: false })
  })

  it('guarda a melhor sequência mesmo depois da quebra', () => {
    expect(sequenciaDe('XXXX..X')).toEqual({ atual: 1, melhor: 4, faltas: 2, emResgate: false })
  })

  it('a versão mínima mantém a sequência viva', () => {
    expect(sequenciaDe('XmX')).toEqual({ atual: 3, melhor: 3, faltas: 0, emResgate: false })
  })

  it('folga não é falta, mas dois dias agendados abertos seguem consecutivos', () => {
    // Sexta e a segunda seguinte ficam abertas, com sábado e domingo no meio.
    expect(sequenciaDe('XXXX....X', { diasDaSemana: UTEIS })).toEqual({
      atual: 1,
      melhor: 4,
      faltas: 2,
      emResgate: false,
    })
  })

  it('o dia de hoje, ainda aberto, não conta como falta', () => {
    expect(sequenciaDe('XXX', {}, 1)).toEqual({ atual: 3, melhor: 3, faltas: 0, emResgate: false })
  })

  it('marca o resgate quando o último dia agendado ficou aberto', () => {
    expect(sequenciaDe('XXX.', {}, 1)).toEqual({ atual: 3, melhor: 3, faltas: 1, emResgate: true })
  })

  it('ignora os dias anteriores à primeira versão', () => {
    const resultado = calcularSequencia({
      versoes: [versao({ validoDesde: '2026-09-16' })],
      registros: registros(SEGUNDA, 'XXX'),
      de: SEGUNDA,
      ate: somarDias(SEGUNDA, 2),
    })
    expect(resultado.atual).toBe(1)
  })

  it('período vazio devolve zeros', () => {
    expect(
      calcularSequencia({ versoes: [versao()], registros: [], de: SEGUNDA, ate: '2026-09-13' }),
    ).toEqual({ atual: 0, melhor: 0, faltas: 0, emResgate: false })
  })
})
