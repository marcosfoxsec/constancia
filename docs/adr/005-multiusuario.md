---
status: recusado no escopo atual
data: 2026-09-14
decisores: Marcos
substitui: PLANO.md Seção 4.3, ADR-005 "Multiusuário desde o dia 1"
---

# ADR-005: Sem conta, sem `user_id`

## Contexto e problema

O `docs/PLANO.md` propõe multiusuário desde o primeiro dia: `user_id` em toda tabela
e RLS no Postgres, mesmo com um usuário só, para que abrir o app para outras pessoas
seja decisão de produto e não reescrita.

O argumento é bom, e para um app com servidor seria o certo. Mas o `docs/ROADMAP.md`
coloca "backend, login, sincronização em nuvem" em **Não fazer**. Sem servidor, não
há RLS, não há `auth.uid()` e não há o que isolar: o banco é o IndexedDB de um
navegador, e quem abre o navegador já é o dono.

Carregar `user_id` nesse cenário seria um campo que nunca varia, uma coluna de valor
constante defendendo contra um atacante que não existe.

## Fatores de decisão

- Preparar para uma escala que pode nunca chegar tem custo real e benefício incerto
- O isolamento que o `user_id` traria é dado de graça pela origem do navegador
- A parte cara de abrir para outras pessoas não é o esquema; é auth, LGPD, suporte

## Opções consideradas

1. **Sem identidade de usuário em lugar nenhum**
2. `user_id` em todas as entidades, com um valor fixo local
3. Um perfil local sem identidade, só com preferências (fuso, início do dia)

## Decisão

Opções 1 e 3, combinadas. Nenhuma entidade tem `user_id`. Existe um registro único de
preferências, que guarda fuso horário e configuração — não identidade.

O que **é** preservado do argumento original, por ser barato:

- O `packages/domain` não conhece usuário nenhum. As funções recebem hábitos,
  versões e registros, e não sabem de quem são. Se um dono for adicionado depois, o
  domínio não muda uma linha
- A camada de armazenamento fica atrás de uma interface estreita. Adicionar um filtro
  por dono seria mudança de uma camada, não do app inteiro

### Consequências

Boas:

- O esquema é menor, e cada consulta deixa de carregar um filtro inútil
- Sem conta não há senha, sessão, recuperação, vazamento nem tela de login
- Sem dado pessoal no servidor, a LGPD não se aplica: uso pessoal sem fim econômico,
  art. 4º, I. O suplemento registrado, que seria dado sensível de saúde (art. 5º, II),
  nunca sai do aparelho

Ruins, e aceitas:

- **Abrir para outras pessoas vira migração de dados, não só de código.** É
  exatamente o custo que o plano queria evitar. Aceito porque o gatilho é incerto
- Sem `user_id` não há `audit_log` com ator. A auditoria do plano (Seção 6) some junto
  com o servidor

## Critério de reentrada

Este ADR é revisado, e provavelmente revertido, se qualquer um acontecer:

1. uma segunda pessoa passar a usar o app;
2. surgir necessidade de backup gerenciado, não manual;
3. o mesmo dado precisar ser editável em dois aparelhos ao mesmo tempo.

Nesse ponto entram, juntos: ADR-006 (sincronização), conta com MFA, RLS testada com
pgTAP e o RIPD que o plano pede antes da Fase 6.

## O que continua valendo mesmo sem servidor

A regra de **não renderizar entrada do usuário como HTML ou CSS**. Notas e nomes de
hábito são texto puro. O XSS armazenado corrigido no Beaver Habit Tracker veio de CSS
customizado, e num app local o alvo continua sendo o próprio usuário: um nome de
hábito vindo de um JSON importado é entrada não confiável. Isso vira teste de
regressão na importação.
