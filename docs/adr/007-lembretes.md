---
status: adiado
data: 2026-09-14
decisores: Marcos
substitui: PLANO.md Seção 5, ADR-007 "Autenticação do cron"
---

# ADR-007: Lembrete sem push e sem servidor

## Contexto e problema

O plano, na Seção 5, monta os lembretes assim: `pg_cron` a cada cinco minutos chama
uma Edge Function, que confere se o hábito já foi registrado, respeita o orçamento
diário e envia Web Push com VAPID. O ADR-007 original existia para registrar **como o
`pg_cron` se autentica** na Edge Function — questão em aberto, sem padrão documentado
(`supabase/cli#4287`).

Essa pergunta deixou de existir. Sem servidor (ADR-001, ADR-005), não há `pg_cron`,
não há Edge Function e não há o que autenticar.

Resta o problema de produto, que é real: a intenção de implementação depende do
gatilho. Um lembrete no momento combinado é o mecanismo de maior efeito da Seção 2 do
plano (Gollwitzer e Sheeran, d = 0,65). Sem nenhum lembrete, o app perde o método que
mais funciona.

## Fatores de decisão

- Notificação é contrato: poucas, na hora combinada, canceladas se o hábito já foi feito
- Um service worker sem servidor não acorda sozinho. Push exige alguém empurrando
- No iOS, Web Push só funciona com o app instalado pela tela de início, iOS 16.4+
- Custo mensal zero

## Opções consideradas

1. **Nenhum lembrete automático. O app gera texto e horário para o alarme nativo**
2. Web Push com servidor próprio de disparo (a proposta do plano)
3. Notificações locais agendadas pelo service worker
4. Notificação oportunista: avisar quando o app for aberto

## Decisão

Opção 1, com a opção 4 como complemento. Nenhum lembrete automático.

Ao criar um hábito com gatilho "quando e onde", o app monta o texto do lembrete e o
horário, prontos para o usuário cadastrar no alarme ou no app de lembretes do próprio
celular — que é confiável, funciona com a tela bloqueada e não custa nada.

Quando o app é aberto, ele pode mostrar o que ainda está em aberto no dia. Isso é a
opção 4, e não depende de permissão nenhuma.

### Consequências

Boas:

- Nada a autenticar, agendar, despachar ou monitorar. A pergunta original do ADR some
- O alarme nativo é mais confiável do que Web Push em qualquer plataforma, e muito
  mais no iPhone
- Sem pedido de permissão de notificação na primeira visita

Ruins, e aceitas:

- **O lembrete sai do app.** Mudar o horário exige mexer em dois lugares, e o app não
  sabe se o alarme existe. É uma perda real de produto
- A regra "cancelada se o hábito já foi registrado" deixa de valer: o alarme nativo
  toca mesmo se você já leu. Isso quebra parte do contrato de notificação
- Sem entrega medida, a métrica "registro em até 30 min após o lembrete" (Seção 13)
  não existe, e o horário adaptativo da Seção 5.2 fica impossível

## Critério de reentrada

Reavaliar a opção 3 (notificações locais pelo service worker) se a API de
`periodicSync` ou equivalente ficar disponível e confiável no navegador usado. Ela é
a única que devolveria o cancelamento automático sem exigir servidor.

A opção 2 volta à mesa junto com o ADR-006 — se um servidor existir por outro motivo,
o push passa a ser incremento barato. Aí a pergunta original ressurge, e a resposta
precisa registrar: segredo no Vault, rotação e escopo mínimo.
