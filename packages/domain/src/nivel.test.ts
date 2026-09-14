import { describe, expect, it } from 'vitest'

import { nivelDoDia, nivelDoRegistro } from './nivel.js'
import type { ResultadoDoDia, VersaoDoHabito } from './tipos.js'

const versao: VersaoDoHabito = {
  id: 'v1',
  habitoId: 'h1',
  validoDesde: '2026-01-01',
  meta: 10,
  metaMinima: 1,
  diasDaSemana: [0, 1, 2, 3, 4, 5, 6],
}

const c: ResultadoDoDia = 'cumprido'
const m: ResultadoDoDia = 'minimo'
const a: ResultadoDoDia = 'aberto'
const f: ResultadoDoDia = 'folga'

describe('nivelDoDia', () => {
  it('dia sem nada agendado é zero', () => {
    expect(nivelDoDia([])).toBe(0)
    expect(nivelDoDia([f, f])).toBe(0)
  })

  it('dia agendado e todo aberto é zero', () => {
    expect(nivelDoDia([a, a, a, a])).toBe(0)
  })

  it('com quatro hábitos, o nível é quantos foram cumpridos', () => {
    expect(nivelDoDia([c, a, a, a])).toBe(1)
    expect(nivelDoDia([c, c, a, a])).toBe(2)
    expect(nivelDoDia([c, c, c, a])).toBe(3)
    expect(nivelDoDia([c, c, c, c])).toBe(4)
  })

  it('folga não conta no denominador', () => {
    expect(nivelDoDia([c, c, f, f])).toBe(4)
  })

  it('a proporção vale para qualquer quantidade de hábitos', () => {
    expect(nivelDoDia([c, a])).toBe(2)
    expect(nivelDoDia([c, a, a])).toBe(2)
    expect(nivelDoDia([c, c, c, c, c, c, c])).toBe(4)
  })

  it('a versão mínima vale meio ponto', () => {
    expect(nivelDoDia([m, m, a, a])).toBe(1)
    expect(nivelDoDia([m, a])).toBe(1)
  })
})

describe('nivelDoRegistro', () => {
  it('dia sem valor é zero', () => {
    expect(nivelDoRegistro(versao, undefined)).toBe(0)
    expect(nivelDoRegistro(versao, 0)).toBe(0)
  })

  it('bater a meta é o único caminho para o quatro', () => {
    expect(nivelDoRegistro(versao, 10)).toBe(4)
    expect(nivelDoRegistro(versao, 99)).toBe(4)
    expect(nivelDoRegistro(versao, 9)).toBe(3)
  })

  it('progresso parcial fica entre 1 e 3', () => {
    expect(nivelDoRegistro(versao, 1)).toBe(1)
    expect(nivelDoRegistro(versao, 4)).toBe(2)
    expect(nivelDoRegistro(versao, 6)).toBe(3)
  })

  it('meta zero conta como cumprido com qualquer valor', () => {
    expect(nivelDoRegistro({ ...versao, meta: 0 }, 1)).toBe(4)
  })
})
