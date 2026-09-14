/**
 * Sequência com tolerância.
 *
 * A regra é "nunca falhar duas vezes" (Clear): uma falta é acidente, duas
 * seguidas são o começo de um novo padrão. Por isso a sequência só quebra na
 * segunda falta consecutiva — e "consecutiva" conta apenas dias agendados, já
 * que um dia de folga não é falta.
 *
 * O dia de hoje, enquanto ainda está aberto, nunca conta como falta. O dia não
 * acabou.
 */

import { intervaloDeDias, type DataCivil } from './data.js'
import { porData, resultadoDoDia, versaoVigente } from './agenda.js'
import type { Registro, VersaoDoHabito } from './tipos.js'

export interface Sequencia {
  /** Dias cumpridos na sequência viva. Uma falta isolada não zera nem soma. */
  readonly atual: number
  /** A maior sequência já alcançada no período avaliado. */
  readonly melhor: number
  /** Quantas faltas houve no período. */
  readonly faltas: number
  /**
   * O último dia agendado antes de hoje ficou aberto. É o dia do resgate: hoje
   * decide se a sequência continua. Nenhum texto do app culpa ninguém por isso.
   */
  readonly emResgate: boolean
}

export interface EntradaDaSequencia {
  readonly versoes: readonly VersaoDoHabito[]
  readonly registros: readonly Registro[]
  /** Primeiro dia a avaliar. Normalmente a criação do hábito. */
  readonly de: DataCivil
  /** Último dia a avaliar, normalmente hoje. */
  readonly ate: DataCivil
}

export function calcularSequencia(entrada: EntradaDaSequencia): Sequencia {
  const valores = porData(entrada.registros)
  let atual = 0
  let melhor = 0
  let faltas = 0
  let faltaPendente = false

  for (const dia of intervaloDeDias(entrada.de, entrada.ate)) {
    const versao = versaoVigente(entrada.versoes, dia)
    if (!versao) continue

    const resultado = resultadoDoDia(versao, dia, valores.get(dia))
    if (resultado === 'folga') continue

    if (resultado === 'cumprido' || resultado === 'minimo') {
      atual += 1
      faltaPendente = false
      if (atual > melhor) melhor = atual
      continue
    }

    // Hoje ainda está aberto: o dia não acabou, então não é falta.
    if (dia === entrada.ate) break

    faltas += 1
    if (faltaPendente) {
      atual = 0
      faltaPendente = false
    } else {
      faltaPendente = true
    }
  }

  return { atual, melhor, faltas, emResgate: faltaPendente }
}
