# Design do Constância

Direção escolhida na Fase 0: **azulejo**. As outras duas propostas ficam em
`docs/design/direcao-1-musgo.html` e `docs/design/direcao-3-biscoito.html` como registro
da decisão.

## Conceito

Cada dia cumprido é um ladrilho assentado. Um mês bem feito forma um painel. A grade é o
elemento marcante do app e todo o resto fica quieto em volta dela.

O painel é um azulejo: fundo azul-tinta, esmalte que clareia conforme o dia se completa e
um motivo pintado em cobalto. O nível de um dia é **quantos hábitos daquele dia foram
cumpridos**, de 0 a 4.

Duas consequências práticas dessa escolha:

1. **O nível nunca depende só da cor.** Cada nível tem um motivo próprio — ponto, ponto com
   cantos, losango, flor. Quem não distingue azuis lê o painel pelo desenho.
2. **Azul e âmbar já são a paleta segura para daltonismo.** O plano previa uma paleta
   alternativa; aqui ela é a paleta principal e não existe uma segunda.

O âmbar marca o que está **aberto**, nunca o que falhou.

## Tokens

A fonte dos valores é `docs/design/tokens.css`. O `packages/ui` reexporta os mesmos nomes.
Nenhum valor de cor, espaço ou raio entra no código fora desses tokens.

### Cor

| Token          | Valor     | Uso                                            |
| -------------- | --------- | ---------------------------------------------- |
| `--tinta`      | `#101c2e` | fundo do app                                   |
| `--barro`      | `#0b1422` | fundo do painel de azulejo                     |
| `--superficie` | `#142338` | cartão, linha de hábito                        |
| `--linha`      | `#1f3149` | divisória de 1px                               |
| `--vazio`      | `#18293f` | nível 0, ladrilho sem esmalte                  |
| `--n1`         | `#26538f` | nível 1                                        |
| `--n2`         | `#2a63b4` | nível 2                                        |
| `--n3`         | `#6e9fdf` | nível 3, barra de força, agenda ativa          |
| `--n4`         | `#dfeaf7` | nível 4, esmalte claro; também a ação primária |
| `--cobalto`    | `#1b4fa8` | o motivo pintado sobre o esmalte claro         |
| `--ambar`      | `#e2a33c` | hoje, pendente, versão mínima, foco            |
| `--texto`      | `#e6ecf4` | 14,4:1 sobre `--tinta`                         |
| `--texto-2`    | `#8ba0bb` | 6,4:1 sobre `--tinta`, 5,9:1 sobre superfície  |

Contrastes medidos: `--ambar` sobre `--tinta` 7,8:1; `--cobalto` sobre `--n4` 6,3:1. Todos
passam WCAG 2.2 AA para texto normal. Os níveis 1 e 2 têm baixo contraste contra o fundo de
propósito: quem carrega a informação ali é o motivo, e o motivo é branco a 80% sobre o
esmalte.

### Tipografia

| Papel   | Família                                           | Onde                                    |
| ------- | ------------------------------------------------- | --------------------------------------- |
| Display | Bricolage Grotesque, `wdth` 75–85, `wght` 500–800 | títulos, números, rótulos de dia, `kbd` |
| Corpo   | Atkinson Hyperlegible, 400 e 700                  | todo o resto                            |

Escala: `--t-titulo` 30, `--t-secao` 20, `--t-item` 17, `--t-corpo` 15, `--t-apoio` 13,
`--t-micro` 10. Entrelinha 1,25 em títulos e 1,45 a 1,5 em texto corrido. Linha de no máximo
70 caracteres.

A Bricolage estreitada dá o peso de placa cerâmica. Ela não desce para o corpo do texto.

### Espaço, raio e movimento

Espaço em base 4: `--e1` 4, `--e2` 8, `--e3` 12, `--e4` 16, `--e6` 24, `--e8` 32.

Raio: `--r-ladrilho` 2px, `--r-cartao` 3px, `--r-painel` 4px. O ladrilho é quase reto.

Movimento: existe **um só**, o token `--assentar`, 320ms `cubic-bezier(.2,.9,.3,1.2)`, usado
quando um ladrilho é assentado. `prefers-reduced-motion` reduz esse token a 1ms e nada mais
no app precisa saber disso.

Alvo de toque: `--alvo`, 44px. Registrar um hábito são dois toques, sem diálogo de
confirmação.

## Proibições visuais

Não entra no Constância:

1. **Gradiente decorativo.** O único degradê é o do esmalte dentro do motivo.
2. **Cartão genérico com sombra difusa.** Separação é por superfície e linha de 1px.
3. **Rótulo em caixa alta espaçada** acima de um título.
4. **Raio grande.** Nada acima de 4px. Ladrilho arredondado deixa de ser ladrilho.
5. **Cor como canal único.** Todo nível também tem motivo ou forma.
6. **Animação de entrada por seção**, transição em todo hover, _skeleton shimmer_. A tela é
   local e carrega em milissegundos.
7. **Ícone de fogo, troféu, medalha, confete.** Nenhuma gamificação.
8. **Texto que culpa.** "Você perdeu", "não desista", "sequência zerada". Um dia aberto é um
   dia aberto.
9. **Emoji como ícone de estado.**
10. **Seta `→` no fim de botão.** O texto do botão diz a ação: "Exportar JSON".
11. **Número sem unidade e sem período.** "43" sozinho não informa nada.
12. **Cor nativa do aparelho** (azul do iOS, roxo do Material). Tudo vem dos tokens.
13. **Modal para confirmar marcação.**
14. **Nada do usuário virando HTML ou CSS.** Nome de hábito e nota são texto puro, sempre.

## Voz

Português simples, frase curta, sem tom motivacional. O app constata, não anima.

| Em vez de                           | Escreva                                     |
| ----------------------------------- | ------------------------------------------- |
| "Você quebrou sua sequência!"       | "Ontem ficou aberto."                       |
| "Continue assim, você consegue!"    | "43 dias assentados em 49."                 |
| "Ops, algo deu errado"              | "O arquivo não é um JSON do Constância."    |
| "Nenhum hábito cadastrado ainda 😴" | "Comece pelo hábito que você já quase faz." |

Erro diz o que houve e o que fazer. Tela vazia é convite, não humor.

## Telas de referência

Três telas estáticas, em `docs/design/`, abertas direto no navegador e clicáveis. São elas
que a skill `constancia-design` usa como gabarito.

| Tela    | Arquivo             | O que ela prova                                                                              |
| ------- | ------------------- | -------------------------------------------------------------------------------------------- |
| Hoje    | `tela-hoje.html`    | o painel como herói, o motivo fantasma em âmbar no hábito pendente, o recado sem culpa       |
| Grade   | `tela-grade.html`   | mês cheio, navegação por teclado com `aria-label` por célula, legenda dos motivos, números   |
| Hábitos | `tela-habitos.html` | agrupamento por identidade, gatilho "quando e onde", versão mínima, agenda semanal, exportar |

Screenshots correspondentes: `tela-hoje.png`, `tela-grade.png`, `tela-habitos.png`, em
414×896 com escala 2.

## Crítica por screenshot

Toda mudança visual tira um screenshot com Playwright antes do PR e responde a estas sete
perguntas. Uma resposta "não" trava o PR.

1. O painel de azulejo continua sendo a coisa mais forte da tela?
2. Algum nível está identificável só pela cor?
3. Existe mais de um movimento na tela?
4. Algum valor de cor, espaço ou raio está escrito à mão, fora dos tokens?
5. Algum texto culpa o usuário por um dia perdido?
6. Todo alvo de toque tem 44px e foco visível?
7. A tela sobrevive a 320px de largura e a `prefers-reduced-motion`?
