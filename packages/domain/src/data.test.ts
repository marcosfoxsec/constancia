import { describe, expect, it } from 'vitest'

import {
  dataCivil,
  dataDoNumero,
  diaAnterior,
  diaDaSemana,
  diasEntre,
  ehDataCivil,
  intervaloDeDias,
  numeroDoDia,
  partesDaData,
  proximoDia,
  somarDias,
} from './data.js'

describe('partesDaData', () => {
  it('quebra uma data válida', () => {
    expect(partesDaData('2026-09-14')).toEqual({ ano: 2026, mes: 9, dia: 14 })
  })

  it.each(['2026-9-14', '14/09/2026', '2026-13-01', '2026-00-10', '2026-09-31', '2026-02-30', ''])(
    'recusa %s',
    (ruim) => {
      expect(() => partesDaData(ruim)).toThrow(/inválida/)
    },
  )

  it('aceita 29 de fevereiro só em ano bissexto', () => {
    expect(ehDataCivil('2024-02-29')).toBe(true)
    expect(ehDataCivil('2000-02-29')).toBe(true)
    expect(ehDataCivil('2100-02-29')).toBe(false)
    expect(ehDataCivil('2026-02-29')).toBe(false)
  })
})

describe('dataCivil', () => {
  it('preenche com zero à esquerda', () => {
    expect(dataCivil(2026, 1, 5)).toBe('2026-01-05')
  })

  it('recusa componentes impossíveis', () => {
    expect(() => dataCivil(2026, 2, 30)).toThrow(/inválida/)
  })
})

describe('numeroDoDia e dataDoNumero', () => {
  it('conta a partir de 1970-01-01', () => {
    expect(numeroDoDia('1970-01-01')).toBe(0)
    expect(numeroDoDia('1970-01-02')).toBe(1)
    expect(numeroDoDia('1969-12-31')).toBe(-1)
  })

  it('vai e volta', () => {
    for (const data of ['1969-07-20', '2000-02-29', '2024-02-29', '2026-09-14', '2100-03-01']) {
      expect(dataDoNumero(numeroDoDia(data))).toBe(data)
    }
  })
})

describe('somarDias', () => {
  it('atravessa a virada do mês', () => {
    expect(proximoDia('2026-01-31')).toBe('2026-02-01')
  })

  it('atravessa a virada do ano', () => {
    expect(proximoDia('2026-12-31')).toBe('2027-01-01')
    expect(diaAnterior('2027-01-01')).toBe('2026-12-31')
  })

  it('respeita o ano bissexto', () => {
    expect(proximoDia('2024-02-28')).toBe('2024-02-29')
    expect(proximoDia('2026-02-28')).toBe('2026-03-01')
  })

  it('aceita salto negativo', () => {
    expect(somarDias('2026-09-14', -14)).toBe('2026-08-31')
  })
})

describe('diasEntre', () => {
  it('conta para a frente e para trás', () => {
    expect(diasEntre('2026-09-01', '2026-09-14')).toBe(13)
    expect(diasEntre('2026-09-14', '2026-09-01')).toBe(-13)
    expect(diasEntre('2026-09-14', '2026-09-14')).toBe(0)
  })
})

describe('intervaloDeDias', () => {
  it('inclui as duas pontas', () => {
    expect(intervaloDeDias('2026-09-12', '2026-09-14')).toEqual([
      '2026-09-12',
      '2026-09-13',
      '2026-09-14',
    ])
  })

  it('é vazio quando o fim vem antes do começo', () => {
    expect(intervaloDeDias('2026-09-14', '2026-09-12')).toEqual([])
  })
})

describe('diaDaSemana', () => {
  it('usa 0 para segunda e 6 para domingo', () => {
    expect(diaDaSemana('2026-09-14')).toBe(0)
    expect(diaDaSemana('2026-09-18')).toBe(4)
    expect(diaDaSemana('2026-09-19')).toBe(5)
    expect(diaDaSemana('2026-09-20')).toBe(6)
  })

  it('funciona antes da época', () => {
    expect(diaDaSemana('1970-01-01')).toBe(3)
    expect(diaDaSemana('1969-12-31')).toBe(2)
  })
})
