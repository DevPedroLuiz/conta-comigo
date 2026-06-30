# ARCHITECTURE.md

# Arquitetura do Projeto Conta Comigo

> Documento oficial da arquitetura de software do projeto.

**Versão:** 1.0.0

---

# Objetivo

Este documento define a arquitetura oficial do sistema **Conta Comigo**.

Todas as decisões técnicas deverão seguir os princípios estabelecidos aqui.

Os objetivos principais são:

* Escalabilidade
* Segurança
* Facilidade de manutenção
* Alta disponibilidade
* Baixo acoplamento
* Alta coesão
* Evolução contínua

---

# Visão Geral

O Conta Comigo será desenvolvido como um **Monorepo Modular**, permitindo evolução gradual.

Durante o MVP a aplicação poderá ser executada como um monólito modular.

À medida que o sistema crescer, cada módulo poderá ser extraído para um microsserviço sem necessidade de reescrita da lógica de negócio.

Essa estratégia reduz a complexidade inicial e evita custos desnecessários de infraestrutura, preservando um caminho claro para escalabilidade.

---

# Princípios Arquiteturais

Toda implementação deverá respeitar:

* Clean Architecture
* SOLID
* Domain Driven Design (DDD)
* Clean Code
* Separation of Concerns
* Dependency Injection
* Repository Pattern
* CQRS (quando necessário)
* Event Driven Architecture (para integrações)
* API First

---

# Organização do Monorepo

```
apps/
    web/
    mobile/
    api/
    admin/

packages/
    ui/
    config/
    types/
    utils/
```

Cada aplicação deverá ser independente.

Bibliotecas compartilhadas nunca conterão regras de negócio.

---

# Camadas da Aplicação

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

## Presentation

Responsável por:

* Controllers
* Endpoints
* DTOs
* Middlewares
* Validação
* Autenticação de entrada

---

## Application

Responsável por:

* Casos de uso
* Serviços
* Orquestração
* Regras de aplicação

Não possui acesso direto ao banco de dados.

---

## Domain

Núcleo do sistema.

Contém:

* Entidades
* Value Objects
* Interfaces
* Eventos de domínio
* Regras de negócio

O domínio não depende de frameworks.

---

## Infrastructure

Implementações concretas:

* PostgreSQL
* Redis
* RabbitMQ
* MinIO
* APIs externas
* Open Finance
* Serviços de e-mail

---

# Domínios de Negócio

O sistema será dividido em módulos independentes.

## Identity

* Usuários
* Login
* Permissões
* Sessões

---

## Financial

* Receitas
* Despesas
* Fluxo de caixa

---

## Accounts

* Bancos
* Contas
* Saldos

---

## Cards

* Cartões
* Limites
* Parcelamentos

---

## Investments

* Investimentos
* Rentabilidade
* Patrimônio

---

## Goals

* Metas financeiras
* Objetivos

---

## Reports

* Relatórios
* Indicadores
* Dashboards

---

## Notifications

* E-mail
* Push
* WhatsApp
* SMS

---

## AI

* Assistente Financeiro
* Sugestões inteligentes
* Classificação automática
* Análises

---

# Comunicação Entre Módulos

Sempre utilizar interfaces.

Nunca acessar diretamente outro módulo.

```
Controller

↓

Use Case

↓

Interface

↓

Repository

↓

Database
```

---

# Banco de Dados

Banco principal:

PostgreSQL

Cache:

Redis

Mensageria:

RabbitMQ

Arquivos:

MinIO

---

# Estratégia de Persistência

Cada agregado possui seu próprio repositório.

Nunca compartilhar acesso direto entre agregados.

---

# APIs

Arquitetura REST.

Padrões:

```
GET

POST

PUT

PATCH

DELETE
```

Versionamento:

```
/api/v1
```

---

# Autenticação

JWT

Refresh Token

RBAC (Role Based Access Control)

Permissões baseadas em políticas.

---

# Eventos

Eventos serão utilizados para:

* envio de notificações
* geração de relatórios
* auditoria
* integrações
* IA
* sincronizações

---

# Segurança

* Hash de senhas (Argon2 ou bcrypt)
* HTTPS obrigatório
* Rate Limiting
* Helmet
* CORS configurável
* Proteção CSRF quando aplicável
* Auditoria
* Logs estruturados

---

# Observabilidade

Logs estruturados

Health Check

Métricas

Tracing distribuído

Monitoramento

---

# Escalabilidade

Aplicações stateless.

Sessões armazenadas fora da aplicação.

Cache distribuído.

Mensageria para processos assíncronos.

Escalabilidade horizontal.

---

# Estrutura dos Casos de Uso

```
CreateTransactionUseCase

UpdateTransactionUseCase

DeleteTransactionUseCase

ListTransactionsUseCase
```

Cada caso de uso deverá possuir responsabilidade única.

---

# Convenções de Código

Idioma:

Inglês

Comentários:

Somente quando realmente necessários.

Nomes:

Explícitos.

Métodos:

Pequenos.

Classes:

Responsabilidade única.

---

# Estratégia de Testes

* Testes Unitários
* Testes de Integração
* Testes End-to-End
* Testes de Contrato (quando houver microsserviços)

Cobertura mínima recomendada:

80%.

---

# Fluxo Simplificado

```
Cliente

↓

API

↓

Controller

↓

Use Case

↓

Domain

↓

Repository

↓

PostgreSQL
```

---

# Deploy

Ambientes:

* Development
* Staging
* Production

Containers:

Docker

Orquestração futura:

Kubernetes

---

# Decisões Arquiteturais

Todas as decisões importantes deverão ser registradas em:

```
docs/11-decisions/
```

Cada decisão deverá conter:

* Contexto
* Problema
* Alternativas
* Decisão
* Consequências

---

# Evolução Planejada

## Fase 1

Monólito Modular

## Fase 2

Separação de módulos internos

## Fase 3

Microsserviços

## Fase 4

Escalabilidade horizontal

---

# Filosofia

A arquitetura deve privilegiar simplicidade, previsibilidade e qualidade.

Novas tecnologias só serão adotadas quando oferecerem benefícios claros ao projeto.

A regra geral é construir uma base sólida, fácil de entender e preparada para evoluir sem comprometer a estabilidade do sistema.
