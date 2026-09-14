# Autonomia do Constância

Arquivo protegido pelo check `invariantes`. Só um commit seu altera.

## Malha

| Etapa | Quem | Gatilho |
|---|---|---|
| Decidir e abrir issue já aprovada | 00 planejador | Segunda e quinta |
| Implementar e abrir PR | 01 construtor | Label `aprovado` |
| Verificar, revisar, checar invariantes | 02 checks | Todo PR |
| Corrigir o que falhou | 03 corretor | Checks vermelhos |
| Fazer merge | 04 merge | Checks verdes |
| Publicar no GitHub Pages e testar | 05 deploy | Push na main |
| Reverter se quebrou | 05 deploy | Fumaça falhou |
| Suspender a autonomia | 06 sentinela | Reversão acima de 10% |

Nenhuma etapa espera por você.

## Revisor é check, não aprovação

O GitHub proíbe aprovar o próprio PR, mas não proíbe um workflow reprovar. Por isso
o revisor é um check obrigatório que sai com erro quando acha problema. Isso elimina
a necessidade de uma segunda conta.

## Invariantes

O check `invariantes` reprova o PR que:

1. toque em `.github/workflows/`, `.claude/settings.json`, `.claude/hooks/`,
   `docs/AUTONOMIA.md`, `scripts/orcamento.sh` ou `bootstrap.sh`;
2. aumente a quantidade de testes em `skip` ou `todo`.

Um sistema que reescreve as próprias regras não tem regra nenhuma. Esse é o limite.

## Níveis

Não mudam quem faz merge, e sim o rigor da revisão.

| Nível | Exemplos |
|---|---|
| A | Texto, docs, teste, dependência patch |
| B | Funcionalidade, tela |
| C | `packages/domain`, armazenamento, service worker |

## Botão de parada

```
gh variable set AUTONOMIA --body off
gh variable set AUTONOMIA --body on
```

## Por que o repositório é público

No plano gratuito do GitHub, proteção de branch e GitHub Pages só existem em
repositório público. Como nenhum dado pessoal vive no repositório (os hábitos
ficam no IndexedDB do seu aparelho), público é a escolha certa e sem custo.
Se preferir privado, o GitHub Pro resolve, por cerca de US$ 4 por mês.

## Backup

Os dados são seus e ficam no aparelho. Exporte o JSON pela tela de Backup e guarde
numa pasta que você já sincroniza. Limpar os dados do navegador apaga tudo.
