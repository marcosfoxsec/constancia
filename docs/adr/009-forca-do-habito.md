---
status: aceito
data: 2026-09-14
decisores: Marcos
---

# ADR-009: Força do hábito como média móvel exponencial

## Contexto e problema

A sequência responde "há quantos dias você não falha". É uma boa medida para hoje e
uma medida ruim para o mês: ela não distingue quem cumpre 90% dos dias de quem
cumpre 40%, e qualquer regra de quebra a torna frágil justamente para quem mais
precisa de uma leitura estável.

O automonitoramento aumenta a chance de atingir a meta (Harkin et al., 2016), mas só
se o número mostrado for honesto. Falta uma medida que suba devagar, caia devagar e
não dependa de o usuário ter acertado ontem.

## Fatores de decisão

- Tem que responder "quão firme está o hábito agora", não "quantos dias seguidos"
- Não pode oscilar com um dia isolado, em nenhuma das duas direções
- Tem que ser calculável no aparelho, em memória, para anos de histórico
- Nenhum código GPL entra no repositório, nem adaptado (ver `CLAUDE.md`)

## Opções consideradas

1. **Média móvel exponencial com meia-vida de 30 dias agendados**
2. Taxa de cumprimento em janela fixa de 30 dias
3. Nenhuma medida além da sequência

## Decisão

Opção 1. A força é um número entre 0 e 1, atualizado dia agendado a dia agendado:

```
forca ← forca + α · (peso_do_dia − forca)
α = 1 − 0,5^(1/30)
```

O peso do dia é 1 para cumprido, 0,5 para a versão mínima e 0 para aberto. Dia de
folga não entra na conta: não fazer um hábito num dia em que ele não é cobrado não
enfraquece nada. O dia de hoje, enquanto está aberto, também não entra — o dia não
acabou, e punir o usuário às 9h da manhã seria ansiedade de sequência com outro
nome.

A meia-vida de 30 dias agendados vem do tempo real de formação de hábito: 66 dias em
média, com faixa de 18 a 254 (Lally et al., 2010). Com essa constante, um hábito
cumprido todos os dias passa de 0,5 em torno do trigésimo dia e chega perto de 1 no
fim do segundo mês, o que põe o número na mesma escala do processo que ele mede.

**Licença.** Que existe uma métrica de força do hábito além da sequência é ideia
pública, e o Loop Habit Tracker é um exemplo conhecido dela. O Loop é GPL-3.0 e este
repositório não é: nenhuma linha, constante ou fórmula foi lida ou traduzida de lá. A
implementação em `packages/domain/src/forca.ts` foi escrita a partir desta
especificação.

### Consequências

Boas:

- Um dia isolado mexe pouco, o mês inteiro mexe muito. É o oposto da sequência, e as
  duas medidas juntas contam a história certa
- Custo O(dias) e estado de um número só; não precisa guardar janela nem recalcular
  o passado
- A versão mínima valendo meio ponto dá ao Tiny Habits um efeito mensurável, e não só
  simbólico

Ruins, e aceitas:

- O número não tem interpretação direta ("0,78" não é "78% dos dias"). A interface
  mostra a barra e o período, nunca o número sozinho
- Mudar α muda o histórico exibido, porque a força é sempre recalculada do zero.
  Trocar a constante é mudança de produto, não ajuste de implementação
- Hábito com agenda rala demora mais em dias corridos para ganhar força, porque a
  meia-vida conta dias agendados. É o comportamento correto, e surpreende na primeira
  leitura
