/**
 * Datas civis. Ver `docs/adr/003-data-local.md`.
 *
 * O dia do hábito é o dia no fuso do usuário, representado como a string
 * `YYYY-MM-DD`. O domínio não conhece instantes, não chama `new Date()` e não
 * soma milissegundos: somar um dia aqui é aritmética de calendário.
 */

/** Uma data civil no formato `YYYY-MM-DD`. */
export type DataCivil = string

/** Dia da semana, de 0 (segunda) a 6 (domingo). Ver ADR-008. */
export type DiaDaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6

const PADRAO = /^(\d{4})-(\d{2})-(\d{2})$/

const DIAS_NO_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

function ehBissexto(ano: number): boolean {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0
}

function diasDoMes(ano: number, mes: number): number {
  if (mes === 2) return ehBissexto(ano) ? 29 : 28
  return DIAS_NO_MES[mes - 1] ?? 0
}

/** Quebra a data em ano, mês e dia. Lança se a data não for válida. */
export function partesDaData(data: DataCivil): { ano: number; mes: number; dia: number } {
  const achado = PADRAO.exec(data)
  if (!achado) throw new Error(`data civil inválida: ${data}`)
  const ano = Number(achado[1])
  const mes = Number(achado[2])
  const dia = Number(achado[3])
  if (mes < 1 || mes > 12) throw new Error(`data civil inválida: ${data}`)
  if (dia < 1 || dia > diasDoMes(ano, mes)) throw new Error(`data civil inválida: ${data}`)
  return { ano, mes, dia }
}

/** Diz se a string é uma data civil válida. Não lança. */
export function ehDataCivil(valor: string): valor is DataCivil {
  try {
    partesDaData(valor)
    return true
  } catch {
    return false
  }
}

/** Monta uma data civil a partir dos componentes. */
export function dataCivil(ano: number, mes: number, dia: number): DataCivil {
  const texto = `${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}-${String(
    dia,
  ).padStart(2, '0')}`
  partesDaData(texto) // valida
  return texto
}

/**
 * Número de dias desde 1970-01-01, positivo ou negativo.
 * Algoritmo de calendário proléptico gregoriano, sem depender de `Date`.
 */
export function numeroDoDia(data: DataCivil): number {
  const { ano, mes, dia } = partesDaData(data)
  const a = mes <= 2 ? ano - 1 : ano
  const era = Math.floor(a / 400)
  const anoNaEra = a - era * 400
  const diaNoAno = Math.floor((153 * (mes + (mes > 2 ? -3 : 9)) + 2) / 5) + dia - 1
  const diaNaEra = anoNaEra * 365 + Math.floor(anoNaEra / 4) - Math.floor(anoNaEra / 100) + diaNoAno
  return era * 146097 + diaNaEra - 719468
}

/** O inverso de `numeroDoDia`. */
export function dataDoNumero(numero: number): DataCivil {
  const deslocado = numero + 719468
  const era = Math.floor(deslocado / 146097)
  const diaNaEra = deslocado - era * 146097
  const anoNaEra = Math.floor(
    (diaNaEra -
      Math.floor(diaNaEra / 1460) +
      Math.floor(diaNaEra / 36524) -
      Math.floor(diaNaEra / 146096)) /
      365,
  )
  const ano = anoNaEra + era * 400
  const diaNoAno =
    diaNaEra - (365 * anoNaEra + Math.floor(anoNaEra / 4) - Math.floor(anoNaEra / 100))
  const mp = Math.floor((5 * diaNoAno + 2) / 153)
  const dia = diaNoAno - Math.floor((153 * mp + 2) / 5) + 1
  const mes = mp + (mp < 10 ? 3 : -9)
  return dataCivil(mes <= 2 ? ano + 1 : ano, mes, dia)
}

/** Soma dias a uma data civil. Aceita valores negativos. */
export function somarDias(data: DataCivil, dias: number): DataCivil {
  return dataDoNumero(numeroDoDia(data) + dias)
}

/** O dia seguinte. */
export function proximoDia(data: DataCivil): DataCivil {
  return somarDias(data, 1)
}

/** O dia anterior. */
export function diaAnterior(data: DataCivil): DataCivil {
  return somarDias(data, -1)
}

/** Quantos dias separam duas datas. Negativo quando `ate` vem antes de `de`. */
export function diasEntre(de: DataCivil, ate: DataCivil): number {
  return numeroDoDia(ate) - numeroDoDia(de)
}

/** Todos os dias de `de` até `ate`, inclusive. Vazio se `ate` vier antes de `de`. */
export function intervaloDeDias(de: DataCivil, ate: DataCivil): DataCivil[] {
  const total = diasEntre(de, ate)
  if (total < 0) return []
  const dias: DataCivil[] = []
  for (let i = 0; i <= total; i++) dias.push(somarDias(de, i))
  return dias
}

/** O dia da semana, de 0 (segunda) a 6 (domingo). */
export function diaDaSemana(data: DataCivil): DiaDaSemana {
  // 1970-01-01 foi uma quinta-feira, que nesta convenção é 3.
  const n = numeroDoDia(data)
  return ((((n + 3) % 7) + 7) % 7) as DiaDaSemana
}
