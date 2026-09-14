---
status: aceito
data: 2026-09-14
decisores: Marcos
---

# ADR-001: O aparelho é a fonte de verdade

## Contexto e problema

Registrar um hábito precisa custar até dois toques e menos de cinco segundos. Uma
ida ao servidor no caminho do registro coloca a latência da rede entre a intenção e
o feedback, e transforma "estou no metrô sem sinal" em "não consegui registrar".

O antipadrão a evitar é conhecido: quando o registro falha ou demora, o usuário para
de registrar, e um app de hábitos que não é usado não tem função.

## Fatores de decisão

- Registro instantâneo, sem esperar a rede
- Funcionar offline por completo, não de forma degradada
- Um usuário, um aparelho por vez (ver ADR-005)
- Custo mensal zero

## Opções consideradas

1. **IndexedDB como fonte de verdade, sem servidor**
2. Servidor como fonte de verdade, com cache local de leitura
3. IndexedDB como fonte de verdade, com sincronização para a nuvem (ADR-006)

## Decisão

Opção 1. O IndexedDB, via Dexie, é a única fonte de verdade. Não existe servidor.

A interface lê e escreve direto no banco local. Toda função de leitura é síncrona
do ponto de vista do usuário: não há estado de carregamento no caminho do registro.

O backup é responsabilidade explícita do usuário: exportação de JSON pela tela de
Backup, guardada numa pasta que ele já sincroniza.

### Consequências

Boas:

- O registro responde em tempo de quadro, não em tempo de rede
- O app inteiro funciona em modo avião
- Sem servidor não há conta, senha, vazamento de banco nem custo mensal
- A superfície de ataque cai para o que roda no próprio navegador

Ruins, e aceitas:

- **Limpar os dados do navegador apaga tudo.** Não há cópia remota. O onboarding
  precisa dizer isso com todas as letras, e a exportação precisa ser fácil
- Um aparelho por vez. Usar no celular e no desktop exige exportar e importar
- O armazenamento do navegador pode ser despejado sob pressão de disco. Mitigação:
  pedir `navigator.storage.persist()` na primeira visita

## Prós e contras das opções

**Opção 2 (servidor como fonte de verdade).** Resolveria o multi-aparelho e o backup
de graça. Reprovada porque coloca a rede no caminho crítico do registro, que é a
única coisa que o app precisa fazer bem.

**Opção 3 (local-first com sincronização).** É o plano de longo prazo e continua
válido. Adiada no ADR-006: sincronização é um problema caro, e não há segundo
aparelho para justificar o custo hoje.
