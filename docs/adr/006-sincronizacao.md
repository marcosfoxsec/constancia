---
status: adiado
data: 2026-09-14
decisores: Marcos
---

# ADR-006: Sincronização adiada, exportação no lugar

## Contexto e problema

A Seção 15.3 do plano propõe uma fila de saída própria, com "último que escreve vence"
por célula, e lista RxDB e PowerSync como planos B e C.

A pergunta que importa não é qual motor escolher. É se vale sincronizar agora. Com um
aparelho, sincronização não transporta dado nenhum: só adiciona um servidor, uma
conta, uma fila, um caminho de erro offline e uma classe inteira de bugs difíceis de
reproduzir.

Mas o ADR-001 deixou dois buracos reais: limpar os dados do navegador apaga tudo, e
não há como usar o app no celular e no desktop.

## Fatores de decisão

- Um aparelho por vez é a premissa atual, não uma limitação a contornar
- Perder os dados é o pior resultado possível para um app de hábitos
- Custo mensal zero
- Cada dependência nova precisa se pagar

## Opções consideradas

1. **Exportação e importação manual de JSON**
2. Fila de saída própria contra um servidor (a proposta do plano)
3. RxDB com plugin de replicação
4. PowerSync

## Decisão

Opção 1 por enquanto. A exportação de JSON é a estratégia de backup e de
transferência entre aparelhos. A opção 2 continua sendo a escolha preferida para
quando a sincronização entrar.

Para que a opção 1 seja suficiente, e não uma desculpa:

- O JSON é legível e estável, com versão de esquema. É o formato de backup **e** o de
  transferência, não dois formatos diferentes
- A importação é idempotente pela regra do ADR-004: reimportar não duplica nem perde
- A tela de Backup lembra de exportar quando faz tempo demais desde a última vez
- O onboarding diz, sem rodeio, que limpar os dados do navegador apaga tudo

### Consequências

Boas:

- Zero servidor, zero conta, zero custo, zero superfície de rede
- O backup é um arquivo que o usuário entende, guarda onde quiser e lê sem o app
- A regra de conflito do ADR-004 já é exercitada pela importação, então a parte mais
  sutil da sincronização futura nasce testada

Ruins, e aceitas:

- **O backup depende de disciplina.** Um lembrete ajuda, mas quem não exportar e
  limpar o navegador perde tudo. É o risco central desta decisão
- Trocar de aparelho é exportar, transferir, importar. Aceitável para um evento raro
- Duas cópias podem divergir se as duas forem editadas entre exportações. O
  "último que escreve vence" por célula resolve na importação, sem avisar

## Critério de escolha, quando a sincronização entrar

Adotar a opção 2 (fila própria), a menos que surja uma **entidade editável em mais de
um aparelho ao mesmo tempo com campos múltiplos**. O modelo do ADR-004 — célula com
valor único — torna a fila própria pequena o bastante para não justificar uma
dependência. Se esse critério cair, reavaliar RxDB e PowerSync.

Confirmar a licença antes de adotar qualquer um dos dois: o PowerSync é FSL, o que
precisa ser compatível com este repositório (ver a regra de licença no `CLAUDE.md`).
