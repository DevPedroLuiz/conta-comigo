# Use Cases — Conta Comigo

## UC-001 — Criar Usuário

**Ator:** Usuário

**Fluxo:**
1. Usuário informa dados de cadastro.
2. Sistema valida informações.
3. Sistema cria usuário.
4. Sistema retorna confirmação.

---

## UC-002 — Login

**Ator:** Usuário

**Fluxo:**
1. Usuário informa e-mail e senha.
2. Sistema valida credenciais.
3. Sistema gera JWT + Refresh Token.
4. Sistema retorna sessão.

---

## UC-003 — Criar Conta Financeira

**Ator:** Usuário autenticado

**Fluxo:**
1. Usuário envia dados da conta.
2. Sistema valida dados.
3. Sistema cria conta.
4. Conta fica disponível no dashboard.

---

## UC-004 — Criar Transação

**Ator:** Usuário autenticado

**Fluxo:**
1. Usuário informa valor, tipo e categoria.
2. Sistema valida dados.
3. Sistema registra transação.
4. Sistema recalcula saldo.

---

## UC-005 — Transferência entre Contas

**Ator:** Usuário autenticado

**Fluxo:**
1. Usuário seleciona conta origem e destino.
2. Sistema valida saldo.
3. Sistema debita origem.
4. Sistema credita destino.
5. Sistema registra operação.

---

## UC-006 — Criar Cartão

**Ator:** Usuário autenticado

**Fluxo:**
1. Usuário cadastra cartão.
2. Sistema valida limite.
3. Sistema salva cartão.

---

## UC-007 — Registrar Compra no Cartão

**Ator:** Usuário autenticado

**Fluxo:**
1. Usuário registra compra.
2. Sistema valida limite disponível.
3. Sistema cria transação parcelada (se necessário).

---

## UC-008 — Gerar Fluxo de Caixa

**Ator:** Sistema

**Fluxo:**
1. Sistema coleta transações.
2. Sistema agrupa por período.
3. Sistema gera visão consolidada.

---

## UC-009 — IA Financeira (Sugestão)

**Ator:** Sistema / IA

**Fluxo:**
1. Sistema analisa transações.
2. IA identifica padrões.
3. IA gera sugestões.
4. Usuário decide se aplica.

---

## UC-010 — Exportar Relatório

**Ator:** Usuário

**Fluxo:**
1. Usuário solicita relatório.
2. Sistema gera dados.
3. Sistema exporta PDF ou Excel.
4. Usuário faz download.