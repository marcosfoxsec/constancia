/**
 * Força do hábito: uma média móvel exponencial do cumprimento, entre 0 e 1.
 *
 * A sequência responde "há quantos dias você não falha". Ela é frágil e não
 * distingue quem cumpre 90% dos dias de quem cumpre 40%. A força responde
 * "quão firme está o hábito agora", e é o que sustenta o automonitoramento
 * (Harkin et al., 2016) sem ansiedade de sequência.
 *
 * A ideia de existir uma métrica de força além da sequência é pública; a
 * implementação abaixo foi escrita a partir desta especificação. Ver a regra de
 * licença no `CLAUDE.md`.
 *
 * Cada dia agendado entra com 1 se foi cumprido, 0,5 se ficou na versão mínima
 * e 0 se ficou aberto. Dias de folga não entram: não fazer um hábito num dia em
 * que ele não é cobrado não enfraquece nada. O dia de hoje, enquanto aberto,
 * também não entra — o dia não acabou.
 */

import { intervaloDeDias, type DataCivil } from './data.js'
import { porData, resultadoDoDia, versaoVigente } from './agenda.js'
import type { Registro, VersaoDoHabito } from './tipos.js'

/** Em quantos dias agendados o peso de um dia cai pela metade. */
export const MEIA_VIDA_EM_DIAS = 30

const ALFA = 1 - Math.pow(0.5, 1 / MEIA_VIDA_EM_DIAS)

const PESO = { cumprido: 1, minimo: 0.5, aberto: 0 } as const

export interface EntradaDaForca {
  readonly versoes: readonly VersaoDoHabito[]
  readonly registros: readonly Registro[]
  readonly de: DataCivil
  readonly ate: DataCivil
}

/** A força do hábito no fim do período, sempre entre 0 e 1. */
export function calcularForca(entrada: EntradaDaForca): number {
  const valores = porData(entrada.registros)
  let forca = 0

  for (const dia of intervaloDeDias(entrada.de, entrada.ate)) {
    const versao = versaoVigente(entrada.versoes, dia)
    if (!versao) continue

    const resultado = resultadoDoDia(versao, dia, valores.get(dia))
    if (resultado === 'folga') continue
    if (resultado === 'aberto' && dia === entrada.ate) continue

    forca += ALFA * (PESO[resultado] - forca)
  }

  return Math.min(1, Math.max(0, forca))
}
