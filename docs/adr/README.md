# Decisões de arquitetura

Um arquivo por decisão, formato MADR, numerados a partir de `001`.

| ADR                                    | Decisão                                       | Status                   |
| -------------------------------------- | --------------------------------------------- | ------------------------ |
| [001](001-local-first.md)              | O aparelho é a fonte de verdade               | aceito                   |
| [002](002-metas-versionadas.md)        | Metas versionadas, o passado não se reescreve | aceito                   |
| [003](003-data-local.md)               | O dia do hábito é o dia no fuso do usuário    | aceito                   |
| [004](004-ultimo-que-escreve-vence.md) | Uma célula, um valor                          | aceito                   |
| [005](005-multiusuario.md)             | Sem conta, sem `user_id`                      | recusado no escopo atual |
| [006](006-sincronizacao.md)            | Sincronização adiada, exportação no lugar     | adiado                   |
| [007](007-lembretes.md)                | Lembrete sem push e sem servidor              | adiado                   |

Os três últimos divergem do `docs/PLANO.md` de propósito: o plano descreve o produto
com Supabase, e o `docs/ROADMAP.md` coloca backend, login e sincronização em
**Não fazer**. Cada um registra o critério que o traria de volta.

Abra um ADR quando a decisão for cara de reverter, afetar mais de um módulo ou
precisar ser explicada de novo daqui a seis meses.
