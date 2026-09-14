#!/usr/bin/env bash
# Hook Stop: o Claude só encerra o turno se "pnpm verify" passar.
# Exit 2 bloqueia o encerramento e devolve o erro ao Claude.
# Exit 1 NÃO bloqueia. Por isso este script só usa 0 ou 2.
set -uo pipefail

input="$(cat)"
session="$(jq -r '.session_id // "sem-sessao"' <<<"$input")"
contador="${TMPDIR:-/tmp}/constancia-verify-${session}"
tentativa=$(( $(cat "$contador" 2>/dev/null || echo 0) + 1 ))
echo "$tentativa" > "$contador"

# Nada mudou em relação à main: não há o que verificar.
base="$(git merge-base HEAD origin/main 2>/dev/null || echo HEAD)"
if git diff --quiet "$base" -- . 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  rm -f "$contador"
  exit 0
fi

if saida="$(pnpm --silent verify 2>&1)"; then
  rm -f "$contador"
  exit 0
fi

# Limite de tentativas para evitar laço infinito e gasto de tokens.
if [ "$tentativa" -ge 5 ]; then
  rm -f "$contador"
  jq -n '{systemMessage: "pnpm verify falhou 5 vezes seguidas. Parado para revisão humana."}'
  exit 0
fi

{
  echo "pnpm verify falhou (tentativa $tentativa de 5). Corrija antes de encerrar."
  echo "Últimas linhas:"
  echo "$saida" | tail -n 60
} >&2
exit 2
