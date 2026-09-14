# Constância: plano de produto e engenharia

Nome provisório. Versão 0.1, setembro de 2026.

## 0. Premissas

O app nasce para um usuário (você). A arquitetura já nasce multiusuário: todo dado tem dono (`user_id`) e o isolamento é feito no banco. Abrir para 5 ou 500 pessoas vira decisão de produto, não reescrita.

"AAA" aqui tem dois sentidos, e o plano atende aos dois:

1. Padrão alto de engenharia: testes, orçamento de performance, acessibilidade e revisão em todo PR.
2. AAA de segurança: autenticação, autorização e auditoria (Seção 6).

Todo o código é produzido via Claude Code. Você decide, aprova e faz merge. Os agentes propõem e executam dentro de limites (Seção 9).

## 1. Visão do produto

Registrar um hábito é fácil. Manter por meses é difícil. O app existe para reduzir o atrito do registro e sobreviver aos dias ruins.

Princípios que guiam toda decisão:

| Princípio | O que significa na prática |
|---|---|
| Registro em até 2 toques | Da notificação ou da tela inicial até o hábito marcado |
| A falha faz parte do plano | Um dia perdido não zera nada. Dois seguidos acendem alerta |
| Toda funcionalidade cita um método | Se não há base em ciência de hábitos, não entra |
| Notificação é contrato | Poucas, no momento combinado, canceladas se o hábito já foi feito |
| O dado é seu | Exportar, apagar e entender o que é coletado, a qualquer momento |

## 2. Metodologias e como viram funcionalidade

A regra do projeto: toda feature referencia pelo menos uma linha desta tabela no PR.

| Método | Ideia central | Base | Funcionalidade no app |
|---|---|---|---|
| Intenções de implementação | "Quando X acontecer, farei Y" | Gollwitzer e Sheeran (2006), meta-análise com 94 estudos, efeito médio a alto (d = 0,65) | Todo hábito tem gatilho "quando / onde". O lembrete dispara no gatilho |
| Empilhamento de hábitos | Ancorar o novo hábito em um que já existe | Clear, *Hábitos Atômicos*, derivado de Fogg | Campo "depois de...". Ao marcar a âncora, o app sugere o próximo |
| Tiny Habits (B = MAP) | Comportamento acontece quando motivação, capacidade e gatilho se encontram. Comece pequeno | Fogg, *Tiny Habits* (2019) | Cada hábito tem uma "versão mínima" (ex.: 1 página). Ela mantém a sequência |
| Tempo real de formação | A automaticidade leva em média 66 dias, com faixa de 18 a 254. Falhar um dia não prejudicou o processo | Lally et al. (2010), *European Journal of Social Psychology* | Marco dos 66 dias no lugar da promessa de "21 dias". Sequência com tolerância |
| Nunca falhar duas vezes | Uma falha é acidente. Duas é o começo de um novo padrão | Clear | Sequência só quebra com duas falhas seguidas. Notificação de resgate no dia seguinte |
| WOOP / contraste mental | Desejo, Resultado, Obstáculo, Plano | Oettingen, *Rethinking Positive Thinking* (2014) | Criação de hábito em 4 passos. O obstáculo vira um plano "se... então" |
| Efeito recomeço | Marcos temporais (segunda, dia 1, aniversário) aumentam a motivação | Dai, Milkman e Riis (2014), *Management Science* | Sugestão de recomeço e revisão em datas-marco |
| Hábitos baseados em identidade | Cada registro é um voto no tipo de pessoa que você quer ser | Clear | Hábitos agrupados por identidade ("pessoa que lê"). Contagem de votos |
| Automonitoramento | Monitorar o progresso aumenta a chance de atingir metas | Harkin et al. (2016), *Psychological Bulletin*, meta-análise | A grade, as estatísticas e a revisão semanal |
| Revisão periódica | Olhar a semana, ajustar e replanejar | Ciclo PDCA | Revisão guiada de 5 minutos aos domingos, com resumo do coach |

Antipadrão a evitar: ansiedade de sequência. Contador que zera por um deslize gera abandono. A tolerância da regra "nunca falhar duas vezes" e a versão mínima existem para isso.

## 3. Direção de design

O objetivo é um app com identidade própria, e não um kit de componentes com cor trocada.

**Conceito: mosaico.** Cada dia cumprido é um ladrilho assentado. Um mês bem feito forma um padrão. A grade é o elemento marcante do app. Todo o resto fica quieto em volta dela.

| Decisão | Proposta inicial (validar na Fase 0 com a skill `frontend-design`) |
|---|---|
| Base | Fundo escuro com escala de verdes para intensidade, na linha da sua referência |
| Tipografia | Uma display com personalidade para números e títulos, e Atkinson Hyperlegible no corpo. Candidatas para display: Bricolage Grotesque ou Recursive |
| Movimento | Um único momento marcante: o ladrilho "assentando" ao marcar um hábito. Resto sem animação decorativa |
| Toque | Vibração curta ao registrar, onde o aparelho suporta (Android) |
| Acessibilidade | WCAG 2.2 AA. Paleta alternativa para daltonismo (azul e laranja). Nível parcial também codificado por forma, e não só por cor |
| Voz | Microcopy em português simples, sem tom motivacional forçado. Revisado com a skill `humanizar-escrita` |
| Componentes | Primitivas sem estilo (Radix) para acessibilidade, com estilo 100% próprio via tokens |

Entregável da Fase 0: um `DESIGN.md` com tokens (cor, tipo, espaço, raio, movimento), lista de proibições visuais e 3 telas de referência.

## 4. Arquitetura

### 4.1 Visão geral

**Local-first.** O banco do aparelho (IndexedDB) é a fonte de verdade da interface. O app abre e registra sem rede. Um motor de sincronização envia as mudanças ao Supabase quando há conexão.

| Camada | Tecnologia | Papel |
|---|---|---|
| Interface | React + Vite + TypeScript estrito, Radix, CSS Modules com tokens | Telas e interação |
| Estado local | Dexie (IndexedDB) | Dados do usuário no aparelho |
| Sincronização | Fila de saída (outbox) + último que escreve vence por (hábito, data) | Offline e multi-dispositivo |
| PWA | vite-plugin-pwa (Workbox), manifest, service worker | Instalação, cache, push |
| Domínio | Pacote TypeScript puro (`packages/domain`) | Regras de sequência, níveis, agenda. Usado no app e nas Edge Functions |
| Backend | Supabase em sa-east-1 (São Paulo): Auth, Postgres, RLS, Edge Functions, pg_cron, pg_net | Contas, dados, agendamento |
| Push | Web Push com VAPID. Payload no formato Declarative Web Push com fallback no service worker | Lembretes |
| Coach | Edge Function chamando a Claude API | Revisão semanal em linguagem natural |
| Hospedagem | Cloudflare Pages | CDN, cabeçalhos de segurança, preview por PR |
| Observabilidade | Sentry (erros, com dados pessoais removidos) e tabela própria de eventos | Sinais para os agentes |

### 4.2 Por que o domínio é um pacote separado

As regras que definem o app (o que é dia cumprido, quando a sequência quebra, qual o nível de verde) ficam em um pacote sem dependência de interface ou banco. O mesmo código roda no navegador e nas Edge Functions (Deno). É a parte mais testada do sistema.

### 4.3 Modelo de dados

```
profiles          id (= auth.uid), nome, fuso_horario, criado_em
identities        id, user_id, nome ("pessoa que lê")
habits            id, user_id, identity_id, nome, tipo (check | qty), unidade,
                  gatilho_texto, ancora_habit_id, posicao, arquivado_em, criado_em
habit_versions    id, habit_id, valido_desde (date), meta, meta_minima, passo,
                  dias_semana smallint[]
entries           user_id, habit_id, data (date), valor, nota, atualizado_em,
                  PK (habit_id, data)
reminders         id, habit_id, hora_local, dias_semana, tipo, ativo
push_subscriptions id, user_id, endpoint, p256dh, auth, user_agent, criado_em
reviews           id, user_id, semana (date), respostas jsonb, resumo_coach
events            id, user_id, nome, props jsonb (sem conteúdo pessoal), criado_em
audit_log         id, ator, acao, tabela, registro_id, antes, depois, criado_em
```

Decisões registradas como ADR:

- **ADR-001 Local-first.** Resposta instantânea e uso offline.
- **ADR-002 Metas versionadas (`habit_versions`).** Mudar a meta não reescreve o passado. A versão atual do HTML tem essa falha.
- **ADR-003 Data local.** O dia do hábito é o dia no fuso do usuário. Campo `date`, fuso no perfil.
- **ADR-004 Último que escreve vence por célula.** Cada célula da grade é um valor. Conflito de sincronização vira problema trivial.
- **ADR-005 Multiusuário desde o dia 1.** `user_id` e RLS em todas as tabelas, mesmo com um só usuário.

### 4.4 Escalabilidade

Volume estimado: 10 hábitos por 365 dias dão cerca de 3.650 registros por usuário por ano. Isso fica na ordem de centenas de KB por usuário por ano. O plano gratuito do Supabase (500 MB) comporta centenas de usuários por anos.

O que já está preparado para crescer:

| Eixo | Preparação |
|---|---|
| Usuários | RLS por `user_id`. Índices em (user_id, data) |
| Leitura | Local-first: a maior parte das leituras nem chega ao servidor |
| Notificações | Dispatcher em lote por janela de 5 minutos, idempotente |
| Custo | Free até ter mais de um usuário que dependa de backup gerenciado. Depois, Supabase Pro |
| Funcionalidades | Módulos isolados (hábitos, registros, lembretes, coach, social futuro) com fronteiras no domínio |

## 5. Notificações

### 5.1 Tipos

| Tipo | Quando | Base no método |
|---|---|---|
| Gatilho | Na hora definida no "quando / onde" do hábito | Intenção de implementação |
| Resgate | Hábito aberto perto do fim do dia. Sugere a versão mínima | Tiny Habits |
| Nunca duas vezes | Manhã seguinte a uma falha | Nunca falhar duas vezes |
| Revisão | Domingo, horário escolhido | Revisão periódica |
| Marco | Recorde de sequência, 66 dias, início de mês | Efeito recomeço, automonitoramento |

### 5.2 Regras

1. Cancelada se o hábito já foi registrado. O dispatcher confere antes de enviar.
2. Orçamento diário (padrão: 3) e horário de silêncio.
3. Agrupamento: vários hábitos no mesmo horário viram uma notificação.
4. Toque abre direto no hábito (`/hoje?h=<id>`). Botões "Feito" e "Mínimo" onde a plataforma suporta ações.
5. Assinaturas que retornam 404 ou 410 do serviço de push são removidas.
6. Horário adaptativo (Fase 5): se você sempre registra 40 minutos depois do lembrete, o app sugere mudar o horário.

### 5.3 Fluxo

`pg_cron` (a cada 5 min) → Edge Function `dispatcher` → seleciona lembretes vencidos no fuso de cada usuário → confere registro e orçamento → envia Web Push (VAPID) → serviço do navegador (APNs, FCM, Mozilla) → notificação no aparelho.

### 5.4 iPhone

Push em web app funciona no iOS 16.4 ou superior, somente com o app adicionado à tela de início pelo Safari. O iOS 18.4 trouxe o Declarative Web Push, que mostra a notificação sem depender de JavaScript no service worker. O onboarding precisa detectar iPhone fora do modo instalado e ensinar a instalação antes de pedir permissão.

## 6. Segurança: AAA

| Pilar | Controle |
|---|---|
| Autenticação | Magic link por e-mail + MFA TOTP. Cadastro fechado por convite. Sessão curta com refresh |
| Autorização | RLS negando por padrão em todas as tabelas. Políticas `user_id = auth.uid()`. Chave de serviço só em Edge Functions e CI |
| Auditoria | `audit_log` alimentado por triggers nas tabelas de configuração. Logs de autenticação do Supabase. Retenção de 1 ano |

Controles complementares:

- Testes de RLS com pgTAP (`supabase test db`) bloqueando merge: usuário A tenta ler, alterar e apagar dados de B.
- CSP restritiva, HSTS, `frame-ancestors 'none'`, Permissions-Policy.
- Dependabot, secret scanning e `npm audit` no CI.
- Meta de verificação: OWASP ASVS nível 2 nos controles aplicáveis.
- Modelagem de ameaças STRIDE em ADR, revisada a cada fase.
- Backup noturno com `pg_dump` cifrado (age) fora do Supabase. Restore testado a cada trimestre. O plano gratuito não tem backup automático.
- Coach: envia à Claude API só agregados da semana (taxas, horários), nunca notas livres. Opção de desligar.

Privacidade. Suplemento registrado pode ser lido como dado de saúde, que é dado sensível na LGPD (art. 5º, II). Com uso só pessoal e sem fim econômico, a lei não se aplica (art. 4º, I). Ao abrir para outras pessoas, entram consentimento específico (art. 11), termos simples, exportação e exclusão de conta. Recomendável um RIPD curto antes da Fase 6.

## 7. Qualidade

| Área | Ferramenta | Meta ou portão |
|---|---|---|
| Domínio | Vitest + fast-check (testes por propriedade) | Cobertura de 90% ou mais em `packages/domain` |
| Componentes | Vitest + Testing Library | Telas críticas cobertas |
| Ponta a ponta | Playwright | Fluxos: registrar, offline e volta, sincronização, push simulado |
| Banco | pgTAP | Todas as políticas RLS testadas |
| Acessibilidade | axe-core no Playwright | Zero violação séria ou crítica |
| Visual | Screenshots do Playwright | Diferença visual revisada no PR |
| Performance | Lighthouse CI | LCP < 2,5 s, INP < 200 ms, CLS < 0,1. JS inicial < 150 KB gzip |
| Código | TypeScript estrito, ESLint, Prettier | Zero erro no CI |
| Processo | Trunk-based, PR obrigatório, Conventional Commits, semantic-release | Changelog e versão automáticos |

Definição de pronto: teste passando, portões verdes, ADR atualizado se houve decisão, método citado no PR e screenshot anexado quando há mudança visual.

## 8. Construção 100% via Claude Code

### 8.1 Estrutura do repositório

```
constancia/
├── CLAUDE.md                  contexto, stack, convenções, estado atual
├── DESIGN.md                  tokens e regras visuais
├── docs/
│   ├── adr/                   decisões numeradas
│   ├── metodos/               uma ficha por método da Seção 2
│   └── runbooks/              restore, rotação de chaves, incidente
├── apps/web/                  PWA
├── packages/domain/           regras puras + testes
├── packages/ui/               design system
├── supabase/
│   ├── migrations/
│   ├── functions/             dispatcher, coach, feedback
│   └── tests/                 pgTAP
├── .claude/
│   ├── settings.json          permissões e hooks
│   ├── agents/                subagentes
│   └── skills/                skills do projeto
├── .mcp.json                  servidores MCP do projeto
└── .github/workflows/         CI e agentes agendados
```

### 8.2 Skills

Skills públicas da Anthropic (repositório `anthropics/skills`):

| Skill | Uso |
|---|---|
| `frontend-design` | Direção visual e crítica contra estética genérica |
| `webapp-testing` | Testes e inspeção visual com Playwright |
| `skill-creator` | Criar e medir as skills próprias abaixo |
| `mcp-builder` | Se um dia expuser o app como servidor MCP |

Skills próprias (criar na Fase 0 com `skill-creator`):

| Skill | Conteúdo |
|---|---|
| `constancia-design` | Tokens, proibições visuais, regra do elemento marcante, checklist de crítica por screenshot |
| `ciencia-habitos` | Fichas dos métodos. Obriga citar o método no PR e recusar feature sem base |
| `supabase-rls` | Padrões de política, template de teste pgTAP, checklist de migração |
| `pwa-push` | VAPID, payload declarativo, limites do iOS, idempotência do dispatcher |
| `adr` | Template e regra de quando abrir um ADR |
| `humanizar-escrita` | Você já tem. Aplicar em toda microcopy |

A skill `constancia-design` é o que impede o app de ficar padronizado. Ela carrega o que é proibido (gradiente decorativo, cartão genérico com sombra, rótulo em caixa alta) e força uma crítica por screenshot antes de cada PR visual.

### 8.3 Subagentes

| Subagente | Responsabilidade | Ferramentas |
|---|---|---|
| `arquiteto` | Fronteiras de módulo, ADRs, revisão de acoplamento | Leitura, escrita em `docs/` |
| `designer` | Aplica `constancia-design`, compara screenshots | Playwright MCP |
| `cientista-habitos` | Valida feature contra os métodos | Leitura |
| `seguranca` | RLS, CSP, segredos, dependências | Leitura, `supabase test db` |
| `qa` | Escreve e roda testes | Vitest, Playwright |
| `a11y` | axe, navegação por teclado, contraste | Playwright |
| `docs` | Changelog, ADR, runbooks | Escrita em `docs/` |

### 8.4 Hooks

| Evento | Ação |
|---|---|
| `PostToolUse` em edição | Prettier + typecheck do arquivo alterado |
| `PreToolUse` | Bloqueia edição de migração já aplicada, de `.env` e de workflows sem label |
| `Stop` | Roda testes do pacote afetado antes de encerrar |
| `SessionStart` | Injeta o estado atual (fase, issue em andamento) |

### 8.5 MCP

- Supabase MCP apontando só para o projeto de desenvolvimento, em modo somente leitura para produção.
- Playwright MCP para ver e testar a interface.
- GitHub via `gh` CLI.

## 9. Melhoria contínua com agentes

São dois ciclos diferentes. Um melhora o software. O outro melhora os seus hábitos.

### 9.1 Ciclo de engenharia

| Etapa | Quem | Como |
|---|---|---|
| Sinais | Sistema | Erros (Sentry), eventos de uso, Lighthouse, dependências, botão "sugerir melhoria" no app |
| Triagem | Agente diário | `claude-code-action` agendado lê os sinais e cria ou atualiza issues rotuladas |
| Análise de produto | Agente semanal | Lê métricas agregadas e propõe até 3 experimentos, cada um ligado a um método |
| Manutenção | Agente semanal | Dependências, `npm audit`, código morto, docs desatualizadas |
| Aprovação | Você | Aplica a label `aprovado` na issue |
| Construção | Agente construtor | Implementa em branch e abre PR |
| Revisão | Subagentes | Segurança, a11y, design por screenshot, testes |
| Merge | Você | Branch protegida. Agente nunca faz merge |

Limites dos agentes:

- Máximo de 3 PRs de agente abertos ao mesmo tempo.
- Orçamento mensal de tokens com alerta.
- Mudança em RLS, autenticação ou workflows exige label `security-review` e revisão sua linha a linha.
- Sem acesso a segredos de produção.
- Prevenção de laço: a action rejeita atores bot por padrão, a menos que estejam em `allowed_bots`.
- Botão de parada: desativar o workflow no GitHub suspende todos os agentes.

### 9.2 Ciclo pessoal: o coach

Um motor de regras decide. O LLM só explica e conversa.

| Sinal | Regra | Sugestão |
|---|---|---|
| Taxa abaixo de 50% por 2 semanas | Tiny Habits | Reduzir a meta ou usar a versão mínima como meta |
| Taxa acima de 90% por 4 semanas | Progressão | Subir a meta em 10% a 20% |
| Registro sempre bem depois do lembrete | Intenção de implementação | Mudar o horário ou o gatilho |
| Falhas concentradas num dia da semana | WOOP | Criar um plano "se... então" para aquele dia |
| Marco temporal próximo | Efeito recomeço | Propor recomeço ou novo hábito |

Você aceita ou recusa cada sugestão. Sugestão aceita gera uma nova linha em `habit_versions`, então o histórico mostra o antes e o depois.

Experimentos N-de-1: para testar, por exemplo, lembrete às 7h contra 21h, o app alterna semanas (A, B, A, B) e compara a taxa de cumprimento. É o jeito honesto de experimentar com um só usuário.

## 10. Roteiro

Premissa: 6 a 8 horas por semana.

| Fase | Duração | Entregas | Critério de saída |
|---|---|---|---|
| 0. Fundamentos | 1 semana | Repositório, `CLAUDE.md`, ADRs 001 a 005, `DESIGN.md`, skills e subagentes | Claude Code cria uma tela seguindo as skills sem correção sua |
| 1. Núcleo local-first | 3 semanas | `packages/domain` com testes, telas Hoje, Grade e Hábitos, IndexedDB, PWA instalável, importação do HTML atual | Você usa por 1 semana só no celular, offline incluso |
| 2. Nuvem e AAA | 2 semanas | Supabase, login com MFA, RLS com pgTAP, sincronização, auditoria, backup | Teste de acesso cruzado verde. Restore testado |
| 3. Notificações | 2 semanas | Assinatura push, dispatcher, tipos gatilho, resgate e nunca duas vezes, orçamento, onboarding iOS | 14 dias de lembretes sem duplicata nem envio após registro |
| 4. Método | 3 semanas | Criação WOOP, "se... então", versão mínima, tolerância, identidades, revisão semanal | Cada hábito seu tem gatilho e versão mínima |
| 5. Agentes | 2 semanas | Workflows de triagem, manutenção e construção, revisores, coach semanal | Primeiro PR de agente aprovado e em produção |
| 6. Expansão | Sob demanda | Convites, LGPD formal, Supabase Pro, grupos opcionais | Decisão sua de abrir |

Total até a Fase 5: cerca de 13 semanas.

## 11. Custos estimados

| Item | Custo |
|---|---|
| Supabase Free | R$ 0 |
| Cloudflare Pages | R$ 0 |
| GitHub privado + Actions | R$ 0 dentro da franquia |
| Sentry (plano gratuito) | R$ 0 |
| Claude API para agentes e coach | Variável. Definir teto mensal. Autenticar a action com OAuth usa a sua assinatura Claude no lugar de tokens de API |
| Domínio .com.br (opcional) | Cerca de R$ 40 por ano |
| Supabase Pro (quando houver mais usuários) | US$ 25 por mês |

## 12. Riscos

| Risco | Mitigação |
|---|---|
| Escopo cresce antes do núcleo estar sólido | Fases com critério de saída. Ideia nova vira issue |
| Agente produz código plausível e errado | Portões de CI, revisão por subagentes, merge só humano |
| Design fica genérico | Skill `constancia-design` e crítica por screenshot obrigatória |
| Push instável no iPhone | Onboarding de instalação, métrica de entrega, fallback no próprio app |
| Perda de dados no plano gratuito | Backup próprio e restore trimestral |
| Custo de tokens dos agentes | Teto mensal, frequência ajustável, relatório de custo semanal |
| Ansiedade de sequência | Tolerância, versão mínima, linguagem sem culpa |

## 13. Métricas

| Tipo | Métrica |
|---|---|
| Produto | Dias com registro por semana. Taxa de cumprimento por hábito. Tempo até registrar (meta: menos de 5 s) |
| Engenharia | Scores do Lighthouse. Erros por semana. Cobertura do domínio |
| Agentes | PRs propostos, aprovados e recusados. Custo por PR aprovado |
| Notificações | Taxa de entrega. Registro em até 30 min após o lembrete |

## 14. Primeira sessão no Claude Code (Fase 0)

1. "Leia `PLANO_Constancia.md`. Crie o monorepo da Seção 8.1 com pnpm workspaces e um `CLAUDE.md` que resuma stack, convenções e fase atual."
2. "Escreva os ADRs 001 a 005 da Seção 4.3 no formato MADR."
3. "Use a skill `skill-creator` para criar as skills `constancia-design` e `ciencia-habitos` a partir das Seções 2 e 3."
4. "Use a skill `frontend-design` para propor 3 direções visuais para a tela Hoje. Gere screenshots e compare com as proibições de `constancia-design`."
5. "Crie os subagentes da Seção 8.3 e os hooks da Seção 8.4."

## 15. Referências no GitHub

Pesquisa feita em setembro de 2026. Regra do projeto: estes repositórios servem de referência de ideias e de decisões. Código de projetos GPL não entra no repositório, nem adaptado. Essa regra vai no `CLAUDE.md` para os agentes.

### 15.1 Apps de hábito

| Projeto | Licença | O que aproveitar | O que não copiar |
|---|---|---|---|
| Loop Habit Tracker (`iSoron/uhabits`) | GPL-3.0 | Métrica de força do hábito, além da sequência. Exportação CSV e SQLite. Lembretes com ações | Código. Reimplementar a ideia a partir de especificação própria |
| Beaver Habit Tracker (`daya0576/beaverhabits`) | BSD-3-Clause | API para integrações (Atalhos da Apple, Home Assistant). Pasta `.claude` no repositório. Correção de XSS em CSS customizado | Arquitetura com renderização no servidor, que sofre com latência |
| Table Habit (`FriesI23/mhabit`) | Apache-2.0 | Hábitos negativos (evitar). Meta diária e meta máxima. JSON legível para importar e exportar | Nada a evitar em especial |
| `jcortesdev/habit-tracker` | MIT | Quase a stack da Fase 1: Dexie, heatmap feito à mão, navegação por teclado com `aria-label` por célula, axe no CI, ADRs | É projeto de portfólio, sem comunidade. Referência, não dependência |
| Habitica (`HabitRPG/habitica`) | GPL-3.0 | Grupos e responsabilização mútua, para a Fase 6 | Gamificação de RPG, que foge da proposta |

### 15.2 Infraestrutura

| Referência | Uso no projeto |
|---|---|
| Documentação Supabase: agendar Edge Functions com `pg_cron` + `pg_net` + Vault | Padrão oficial para o dispatcher de lembretes |
| Issue `supabase/cli#4287` | Autenticação do `pg_cron` chamando Edge Function ainda sem padrão documentado. Registrar a escolha em ADR |
| Plugin de replicação Supabase do RxDB | Plano B de sincronização. Confirmar licença do plugin antes de adotar |
| PowerSync (parceiro Supabase) | Plano C. Licença FSL, cliente com SQLite em WASM |
| `grubersjoe/react-activity-calendar` e `react-calendar-heatmap` | Referência de níveis e acessibilidade. A grade será própria, por ser o elemento marcante do design |
| `anthropics/claude-code-action`, `docs/solutions.md` | Modelos de workflow agendado (manutenção semanal, triagem) |
| `ChrisWiles/claude-code-showcase` | Exemplo de `.claude/` com hooks, skills, agentes e workflows agendados |

### 15.3 Mudanças no plano a partir da pesquisa

1. **Força do hábito.** Nova métrica no `packages/domain`: média móvel exponencial dos dias cumpridos. Ela sobe devagar e cai devagar, e reflete melhor a automaticidade gradual descrita por Lally et al. A sequência continua visível, mas deixa de ser a métrica principal.
2. **Hábitos negativos.** Tipo novo para "evitar" (ex.: café depois das 16h). Na grade, o dia cumprido é o dia sem registro.
3. **ADR-006 Sincronização própria.** Fila de saída própria com "último que escreve vence" por célula. Critério de troca para RxDB ou PowerSync: surgir entidade editável em mais de um aparelho ao mesmo tempo com campos múltiplos.
4. **ADR-007 Autenticação do cron.** Registrar como o `pg_cron` se autentica na Edge Function (segredo no Vault, rotação e escopo mínimo).
5. **Sanitização.** Nenhum campo do usuário é renderizado como HTML ou CSS. Notas são texto puro. Caso real de XSS armazenado no Beaver serve de teste de regressão.
6. **API pessoal (Fase 6).** Endpoint com token para registrar água por Atalho do iPhone ou widget, como faz o Beaver.
7. **Lighthouse.** A versão 12 retirou a categoria PWA. A instalabilidade passa a ser verificada por teste E2E (manifest, service worker e instalação), e não por nota.
