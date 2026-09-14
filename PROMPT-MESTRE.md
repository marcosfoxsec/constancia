# Prompt mestre

Cole no Claude Code, um bloco por vez, na ordem. Espere terminar antes do próximo.

---

## 1. Esqueleto

```
Leia docs/PLANO.md por completo. Este é um app pessoal, de um usuário só,
que roda inteiro no aparelho. Não existe backend, banco na nuvem nem login.

Crie o monorepo com pnpm workspaces:
  apps/web        Vite + React + TypeScript estrito, vite-plugin-pwa
  packages/domain TypeScript puro, sem dependência de UI ou armazenamento
  packages/ui     design system
  docs/adr/

Scripts no package.json da raiz:
  typecheck, lint, test, test:e2e:smoke, test:e2e:prod, build
  verify = typecheck && lint && test && test:e2e:smoke

O build precisa respeitar a variável BASE_PATH, porque o app é servido em
subcaminho no GitHub Pages.
Configure Vitest, ESLint, Prettier e Playwright. O test:e2e:prod roda contra
a URL da variável BASE_URL.

Rode pnpm install e pnpm verify. Os dois precisam passar.
Não escreva funcionalidade nenhuma nesta etapa.
```

## 2. Contexto e rumo

```
Escreva CLAUDE.md na raiz: stack, convenções, estrutura, como rodar, o que é
"pronto" (pnpm verify verde) e a regra de licença (código GPL do Loop e do
Habitica nunca entra no repositório, só as ideias).

Escreva docs/ROADMAP.md com as seções Agora, Depois e Não fazer, a partir do plano.
Escreva os ADRs 001 a 007 em docs/adr/, formato MADR.
```

## 3. Identidade visual

```
Use a skill frontend-design. Leia a Seção 3 do plano.
Proponha três direções visuais para a tela Hoje, com o conceito "mosaico":
cada dia cumprido é um ladrilho assentado e a grade é o elemento marcante.
Gere um HTML estático de cada uma, tire screenshot com Playwright e me mostre.
```

Escolha uma, depois:

```
Escolhi a direção <N>. Escreva DESIGN.md com tokens (cor, tipografia, espaço,
raio, movimento), lista de proibições visuais e as telas de referência.
Depois use a skill skill-creator para criar .claude/skills/constancia-design
a partir do DESIGN.md e .claude/skills/ciencia-habitos a partir da Seção 2 do plano.
```

## 4. Domínio

```
Implemente packages/domain: tipos Habit, HabitVersion e Entry, e as funções de
sequência com tolerância (nunca falhar duas vezes), força do hábito (média móvel
exponencial), nível de cor 0 a 4 e agenda por dia da semana.

Testes primeiro, com Vitest, e fast-check para as propriedades: a força fica
entre 0 e 1, a sequência nunca é negativa, mudar a meta de hoje não altera o
resultado de dias passados. Cobertura mínima de 90% neste pacote.
```

## 5. Telas

```
Implemente a camada Dexie (IndexedDB) e as telas Hoje, Grade e Hábitos em apps/web,
seguindo DESIGN.md e a skill constancia-design.
Inclua importação e exportação do JSON, e a importação do formato do habitos.html antigo.
Testes Playwright: registrar um hábito, funcionar offline e voltar, navegar a grade
pelo teclado com aria-label em cada célula.
```

## 6. PWA e fumaça

```
Configure service worker e manifest com vite-plugin-pwa, respeitando BASE_PATH.
Escreva o teste test:e2e:prod: abre BASE_URL, confirma manifest válido, service
worker registrado e a tela Hoje renderizando. É esse teste que protege o deploy.
Rode pnpm verify e faça commit.
```
