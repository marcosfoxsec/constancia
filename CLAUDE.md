# Constância

App pessoal de hábitos. Um usuário, um aparelho por vez, roda inteiro no navegador.

## Escopo atual

O `docs/PLANO.md` descreve um produto com Supabase, login, sincronização e push.
**Esse não é o escopo atual.** O escopo hoje é o do `docs/ROADMAP.md`: local-first
sem nuvem. Não existe backend, banco remoto, conta nem login. Os dados vivem no
IndexedDB do aparelho e saem de lá por exportação de JSON.

Quando o plano e o roadmap divergirem, **o roadmap vence**. O plano é a visão de
longo prazo e a fonte dos métodos (Seção 2) e da direção de design (Seção 3).

## Stack

| Camada        | Escolha                                 |
| ------------- | --------------------------------------- |
| Interface     | React 19 + Vite 7, TypeScript estrito   |
| Armazenamento | Dexie (IndexedDB) — a partir do bloco 5 |
| Domínio       | `packages/domain`, TypeScript puro      |
| Design system | `packages/ui`                           |
| PWA           | vite-plugin-pwa (Workbox)               |
| Testes        | Vitest + fast-check, Playwright         |
| Hospedagem    | GitHub Pages, servido em subcaminho     |

## Estrutura

```
apps/web/          PWA: telas, armazenamento, service worker
packages/domain/   regras puras: sequência, força, nível, agenda
packages/ui/       tokens e primitivas
e2e/               *.smoke.spec.ts (local) e *.prod.spec.ts (publicado)
docs/adr/          decisões, formato MADR
```

## Como rodar

```bash
pnpm install
pnpm --filter @constancia/web dev      # desenvolvimento
pnpm verify                            # o portão
pnpm build                             # BASE_PATH=/constancia/ para o Pages
BASE_URL=https://<dono>.github.io/constancia/ pnpm test:e2e:prod
```

`pnpm install` precisa de `allowBuilds: esbuild` no `pnpm-workspace.yaml`. O pnpm 12
bloqueia scripts de instalação por padrão, e sem isso o esbuild não baixa o binário.

## Definição de pronto

`pnpm verify` verde. Ele é typecheck, lint, testes e fumaça e2e, nessa ordem.

Além disso, quando se aplicar:

- ADR novo em `docs/adr/` se houve decisão de arquitetura;
- método da Seção 2 do plano citado no PR — funcionalidade sem base não entra;
- screenshot anexado quando houve mudança visual;
- cobertura de 90% ou mais em `packages/domain`.

## Convenções

- **Português** em nomes de domínio, comentários, commits e microcopy. Termos da
  stack ficam em inglês (`build`, `commit`, `service worker`).
- **Conventional Commits.**
- **O domínio é puro.** `packages/domain` não importa React, Dexie, `@constancia/ui`
  nem Vite. A regra está no `eslint.config.js` e o `tsconfig` do pacote não carrega
  a lib DOM. O motivo está no ADR-001.
- **Nada do usuário vira HTML ou CSS.** Notas e nomes de hábito são texto puro.
  É prevenção de XSS armazenado; ver `docs/adr/005-multiusuario.md`.
- **TypeScript estrito**, incluindo `noUncheckedIndexedAccess` e
  `exactOptionalPropertyTypes`. Sem `any`, sem `@ts-ignore` sem justificativa.
- **Sem ansiedade de sequência.** Nenhum texto culpa o usuário por um dia perdido.

## Licença: o que não pode entrar

O Loop Habit Tracker (`iSoron/uhabits`) e o Habitica (`HabitRPG/habitica`) são
**GPL-3.0**. Este repositório não é GPL.

**Nunca copie código desses projetos**, nem adaptado, nem traduzido de Kotlin ou
JavaScript para TypeScript, nem "inspirado linha a linha". Isso vale igualmente
para trechos colados por um agente a partir de memória de treino.

O que pode: a **ideia**. Que existe uma métrica de força do hábito além da sequência,
que exportar em CSV é útil, que grupos criam responsabilidade mútua. Ideias não são
protegidas por copyright. A implementação é escrita do zero a partir da
especificação em `docs/PLANO.md` e dos ADRs.

Referências de licença permissiva — Beaver (BSD-3), Table Habit (Apache-2.0),
`jcortesdev/habit-tracker` (MIT) — podem ter código consultado, desde que a
atribuição exigida pela licença seja preservada.

Na dúvida: escreva do zero.

## Caminhos protegidos

Agentes não alteram as próprias regras. Estes caminhos exigem um commit humano —
`.claude/hooks/proteger-caminhos.sh` recusa a edição e o check `invariantes`
reprova o PR:

```
.github/workflows/   .claude/settings.json   .claude/hooks/
docs/AUTONOMIA.md    scripts/orcamento.sh    bootstrap.sh
CLAUDE.md            .env*
```

## Formatação

O Prettier roda sobre o código, não sobre o kit. `.github/`, `docs/AUTONOMIA.md`,
`docs/PLANO.md` e `LEIA-ME.md` estão no `.prettierignore`: reformatá-los reprovaria
o PR no check `invariantes` ou alteraria documentos de origem.
