/**
 * Os tipos do domínio. Os nomes são em português, como manda o `CLAUDE.md`, e
 * correspondem às entidades do modelo de dados da Seção 4.3 do plano:
 * `Habito` = habits, `VersaoDoHabito` = habit_versions, `Registro` = entries.
 */

import type { DataCivil, DiaDaSemana } from './data.js'

/** `check` é feito ou não feito. `quantidade` mede páginas, minutos, copos. */
export type TipoDeHabito = 'check' | 'quantidade'

/**
 * O hábito em si. Ele não guarda meta: a meta vive em `VersaoDoHabito`,
 * para que mudar a meta de hoje não reescreva o passado. Ver ADR-002.
 */
export interface Habito {
  readonly id: string
  readonly nome: string
  readonly tipo: TipoDeHabito
  /** Unidade da quantidade: "páginas", "minutos". */
  readonly unidade?: string
  /** Identidade a que o hábito pertence: "pessoa que lê". */
  readonly identidade?: string
  /** Gatilho "quando e onde": "depois do café, na mesa da cozinha". */
  readonly gatilho?: string
  /** Hábito âncora, para empilhamento. */
  readonly ancoraId?: string
  readonly posicao: number
  readonly criadoEm: DataCivil
  readonly arquivadoEm?: DataCivil
}

/**
 * A meta vigente a partir de uma data. Avaliar um dia é achar a versão de maior
 * `validoDesde` menor ou igual àquele dia.
 */
export interface VersaoDoHabito {
  readonly id: string
  readonly habitoId: string
  readonly validoDesde: DataCivil
  /** O que conta como dia cumprido. Para `check`, 1. */
  readonly meta: number
  /** A versão mínima, do método Tiny Habits. Mantém a sequência viva. */
  readonly metaMinima: number
  /** Incremento do botão de mais, para hábitos de quantidade. */
  readonly passo?: number
  /** Em que dias o hábito é cobrado. Vazio significa nenhum dia. */
  readonly diasDaSemana: readonly DiaDaSemana[]
}

/** Uma célula da grade: o valor de um hábito em um dia. */
export interface Registro {
  readonly habitoId: string
  readonly data: DataCivil
  readonly valor: number
  readonly nota?: string
  /** Instante ISO da última escrita. Usado pelo desempate do ADR-004. */
  readonly atualizadoEm?: string
}

/** O que aconteceu com um hábito em um dia. */
export type ResultadoDoDia =
  /** Não era dia desse hábito. Não conta a favor nem contra. */
  | 'folga'
  /** Bateu a meta. */
  | 'cumprido'
  /** Bateu a versão mínima, mas não a meta. Mantém a sequência. */
  | 'minimo'
  /** Ficou aberto. */
  | 'aberto'

/** A intensidade de um ladrilho no mosaico, de 0 a 4. Ver `DESIGN.md`. */
export type Nivel = 0 | 1 | 2 | 3 | 4
