---
status: aceito
data: 2026-09-14
decisores: Marcos
---

# ADR-004: Uma célula, um valor

## Contexto e problema

Conflito de dados é caro quando duas edições da mesma entidade precisam ser fundidas
campo a campo. A forma de evitar isso não é escolher um algoritmo esperto de merge:
é modelar o dado de um jeito que o conflito seja trivial.

Hoje não há sincronização (ADR-006), então não há conflito de rede. Mas há dois casos
reais de escrita concorrente sem servidor nenhum: duas abas do app abertas no mesmo
navegador, e a importação de um JSON sobre dados que já existem.

## Fatores de decisão

- O conflito precisa ser resolvido sem perguntar nada ao usuário
- A regra precisa valer igual para importação, duas abas e uma futura sincronização
- O registro de um dia é a unidade de significado do app

## Opções consideradas

1. **Registro por `(habit_id, data)`, último a escrever vence**
2. CRDT (contador ou registrador por célula)
3. Log de eventos, com o estado derivado por reprodução

## Decisão

Opção 1. A chave primária de `entries` é `(habit_id, data)` e cada registro carrega
`atualizado_em`. Quando duas escritas disputam a mesma célula, vence a de
`atualizado_em` maior.

Não existe edição parcial de um registro: escrever é substituir a célula inteira.

A importação de JSON segue a mesma regra, e é o que a torna idempotente — importar o
mesmo arquivo duas vezes dá o mesmo resultado que importar uma vez.

### Consequências

Boas:

- Conflito deixa de ser um problema de produto e vira uma comparação de datas
- A importação é segura de repetir, o que importa quando o backup é manual (ADR-001)
- Se a sincronização entrar um dia (ADR-006), a regra já está no lugar e testada

Ruins, e aceitas:

- **Uma escrita perde.** Marcar "feito" numa aba e "não feito" noutra no mesmo
  segundo descarta uma delas em silêncio. Aceitável para um usuário só
- Relógio atrasado no aparelho pode fazer uma escrita antiga vencer uma nova. Sem
  servidor não há relógio de referência; o risco é baixo e o dano é uma célula
- Não dá para mostrar "o que mudou nesta célula". Um histórico exigiria a opção 3

## Prós e contras das opções

**Opção 2 (CRDT).** Convergência sem perder escrita. Reprovada por custo: traz uma
dependência e um modelo mental grandes para resolver um conflito que, com um usuário
e um aparelho, quase nunca acontece.

**Opção 3 (log de eventos).** Daria histórico completo e auditoria de graça. Mais
caro em armazenamento e em complexidade de leitura, e o benefício principal
— entender o passado — já vem do ADR-002.
