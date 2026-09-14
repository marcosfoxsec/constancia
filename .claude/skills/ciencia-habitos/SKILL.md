---
name: ciencia-habitos
description: Fichas dos métodos de formação de hábito que sustentam o Constância. Use ao propor, revisar ou recusar qualquer funcionalidade de produto, e ao escrever o corpo de um PR — toda funcionalidade precisa citar um método daqui.
---

# Ciência de hábitos

Regra do projeto: **toda funcionalidade cita pelo menos um método desta ficha no PR.**
Funcionalidade sem base não entra. A fonte é a Seção 2 do `docs/PLANO.md`.

## Os dez métodos

| Método                     | Ideia central                                                              | Base                                                         | Como vira funcionalidade                                                |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Intenções de implementação | "Quando X acontecer, farei Y"                                              | Gollwitzer e Sheeran (2006), 94 estudos, d = 0,65            | Todo hábito tem gatilho "quando e onde". O lembrete dispara no gatilho  |
| Empilhamento de hábitos    | Ancorar o novo hábito em um que já existe                                  | Clear, _Hábitos Atômicos_, derivado de Fogg                  | Campo "depois de...". Ao marcar a âncora, o app sugere o próximo        |
| Tiny Habits (B = MAP)      | Comportamento acontece quando motivação, capacidade e gatilho se encontram | Fogg, _Tiny Habits_ (2019)                                   | Cada hábito tem versão mínima. Ela mantém a sequência                   |
| Tempo real de formação     | Automaticidade leva 66 dias em média, faixa de 18 a 254                    | Lally et al. (2010), _Eur. J. Social Psychology_             | Marco dos 66 dias no lugar de "21 dias". Sequência com tolerância       |
| Nunca falhar duas vezes    | Uma falha é acidente, duas é um novo padrão                                | Clear                                                        | A sequência só quebra com duas faltas seguidas. Resgate no dia seguinte |
| WOOP / contraste mental    | Desejo, Resultado, Obstáculo, Plano                                        | Oettingen, _Rethinking Positive Thinking_ (2014)             | Criação de hábito em 4 passos. O obstáculo vira um plano "se... então"  |
| Efeito recomeço            | Marcos temporais aumentam a motivação                                      | Dai, Milkman e Riis (2014), _Management Science_             | Sugestão de recomeço e revisão em datas-marco                           |
| Hábitos por identidade     | Cada registro é um voto no tipo de pessoa que você quer ser                | Clear                                                        | Hábitos agrupados por identidade. Contagem de votos                     |
| Automonitoramento          | Monitorar o progresso aumenta a chance de atingir a meta                   | Harkin et al. (2016), _Psychological Bulletin_, meta-análise | A grade, as estatísticas e a revisão semanal                            |
| Revisão periódica          | Olhar a semana, ajustar, replanejar                                        | Ciclo PDCA                                                   | Revisão guiada de 5 minutos aos domingos                                |

## O antipadrão

**Ansiedade de sequência.** Contador que zera por um deslize gera abandono. A tolerância da
regra "nunca falhar duas vezes" e a versão mínima existem exatamente para isso.

Na prática, isso proíbe:

- zerar qualquer contador por uma única falta;
- linguagem de perda ("você perdeu", "sequência quebrada", "não desista");
- notificação de cobrança no dia seguinte à falta — o que existe é resgate, e ele oferece a
  versão mínima;
- ranking, competição ou comparação com outras pessoas.

## Como usar esta skill

**Ao propor.** Diga em uma linha qual método a funcionalidade serve e como. Se você não
consegue escrever essa linha, a funcionalidade não está pronta para virar issue.

**Ao recusar.** Se a ideia não encosta em nenhum método, diga isso e proponha a versão mais
próxima que encosta. Exemplo: "pontos e nível de RPG" não tem base aqui e ainda cai no
antipadrão; o que tem base é a contagem de votos por identidade.

**No PR.** Inclua a seção:

```
Método: Tiny Habits (B = MAP), Fogg (2019).
Como: a tela Hoje passa a oferecer a versão mínima quando o dia anterior ficou aberto.
```

**Na microcopy.** O texto que acompanha uma funcionalidade carrega o método. "Mínimo: 1
página" é Tiny Habits aparecendo na interface. Revise com a skill `humanizar-escrita` e com
a `constancia-design`.

## Limite

Estas fichas são resumo de literatura, não prescrição clínica. O app não diagnostica, não
trata e não fala sobre saúde mental. Quando uma ideia pedir isso, recuse e explique o limite.
