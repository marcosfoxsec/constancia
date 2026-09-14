# Roadmap do Constância

O planejador lê este arquivo. Editar aqui é sua forma de dirigir o produto.

Quando este arquivo e o `docs/PLANO.md` divergirem, este vence.

## Agora

- [ ] Núcleo local: domínio testado, telas Hoje, Grade e Hábitos, Dexie, PWA
- [ ] `packages/domain`: sequência com tolerância, força do hábito, nível 0 a 4,
      agenda por dia da semana. Cobertura de 90% ou mais
- [ ] `DESIGN.md` com tokens e proibições visuais, e a skill `constancia-design`
- [ ] Importação do formato do `habitos.html` antigo e exportação de JSON
- [ ] Grade navegável por teclado, com `aria-label` por célula
- [ ] Fumaça de produção: manifest válido, service worker registrado, tela Hoje

## Depois

- [ ] Método: WOOP na criação, versão mínima, gatilho "quando e onde", identidades
- [ ] Revisão semanal guiada, com sugestões vindas de regras
- [ ] Hábitos negativos (evitar): o dia cumprido é o dia sem registro
- [ ] Lembrete pelo alarme nativo: o app gera o texto e o horário para você cadastrar
- [ ] Marco dos 66 dias e sugestão de recomeço em datas-marco
- [ ] Experimentos N-de-1: alternar semanas A/B e comparar a taxa de cumprimento

## Não fazer

- Backend, login, sincronização em nuvem
- Web Push e dispatcher agendado
- Gamificação de RPG, social, ranking
- Qualquer tela que dependa de rede para registrar um hábito
- Contador que zera por um deslize. A tolerância existe para isso
- Código GPL do Loop ou do Habitica no repositório, nem adaptado. Só as ideias
