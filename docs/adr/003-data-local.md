---
status: aceito
data: 2026-09-14
decisores: Marcos
---

# ADR-003: O dia do hábito é o dia no fuso do usuário

## Contexto e problema

"Li hoje" significa hoje onde a pessoa está. Se o registro guardar um instante em
UTC, ler às 22h em São Paulo cai no dia seguinte em UTC, e a grade mostra o ladrilho
na coluna errada. Viajar para outro fuso embaralha a sequência.

O problema aparece de novo no horário de verão: um dia com 23 ou 25 horas não pode
virar meio dia perdido nem dois dias cumpridos.

## Fatores de decisão

- A grade é o elemento marcante do app; uma célula na coluna errada é visível
- A regra "nunca falhar duas vezes" depende de contar dias consecutivos corretamente
- Fusos e horário de verão não podem exigir cuidado em cada função do domínio

## Opções consideradas

1. **Data civil (`YYYY-MM-DD`) no fuso do usuário, como chave**
2. Instante UTC (`timestamptz`) no registro, convertido na exibição
3. Instante UTC com deslocamento do fuso guardado junto

## Decisão

Opção 1. O registro é identificado por `(habit_id, data)`, onde `data` é a data
civil no fuso do perfil. É uma string `YYYY-MM-DD`, não um `Date`.

O fuso fica no perfil e só é usado em uma fronteira: converter "agora" em "qual é o
dia de hoje". Depois disso o domínio trabalha só com datas civis, e somar um dia é
aritmética de calendário, nunca `+ 86400000`.

O domínio não chama `new Date()`. O dia de hoje entra como parâmetro. Isso mantém as
funções puras e testáveis sem congelar o relógio.

### Consequências

Boas:

- O horário de verão deixa de existir como problema: dias civis não têm duração
- Testar é trivial, porque a data entra como argumento
- A chave `(habit_id, data)` cai direto na célula da grade (ver ADR-004)

Ruins, e aceitas:

- Mudar o fuso do perfil não remapeia o histórico. É a escolha certa — um registro
  feito às 22h em São Paulo continua pertencendo àquele dia —, mas precisa ser dito
- "Meia-noite" é ambígua para quem vira o dia acordado. Uma preferência de "início do
  dia" (ex.: 4h) resolve, e fica para depois
- Proibir `new Date()` no domínio exige uma regra de lint, não boa vontade

## Prós e contras das opções

**Opção 2 (UTC puro).** Padrão em sistemas com eventos; errado aqui. O objeto do
domínio não é um instante, é um dia. Guardar instante força reconstruir o dia a cada
leitura, com o fuso certo, em todo lugar.

**Opção 3 (UTC mais deslocamento).** Preserva a informação, mas mantém o custo da
opção 2 e adiciona um campo que quase nada consulta.
