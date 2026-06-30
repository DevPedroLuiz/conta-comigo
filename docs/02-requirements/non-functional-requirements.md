# Non-Functional Requirements — Conta Comigo

## Objetivo

Definir requisitos de qualidade do sistema.

---

## Performance

- NFR-001: O sistema deve responder requisições em até 300ms em média.
- NFR-002: Consultas financeiras devem ser otimizadas para alto volume.

---

## Escalabilidade

- NFR-003: O sistema deve suportar crescimento horizontal.
- NFR-004: Serviços devem ser stateless.

---

## Segurança

- NFR-005: Senhas devem ser armazenadas com hashing seguro.
- NFR-006: Todas as comunicações devem ser via HTTPS.
- NFR-007: O sistema deve seguir RBAC.
- NFR-008: Tokens devem ter expiração configurável.

---

## Disponibilidade

- NFR-009: O sistema deve ter alta disponibilidade (≥ 99.5% em produção futura).
- NFR-010: Falhas devem ser tratadas sem derrubar o sistema.

---

## Manutenibilidade

- NFR-011: Código deve seguir Clean Architecture.
- NFR-012: Código deve ser modular.
- NFR-013: Alterações devem ser isoladas por domínio.

---

## Observabilidade

- NFR-014: O sistema deve gerar logs estruturados.
- NFR-015: O sistema deve suportar tracing distribuído.
- NFR-016: O sistema deve expor health checks.

---

## Usabilidade

- NFR-017: Interface deve ser simples e intuitiva.
- NFR-018: Fluxos devem minimizar cliques.

---

## Confiabilidade

- NFR-019: Operações financeiras devem ser atômicas.
- NFR-020: Não pode haver inconsistência de saldo.

---

## Compatibilidade

- NFR-021: APIs devem ser versionadas (/api/v1).
- NFR-022: Frontend deve ser compatível com dispositivos móveis.