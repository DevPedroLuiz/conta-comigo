# Event System — Conta Comigo

## Modelo

O sistema utiliza eventos internos para desacoplamento entre módulos.

---

## Tipos de Eventos

### Domain Events

Eventos gerados dentro do domínio.

Exemplo:

- TransactionCreated
- AccountUpdated
- TransferCompleted

---

### Application Events

Eventos emitidos pela camada de aplicação.

Exemplo:

- GenerateReportRequested
- NotifyUserRequested

---

## Eventos Principais

---

### TransactionCreated

Disparado quando uma transação é criada.

Consumidores:

- Account Service (recalcular saldo)
- Report Service (atualizar métricas)
- AI Service (análise)

---

### TransferCompleted

Disparado após transferência concluída.

Consumidores:

- Audit Service
- Notification Service

---

### CardTransactionCreated

Disparado quando compra no cartão ocorre.

Consumidores:

- Limit Service
- Notification Service

---

## Garantias

- Eventos são assíncronos
- Eventos não bloqueiam requisições HTTP
- Eventos devem ser idempotentes
- Falhas devem ser reprocessáveis

---

## Infraestrutura

- Broker: RabbitMQ
- Alternativa futura: Kafka

---

## Estratégia

- Eventual Consistency
- Retry automático
- Dead Letter Queue (DLQ)