---
status: aceito
data: 2026-09-14
decisores: Marcos
---

# ADR-008: A semana começa na segunda, e o dia da semana é 0 a 6

## Contexto e problema

A agenda de um hábito é um conjunto de dias da semana (`diasDaSemana`). Esse
conjunto é gravado no IndexedDB e sai no JSON exportado, então mudar a convenção
depois significa migrar dados do usuário.

Há três convenções vivas e todas aparecem em código JavaScript: `Date.getDay()` usa
0 para domingo; a ISO 8601 usa 1 para segunda e 7 para domingo; e a grade do app,
desenhada no `DESIGN.md`, tem as colunas na ordem segunda a domingo.

Misturar duas delas desloca a coluna de um ladrilho, e a grade é o elemento marcante
do app: o erro fica visível.

## Fatores de decisão

- Uma célula na coluna errada é um bug visual imediato
- O valor é persistido e exportado, então trocar depois custa migração
- O domínio não usa `Date` (ADR-003), então não herda nada de `getDay()`
- A ordem tem que casar com a leitura da grade sem tabela de conversão

## Opções consideradas

1. **0 a 6, começando na segunda**
2. 0 a 6, começando no domingo, como `Date.getDay()`
3. 1 a 7, ISO 8601

## Decisão

Opção 1. `DiaDaSemana` é `0 | 1 | 2 | 3 | 4 | 5 | 6`, com 0 = segunda e 6 = domingo.

O valor é o índice da coluna na grade, então `diasDaSemana` e o desenho da semana
são a mesma sequência, sem conversão no meio. `diaDaSemana()` calcula direto do
número do dia civil, sem passar por `Date`.

### Consequências

Boas:

- Índice do array, coluna da grade e dia da semana são o mesmo número
- Sem tabela de conversão entre domínio e interface, logo sem lugar para errar
- Segunda como início da semana é o que o usuário brasileiro espera na grade

Ruins, e aceitas:

- Diverge de `Date.getDay()`. Qualquer ponte com a API de datas do navegador precisa
  converter explicitamente, e isso fica na fronteira, nunca no domínio
- Uma futura preferência de "semana começa no domingo" vira decisão de exibição, e
  não de dado. É a separação certa, mas precisa ser lembrada
