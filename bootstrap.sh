#!/usr/bin/env bash
# Constância: cria o repositório, os segredos, as labels, o Pages e a proteção da main.
# Rode uma vez, de dentro da pasta do projeto, com "gh" já autenticado.
set -euo pipefail

REPO="${REPO:-constancia}"
DONO="$(gh api user -q .login)"

echo "==> Conta: $DONO | Repositório: $REPO"

# --- Pré-requisitos -----------------------------------------------------------
for c in gh jq git pnpm node claude; do
  command -v "$c" >/dev/null || { echo "Falta o comando: $c"; exit 1; }
done

# --- Token do Claude Code -----------------------------------------------------
if [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then
  echo
  echo "Rode em outro terminal:  claude setup-token"
  read -rsp "Cole o token do Claude Code: " CLAUDE_CODE_OAUTH_TOKEN; echo
fi

# --- PAT do agente ------------------------------------------------------------
# Necessário porque um PR criado com o GITHUB_TOKEN padrão não dispara outros workflows.
if [ -z "${GH_PAT_AGENTE:-}" ]; then
  echo
  echo "Crie um fine-grained PAT em:"
  echo "  https://github.com/settings/personal-access-tokens/new"
  echo "  Repositório: apenas $REPO"
  echo "  Permissões: Contents (RW), Pull requests (RW), Issues (RW), Workflows (RW)"
  read -rsp "Cole o PAT: " GH_PAT_AGENTE; echo
fi

# --- Repositório --------------------------------------------------------------
# Público de propósito: no plano gratuito do GitHub, proteção de branch e Pages
# só existem em repositório público. O código não guarda nada pessoal.
git rev-parse --git-dir >/dev/null 2>&1 || git init -b main
git add -A 2>/dev/null || true
git diff --cached --quiet 2>/dev/null || git commit -qm "chore: início" || true

if ! gh repo view "$DONO/$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$DONO/$REPO.git"
  git push -u origin main || true
fi

# --- Segredos e variáveis -----------------------------------------------------
gh secret set CLAUDE_CODE_OAUTH_TOKEN -R "$DONO/$REPO" --body "$CLAUDE_CODE_OAUTH_TOKEN"
gh secret set GH_PAT_AGENTE           -R "$DONO/$REPO" --body "$GH_PAT_AGENTE"
gh variable set AUTONOMIA             -R "$DONO/$REPO" --body "on"
gh variable set PROD_URL              -R "$DONO/$REPO" --body "https://$DONO.github.io/$REPO/"

# --- Labels -------------------------------------------------------------------
gh label create aprovado       -R "$DONO/$REPO" -c "0E8A16" -d "Pronto para o construtor" --force
gh label create nivel:A        -R "$DONO/$REPO" -c "C2E0C6" --force
gh label create nivel:B        -R "$DONO/$REPO" -c "FEF2C0" --force
gh label create nivel:C        -R "$DONO/$REPO" -c "F9D0C4" --force
gh label create incidente      -R "$DONO/$REPO" -c "B60205" --force
gh label create feedback       -R "$DONO/$REPO" -c "1D76DB" --force
gh label create precisa-humano -R "$DONO/$REPO" -c "5319E7" --force

# --- Configurações do repositório --------------------------------------------
gh api -X PATCH "repos/$DONO/$REPO" \
  -F allow_auto_merge=true -F delete_branch_on_merge=true \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false >/dev/null

# --- GitHub Pages via Actions -------------------------------------------------
gh api -X POST "repos/$DONO/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$DONO/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || echo "Aviso: ative o Pages em Settings > Pages > Source: GitHub Actions."

# --- Proteção da main ---------------------------------------------------------
# Sem aprovação humana: quem barra são os checks. O revisor é um deles.
gh api -X PUT "repos/$DONO/$REPO/branches/main/protection" --input - <<'JSON' >/dev/null || \
  echo "Aviso: não consegui proteger a main. Confira em Settings > Branches."
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["invariantes", "revisor", "verify"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true
}
JSON

echo
echo "==> Pronto."
echo "    Repositório: https://github.com/$DONO/$REPO"
echo "    App:         https://$DONO.github.io/$REPO/"
echo
echo "    Falta um passo interativo. Dentro do Claude Code, rode:  /install-github-app"
