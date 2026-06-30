# Business Rules — Conta Comigo

## Objetivo

Este documento define as regras de negócio centrais do sistema.

Todas as implementações devem obedecer estas regras como fonte de verdade.

---

## Usuários

- Um usuário pode ter múltiplas contas financeiras.
- Um usuário pode ser pessoa física ou jurídica.
- Um usuário pode pertencer a múltiplas organizações (futuro).

---

## Transações

- Toda transação deve possuir:
  - valor
  - data
  - categoria
  - tipo (receita ou despesa)

- Transações não podem ser criadas sem uma conta associada.
- Transações influenciam diretamente o saldo da conta.

---

## Contas

- Uma conta representa uma origem de movimentação financeira.
- O saldo de uma conta é sempre calculado com base nas transações.
- O sistema nunca deve permitir saldo inconsistente.

---

## Categorias

- Toda transação deve pertencer a uma categoria.
- Categorias podem ser:
  - padrão do sistema
  - criadas pelo usuário

---

## Transferências

- Transferências são compostas por:
  - débito em uma conta
  - crédito em outra conta

- Transferências não podem ser quebradas ou parcialmente aplicadas.

---

## Cartões

- Um cartão possui limite disponível.
- Compras no cartão afetam o limite imediatamente.
- Parcelamentos devem ser tratados como múltiplas transações futuras.

---

## Fluxo de Caixa

- O fluxo de caixa é sempre derivado das transações.
- Não existe edição direta do fluxo de caixa.

---

## Exclusão de Dados

- Transações não devem ser apagadas fisicamente por padrão.
- Deve-se utilizar soft delete quando necessário.
- Toda exclusão deve ser auditável.

---

## Auditoria

- Toda ação financeira relevante deve ser registrada.
- Logs devem ser imutáveis.

---

## Consistência

- O sistema nunca pode exibir saldo incorreto.
- Operações financeiras devem ser atômicas.

---

## Regras de IA

- A IA nunca pode executar ações financeiras sem confirmação do usuário.
- Sugestões não têm efeito automático no sistema.

---

## Prioridade das Regras

Em caso de conflito:

1. Business Rules (este documento)
2. Architecture.md
3. Código da aplicação