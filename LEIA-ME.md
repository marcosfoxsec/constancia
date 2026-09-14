# Kit pessoal do Constância

Escala pessoal: um usuário, um aparelho por vez, duas contas (GitHub e Claude),
zero custo mensal. Sem Supabase, sem Cloudflare, sem login, sem backend.

## Ordem

1. `bash bootstrap.sh` cria o repositório, segredos, labels, Pages e proteção da main.
2. Dentro do Claude Code: `/install-github-app`.
3. Siga o `PROMPT-MESTRE.md`, bloco por bloco.
4. Quando `pnpm verify` passar, commite o kit e force o primeiro ciclo.

## Arquivos

| Arquivo | Função |
|---|---|
| `bootstrap.sh` | Toda a configuração do GitHub, em um comando |
| `PROMPT-MESTRE.md` | Os seis prompts que constroem o app |
| `.claude/` | Permissões, hooks, skill e subagentes |
| `.github/workflows/` | Planejador, construtor, checks, corretor, merge, deploy, sentinela |
| `docs/AUTONOMIA.md` | A política. Protegida |
| `docs/ROADMAP.md` | Sua alavanca de direção |
| `scripts/orcamento.sh` | Teto de PRs por dia e de fila |

Copie também o `PLANO_Constancia.md` para `docs/PLANO.md`.
