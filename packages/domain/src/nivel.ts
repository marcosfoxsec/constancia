/**
 * O nível do ladrilho, de 0 a 4.
 *
 * No mosaico da tela Hoje e da Grade sem filtro, o nível de um dia é quanto do
 * dia foi cumprido: 4 é o dia inteiro, 0 é o dia aberto. Com até quatro hábitos
 * agendados, o nível é literalmente quantos hábitos foram cumpridos.
 *
 * O `DESIGN.md` exige que o nível também tenha motivo próprio, e não só cor.
 * Aqui só sai o número; desenhar o motivo é da interface.
 */

import type { Nivel, ResultadoDoDia, VersaoDoHabito } from './tipos.js'

const PESO = { cumprido: 1, minimo: 0.5, aberto: 0, folga: 0 } as const

function entre1e4(valor: number): Nivel {
  return Math.min(4, Math.max(1, Math.ceil(valor))) as Nivel
}

/** O nível de um dia a partir dos resultados de todos os hábitos daquele dia. */
export function nivelDoDia(resultados: readonly ResultadoDoDia[]): Nivel {
  let agendados = 0
  let pontos = 0
  for (const resultado of resultados) {
    if (resultado === 'folga') continue
    agendados += 1
    pontos += PESO[resultado]
  }
  if (agendados === 0 || pontos <= 0) return 0
  return entre1e4((4 * pontos) / agendados)
}

/**
 * O nível de um hábito só em um dia, para a grade filtrada. O 4 é reservado
 * para quem bateu a meta: progresso parcial vai de 1 a 3, por maior que seja.
 */
export function nivelDoRegistro(versao: VersaoDoHabito, valor: number | undefined): Nivel {
  const feito = valor ?? 0
  if (feito <= 0) return 0
  if (versao.meta <= 0 || feito >= versao.meta) return 4
  return Math.min(3, entre1e4((4 * feito) / versao.meta)) as Nivel
}
