---
name: constancia-design
description: Aplica a direção visual do Constância (azulejo) e critica a tela por screenshot antes do PR. Use sempre que for criar ou alterar qualquer coisa visível — tela, componente, token, microcopy — ou quando pedirem revisão de design.
---

# Design do Constância

A fonte da verdade é o `DESIGN.md` na raiz, e os valores vivem em `docs/design/tokens.css`.
Esta skill é o resumo operacional e o portão. Em caso de divergência, o `DESIGN.md` vence.

## A regra que sustenta tudo

O conceito é **mosaico**: cada dia cumprido é um ladrilho assentado. O painel de azulejo é o
elemento marcante do app e **tudo o mais fica quieto em volta dele**. Se uma tela ganhou um
segundo elemento gritando, o errado é o segundo elemento.

O nível de um dia é quantos hábitos daquele dia foram cumpridos, de 0 a 4. Ele é codificado
**duas vezes**: pelo esmalte (cor) e pelo motivo (forma). Nunca só pela cor.

| Nível | Esmalte                | Motivo                          |
| ----- | ---------------------- | ------------------------------- |
| 0     | `--vazio`              | nenhum                          |
| 1     | `--n1`                 | ponto                           |
| 2     | `--n2`                 | ponto com quatro cantos         |
| 3     | `--n3`                 | losango com ponto               |
| 4     | `--n4` (esmalte claro) | flor em `--cobalto`, com filete |

O âmbar (`--ambar`) marca o que está **aberto**: hoje, pendente, versão mínima, foco de
teclado. Âmbar nunca significa erro nem culpa.

## Antes de escrever CSS

1. Leia `DESIGN.md`, seções Tokens e Proibições.
2. Abra a tela de referência mais próxima em `docs/design/`: `tela-hoje.html`,
   `tela-grade.html`, `tela-habitos.html`. Copie a estrutura de lá, não invente outra.
3. Todo valor de cor, espaço, raio, tipo e movimento sai de um token. Valor à mão no
   componente é motivo de reprovação, mesmo que a cor esteja certa.

## Proibido

Gradiente decorativo · cartão com sombra difusa · rótulo em caixa alta espaçada · raio acima
de 4px · cor como canal único · animação de entrada por seção · hover animado em tudo ·
skeleton shimmer · fogo, troféu, medalha, confete · texto que culpa o usuário · emoji como
ícone de estado · seta `→` no fim de botão · número sem unidade e sem período · cor nativa do
aparelho · modal para confirmar marcação.

Movimento: existe **um só** no app, o `--assentar`. Se a sua mudança acrescentou um segundo,
tire.

## Microcopy

Frase curta, português simples, o app constata e não anima. Nenhum texto culpa o usuário por
um dia perdido — a regra "nunca falhar duas vezes" existe justamente para isso. Antes de
fechar, passe a microcopy pela skill `humanizar-escrita`.

"Ontem ficou aberto." Não: "Você quebrou sua sequência!".

## Portão: crítica por screenshot

Toda mudança visual tira um screenshot antes do PR:

```bash
pnpm --filter @constancia/web dev
# em outro terminal, com Playwright: viewport 414x896, deviceScaleFactor 2, fullPage
```

Olhe o screenshot e responda às sete. Qualquer "não" trava o PR:

1. O painel continua sendo a coisa mais forte da tela?
2. Algum nível está identificável só pela cor?
3. Existe mais de um movimento na tela?
4. Algum valor está escrito à mão, fora dos tokens?
5. Algum texto culpa o usuário por um dia perdido?
6. Todo alvo de toque tem 44px e foco visível?
7. A tela sobrevive a 320px de largura e a `prefers-reduced-motion`?

Anexe o screenshot ao PR. Sem screenshot, mudança visual não entra.

## Segurança que também é design

Nome de hábito, nota e qualquer texto do usuário são **texto puro**. Nunca viram HTML nem
entram em `style`, `innerHTML` ou `dangerouslySetInnerHTML`. Ver `docs/adr/005-multiusuario.md`.
