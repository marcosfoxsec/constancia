import { describe, expect, it } from 'vitest'

import { estaAgendado, porData, resultadoDoDia, versaoVigente } from './agenda.js'
import type { DiaDaSemana } from './data.js'
import type { VersaoDoHabito } from './tipos.js'

const TODOS: readonly DiaDaSemana[] = [0, 1, 2, 3, 4, 5, 6]

function versao(mudancas: Partial<VersaoDoHabito> = {}): VersaoDoHabito {
  return {
    id: 'v1',
    habitoId: 'h1',
    validoDesde: '2026-01-01',
    meta: 10,
    metaMinima: 1,
    diasDaSemana: TODOS,
    ...mudancas,
  }
}

describe('versaoVigente', () => {
  const v1 = versao({ id: 'v1', validoDesde: '2026-01-01', meta: 10 })
  const v2 = versao({ id: 'v2', validoDesde: '2026-03-01', meta: 20 })

  it('escolhe a de maior validoDesde até a data', () => {
    expect(versaoVigente([v1, v2], '2026-02-28')?.id).toBe('v1')
    expect(versaoVigente([v1, v2], '2026-03-01')?.id).toBe('v2')
    expect(versaoVigente([v1, v2], '2026-12-31')?.id).toBe('v2')
  })

  it('não depende da ordem da lista', () => {
    expect(versaoVigente([v2, v1], '2026-02-28')?.id).toBe('v1')
  })

  it('devolve undefined antes de o hábito existir', () => {
    expect(versaoVigente([v1, v2], '2025-12-31')).toBeUndefined()
    expect(versaoVigente([], '2026-01-01')).toBeUndefined()
  })
})

describe('estaAgendado', () => {
  it('cobra só nos dias da agenda', () => {
    const seg_qua_sex = versao({ diasDaSemana: [0, 2, 4] })
    expect(estaAgendado(seg_qua_sex, '2026-09-14')).toBe(true)
    expect(estaAgendado(seg_qua_sex, '2026-09-15')).toBe(false)
    expect(estaAgendado(seg_qua_sex, '2026-09-16')).toBe(true)
  })

  it('agenda vazia não cobra nenhum dia', () => {
    expect(estaAgendado(versao({ diasDaSemana: [] }), '2026-09-14')).toBe(false)
  })
})

describe('resultadoDoDia', () => {
  const v = versao({ meta: 10, metaMinima: 1, diasDaSemana: [0, 1, 2, 3, 4] })

  it('dia fora da agenda é folga', () => {
    expect(resultadoDoDia(v, '2026-09-19', 0)).toBe('folga')
  })

  it('bateu a meta, cumprido', () => {
    expect(resultadoDoDia(v, '2026-09-14', 10)).toBe('cumprido')
    expect(resultadoDoDia(v, '2026-09-14', 42)).toBe('cumprido')
  })

  it('bateu só o mínimo', () => {
    expect(resultadoDoDia(v, '2026-09-14', 1)).toBe('minimo')
    expect(resultadoDoDia(v, '2026-09-14', 9)).toBe('minimo')
  })

  it('sem registro e zero são a mesma coisa: aberto', () => {
    expect(resultadoDoDia(v, '2026-09-14', undefined)).toBe('aberto')
    expect(resultadoDoDia(v, '2026-09-14', 0)).toBe('aberto')
  })

  it('hábito de check usa meta 1', () => {
    const check = versao({ meta: 1, metaMinima: 1 })
    expect(resultadoDoDia(check, '2026-09-14', 1)).toBe('cumprido')
    expect(resultadoDoDia(check, '2026-09-14', 0)).toBe('aberto')
  })
})

describe('porData', () => {
  it('indexa pelo dia', () => {
    const mapa = porData([
      { habitoId: 'h1', data: '2026-09-13', valor: 3 },
      { habitoId: 'h1', data: '2026-09-14', valor: 10 },
    ])
    expect(mapa.get('2026-09-14')).toBe(10)
    expect(mapa.get('2026-09-12')).toBeUndefined()
  })

  it('a última escrita do mesmo dia vence', () => {
    const mapa = porData([
      { habitoId: 'h1', data: '2026-09-14', valor: 3 },
      { habitoId: 'h1', data: '2026-09-14', valor: 7 },
    ])
    expect(mapa.get('2026-09-14')).toBe(7)
  })
})
