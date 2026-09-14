#!/usr/bin/env bash
# Hook PreToolUse: segunda camada de proteção dos arquivos que governam os agentes.
# Primeira camada: regras "ask" do settings.json.
# Camada definitiva: CODEOWNERS + branch protection no GitHub.
set -uo pipefail

caminho="$(jq -r '.tool_input.file_path // ""')"
[ -z "$caminho" ] && exit 0

# Em sessão interativa sua, libere com: export CONSTANCIA_GUARDRAIL_EDIT=1
[ "${CONSTANCIA_GUARDRAIL_EDIT:-0}" = "1" ] && exit 0

rel="${caminho#"${CLAUDE_PROJECT_DIR:-$PWD}"/}"
case "$rel" in
  .claude/*|.github/*|CLAUDE.md|docs/AUTONOMIA.md|supabase/migrations/*|.env*)
    jq -n --arg r "Caminho protegido ($rel). Agentes não alteram as próprias regras. Abra uma issue descrevendo a mudança." \
      '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
    ;;
esac
exit 0
