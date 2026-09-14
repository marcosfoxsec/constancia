// Regras puras do Constância. Sem interface, sem armazenamento, sem rede.

export type { DataCivil, DiaDaSemana } from './data.js'
export {
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

export type {
  Habito,
  Nivel,
  Registro,
  ResultadoDoDia,
  TipoDeHabito,
  VersaoDoHabito,
} from './tipos.js'

export { estaAgendado, porData, resultadoDoDia, versaoVigente } from './agenda.js'

export type { EntradaDaSequencia, Sequencia } from './sequencia.js'
export { calcularSequencia } from './sequencia.js'

export type { EntradaDaForca } from './forca.js'
export { calcularForca, MEIA_VIDA_EM_DIAS } from './forca.js'

export { nivelDoDia, nivelDoRegistro } from './nivel.js'
