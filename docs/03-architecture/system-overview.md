# System Overview — Conta Comigo

## Visão Técnica

O Conta Comigo será implementado como um **Monólito Modular Evolutivo**, organizado por domínios independentes.

Cada domínio possui:

- regras próprias
- entidades próprias
- casos de uso próprios
- repositórios isolados
- comunicação indireta via eventos

---

## Arquitetura Base

```text
Client (Web / Mobile)
        ↓
API Layer (NestJS)
        ↓
Application Layer (Use Cases)
        ↓
Domain Layer (Business Rules)
        ↓
Infrastructure Layer (DB / External Services)

---

# 📄 data-model.md

```markdown id="cc-data-model"
# Data Model — Conta Comigo

## Entidades Principais

---

## User

- id (UUID)
- name
- email
- password_hash
- created_at
- updated_at

---

## Account

- id (UUID)
- user_id (FK)
- name
- type (checking | savings | investment)
- balance (derived)
- created_at

---

## Transaction

- id (UUID)
- account_id (FK)
- type (income | expense)
- amount
- category_id (FK)
- description
- date
- deleted_at (soft delete)
- created_at

---

## Category

- id (UUID)
- user_id (nullable)
- name
- type (income | expense)
- is_system

---

## Transfer

- id (UUID)
- from_account_id
- to_account_id
- amount
- date
- created_at

---

## Card

- id (UUID)
- user_id
- name
- limit
- available_limit
- closing_day
- due_day

---

## CardTransaction

- id (UUID)
- card_id
- amount
- description
- installment_count
- current_installment
- date

---

## AuditLog

- id (UUID)
- user_id
- action
- entity
- entity_id
- metadata (JSON)
- created_at