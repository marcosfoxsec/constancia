/**
 * Propriedades do domínio, com fast-check.
 *
 * Exemplos provam casos; propriedades provam invariantes. As três primeiras
 * estão no bloco 4 do PROMPT-MESTRE: força entre 0 e 1, sequência nunca
 * negativa, e mudar a meta de hoje não altera o resultado de dias passados.
 */

import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { diaAnterior, somarDias, type DataCivil, type DiaDaSemana } from './data.js'
import { resultadoDoDia, versaoVigente } from './agenda.js'
import { calcularForca } from './forca.js'
import { nivelDoDia } from './nivel.js'
import { calcularSequencia } from './sequencia.js'
import type { Registro, ResultadoDoDia, VersaoDoHabito } from './tipos.js'

const DE: DataCivil = '2026-01-01'

interface Historico {
  readonly versoes: readonly VersaoDoHabito[]
  readonly registros: readonly Registro[]
  readonly de: DataCivil
  readonly ate: DataCivil
}

const arbHistorico: fc.Arbitrary<Historico> = fc
  .tuple(
    fc.array(fc.integer({ min: 0, max: 12 }), { minLength: 1, maxLength: 120 }),
    fc.integer({ min: 1, max: 10 }),
    fc.uniqueArray(fc.integer({ min: 0, max: 6 }), { minLength: 0, maxLength: 7 }),
  )
  .map(([valores, meta, dias]) => ({
    versoes: [
      {
        id: 'v1',
        habitoId: 'h1',
        validoDesde: DE,
        meta,
        metaMinima: 1,
        diasDaSemana: dias as DiaDaSemana[],
      },
    ],
    registros: valores.map((valor, i) => ({ habitoId: 'h1', data: somarDias(DE, i), valor })),
    de: DE,
    ate: somarDias(DE, valores.length - 1),
  }))

const arbResultado: fc.Arbitrary<ResultadoDoDia> = fc.constantFrom(
  'cumprido',
  'minimo',
  'aberto',
  'folga',
)

describe('propriedades', () => {
  it('a força fica sempre entre 0 e 1', () => {
    fc.assert(
      fc.property(arbHistorico, (historico) => {
        const forca = calcularForca(historico)
        expect(forca).toBeGreaterThanOrEqual(0)
        expect(forca).toBeLessThanOrEqual(1)
      }),
    )
  })

  it('a sequência nunca é negativa e a melhor nunca é menor que a atual', () => {
    fc.assert(
      fc.property(arbHistorico, (historico) => {
        const { atual, melhor, faltas } = calcularSequencia(historico)
        expect(atual).toBeGreaterThanOrEqual(0)
        expect(faltas).toBeGreaterThanOrEqual(0)
        expect(melhor).toBeGreaterThanOrEqual(atual)
      }),
    )
  })

  it('mudar a meta de hoje não altera o resultado de dias passados', () => {
    // A garantia do ADR-002, verificada em cima do domínio inteiro.
    fc.assert(
      fc.property(arbHistorico, fc.integer({ min: 1, max: 40 }), (historico, novaMeta) => {
        const hoje = historico.ate
        const ontem = diaAnterior(hoje)
        const passado = { ...historico, ate: ontem }

        const comMetaNova = {
          ...passado,
          versoes: [
            ...historico.versoes,
            { ...historico.versoes[0]!, id: 'v2', validoDesde: hoje, meta: novaMeta },
          ],
        }

        expect(calcularSequencia(comMetaNova)).toEqual(calcularSequencia(passado))
        expect(calcularForca(comMetaNova)).toBe(calcularForca(passado))

        for (const registro of historico.registros) {
          if (registro.data >= hoje) continue
          const antes = versaoVigente(passado.versoes, registro.data)!
          const depois = versaoVigente(comMetaNova.versoes, registro.data)!
          expect(resultadoDoDia(depois, registro.data, registro.valor)).toBe(
            resultadoDoDia(antes, registro.data, registro.valor),
          )
        }
      }),
    )
  })

  it('o nível do dia fica sempre entre 0 e 4', () => {
    fc.assert(
      fc.property(fc.array(arbResultado, { maxLength: 20 }), (resultados) => {
        const nivel = nivelDoDia(resultados)
        expect(nivel).toBeGreaterThanOrEqual(0)
        expect(nivel).toBeLessThanOrEqual(4)
        expect(Number.isInteger(nivel)).toBe(true)
      }),
    )
  })

  it('um dia sem nenhum hábito cumprido nunca é ladrilho assentado', () => {
    fc.assert(
      fc.property(fc.array(fc.constantFrom('aberto' as const, 'folga' as const)), (resultados) => {
        expect(nivelDoDia(resultados)).toBe(0)
      }),
    )
  })
})
