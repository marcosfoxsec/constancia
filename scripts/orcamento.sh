#!/usr/bin/env bash
# Trava de custo e de volume. Roda antes de qualquer agente que gasta token.
set -euo pipefail

TETO_PR_DIA="${TETO_PR_DIA:-4}"
TETO_PR_ABERTOS="${TETO_PR_ABERTOS:-3}"

hoje="$(date -u +%Y-%m-%d)"
criados="$(gh pr list --state all --search "created:$hoje head:claude/" --limit 50 --json number -q 'length')"
abertos="$(gh pr list --state open --search "head:claude/" --limit 50 --json number -q 'length')"

echo "PRs criados hoje: $criados (teto $TETO_PR_DIA) | abertos: $abertos (teto $TETO_PR_ABERTOS)"

if [ "$criados" -ge "$TETO_PR_DIA" ]; then
  echo "::error::Teto diário de PRs atingido. Parando para não gastar token à toa."
  exit 1
fi
if [ "$abertos" -ge "$TETO_PR_ABERTOS" ]; then
  echo "::error::PRs abertos demais. Feche a fila antes de abrir mais."
  exit 1
fi
