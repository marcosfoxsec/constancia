/**
 * Agenda e avaliação de um dia.
 *
 * Duas regras moram aqui. A primeira é a do ADR-002: quem decide se um dia foi
 * cumprido é a versão vigente naquele dia, nunca a meta de hoje. A segunda é a
 * versão mínima do Tiny Habits: bater o mínimo mantém a sequência viva.
 */

import { diaDaSemana, type DataCivil } from './data.js'
import type { Registro, ResultadoDoDia, VersaoDoHabito } from './tipos.js'

/**
 * A versão vigente em uma data: a de maior `validoDesde` menor ou igual a ela.
 * Devolve `undefined` quando o hábito ainda não existia naquele dia.
 */
export function versaoVigente(
  versoes: readonly VersaoDoHabito[],
  data: DataCivil,
): VersaoDoHabito | undefined {
  let vigente: VersaoDoHabito | undefined
  for (const versao of versoes) {
    if (versao.validoDesde > data) continue
    if (!vigente || versao.validoDesde > vigente.validoDesde) vigente = versao
  }
  return vigente
}

/** Diz se o hábito é cobrado nesse dia da semana. */
export function estaAgendado(versao: VersaoDoHabito, data: DataCivil): boolean {
  return versao.diasDaSemana.includes(diaDaSemana(data))
}

/**
 * O que aconteceu com o hábito nesse dia.
 *
 * `valor` é o que está registrado na célula. Ausência de registro e valor zero
 * são a mesma coisa: o dia ficou aberto.
 */
export function resultadoDoDia(
  versao: VersaoDoHabito,
  data: DataCivil,
  valor: number | undefined,
): ResultadoDoDia {
  if (!estaAgendado(versao, data)) return 'folga'
  const feito = valor ?? 0
  if (feito >= versao.meta) return 'cumprido'
  if (feito > 0 && feito >= versao.metaMinima) return 'minimo'
  return 'aberto'
}

/** Indexa registros por data, para consulta em tempo constante. */
export function porData(registros: readonly Registro[]): Map<DataCivil, number> {
  const mapa = new Map<DataCivil, number>()
  for (const registro of registros) mapa.set(registro.data, registro.valor)
  return mapa
}
