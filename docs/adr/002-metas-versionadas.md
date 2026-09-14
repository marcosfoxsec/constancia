---
status: aceito
data: 2026-09-14
decisores: Marcos
---

# ADR-002: Metas versionadas, o passado não se reescreve

## Contexto e problema

A versão em HTML que existe hoje guarda a meta no próprio hábito. Quando a meta de
"ler" sobe de 10 para 20 páginas, todos os dias passados em que 10 páginas contavam
como cumprido passam a contar como falha. A grade muda de cor retroativamente.

Isso é pior do que um bug de exibição: destrói o registro de um progresso que
aconteceu de verdade, e é exatamente o tipo de coisa que faz alguém abandonar o app.

## Fatores de decisão

- Mudar a meta de hoje não pode alterar o resultado de ontem
- O coach sugere ajustes de meta com frequência (Seção 9.2 do plano); cada aceite
  cria uma mudança de meta, então isso não é caso raro
- Precisa ser possível ver o antes e o depois de um ajuste

## Opções consideradas

1. **Tabela `habit_versions` com `valido_desde`**
2. Copiar a meta vigente para dentro de cada registro (`entries`)
3. Congelar o resultado calculado (cumprido / não cumprido) no registro

## Decisão

Opção 1. A meta nunca vive no hábito. Vive em `habit_versions`, com `valido_desde`.

```
habit_versions  id, habit_id, valido_desde (date), meta, meta_minima, passo,
                dias_semana smallint[]
```

Avaliar um dia significa achar a versão vigente naquela data: a de maior
`valido_desde` menor ou igual ao dia. Toda função do domínio que decide se um dia
foi cumprido recebe a versão, nunca o hábito.

### Consequências

Boas:

- O passado é imutável por construção, não por disciplina
- O histórico de metas fica legível: dá para mostrar "você subiu de 10 para 20 no
  dia 3 de março" e comparar a taxa antes e depois
- Sugestão aceita do coach vira uma linha nova, então o experimento é auditável

Ruins, e aceitas:

- Toda leitura da grade precisa resolver a versão por dia. Mitigação: resolver uma
  vez por intervalo e passar adiante, em vez de consultar por célula
- Mais uma entidade para importar e exportar

## Prós e contras das opções

**Opção 2 (meta dentro do registro).** Resolve o problema retroativo, mas só guarda
a meta dos dias em que houve registro. Um dia sem registro não sabe contra qual meta
estava sendo avaliado, e é justamente o dia que a sequência precisa julgar.

**Opção 3 (congelar o resultado).** Mais barato de ler, mas impede corrigir um erro
de cálculo do domínio sem reprocessar tudo, e perde o valor bruto.
