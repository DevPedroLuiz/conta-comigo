# API Contract — Conta Comigo

## Base URL

---

## Auth

### POST /auth/register
Cria usuário

### POST /auth/login
Autentica usuário

### POST /auth/refresh
Renova token

---

## Users

### GET /users/me
Retorna usuário logado

### PUT /users/me
Atualiza perfil

---

## Accounts

### GET /accounts
Lista contas

### POST /accounts
Cria conta

### GET /accounts/:id
Detalha conta

### PUT /accounts/:id
Atualiza conta

---

## Transactions

### GET /transactions
Lista transações

### POST /transactions
Cria transação

### PUT /transactions/:id
Atualiza transação

### DELETE /transactions/:id
Remove transação (soft delete)

---

## Transfers

### POST /transfers
Cria transferência

---

## Categories

### GET /categories
Lista categorias

### POST /categories
Cria categoria

---

## Cards

### GET /cards
Lista cartões

### POST /cards
Cria cartão

### POST /cards/transactions
Cria transação no cartão

---

## Reports

### GET /reports/summary
Resumo financeiro

### GET /reports/cashflow
Fluxo de caixa