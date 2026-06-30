# CONTRIBUTING.md

# Guia de Contribuição

Bem-vindo ao projeto **Conta Comigo**.

Este documento estabelece os padrões oficiais de desenvolvimento do projeto. Todos os colaboradores devem seguir estas diretrizes para garantir consistência, qualidade e facilidade de manutenção.

---

# Objetivo

Nosso objetivo é desenvolver software de alta qualidade, com foco em:

* Legibilidade
* Manutenibilidade
* Segurança
* Escalabilidade
* Simplicidade
* Testabilidade

Sempre priorize código limpo e soluções claras em vez de implementações excessivamente complexas.

---

# Fluxo de Desenvolvimento

Todo desenvolvimento deve seguir este fluxo:

```text
Issue

↓

Branch

↓

Implementação

↓

Testes

↓

Pull Request

↓

Code Review

↓

Merge
```

Nenhuma alteração deve ser enviada diretamente para a branch `main`.

---

# Estratégia de Branches

## Branch principal

```text
main
```

Contém apenas versões estáveis.

---

## Branch de desenvolvimento

```text
develop
```

Recebe todas as novas funcionalidades aprovadas.

---

## Branches de trabalho

### Funcionalidades

```text
feature/nome-da-feature
```

Exemplo:

```text
feature/create-transactions
```

---

### Correções

```text
bugfix/corrigir-calculo-saldo
```

---

### Correções urgentes

```text
hotfix/login-error
```

---

### Releases

```text
release/v1.2.0
```

---

# Padrão de Commits

Utilizamos **Conventional Commits**.

Formato:

```text
tipo(escopo): descrição
```

Exemplos:

```text
feat(auth): adiciona login com JWT

fix(accounts): corrige cálculo de saldo

docs(readme): atualiza documentação

refactor(financial): simplifica serviço

test(cards): adiciona testes unitários

chore(ci): atualiza workflow
```

Tipos permitidos:

* feat
* fix
* docs
* style
* refactor
* perf
* test
* build
* ci
* chore
* revert

---

# Pull Requests

Todo Pull Request deve:

* resolver apenas um problema por vez;
* possuir descrição clara;
* referenciar a Issue correspondente quando existir;
* passar em todos os testes automatizados;
* respeitar os padrões definidos neste repositório.

Evite Pull Requests muito grandes. Prefira alterações pequenas e focadas.

---

# Code Review

Durante a revisão serão avaliados:

* clareza do código;
* aderência à arquitetura;
* nomenclatura;
* tratamento de erros;
* cobertura de testes;
* impacto em segurança;
* desempenho;
* duplicação de código.

A aprovação depende da conformidade com esses critérios.

---

# Organização do Código

Cada módulo deve conter apenas responsabilidades relacionadas ao seu domínio.

Estrutura recomendada:

```text
module/

controllers/
dtos/
entities/
repositories/
services/
use-cases/
validators/
tests/
```

---

# Convenções

## Idioma

Todo código deve ser escrito em inglês.

Inclui:

* nomes de arquivos;
* classes;
* funções;
* variáveis;
* interfaces;
* enums;
* tabelas;
* colunas.

A documentação destinada aos usuários pode ser escrita em português.

---

## Nomenclatura

Classes:

```text
UserService
```

Interfaces:

```text
IUserRepository
```

Use Cases:

```text
CreateTransactionUseCase
```

DTOs:

```text
CreateTransactionDto
```

Enums:

```text
TransactionType
```

---

# Princípios de Desenvolvimento

Todo código deve respeitar:

* SOLID
* Clean Architecture
* Clean Code
* Domain Driven Design (DDD)
* DRY (Don't Repeat Yourself)
* KISS (Keep It Simple)
* YAGNI (You Aren't Gonna Need It)

---

# Testes

Toda funcionalidade deve possuir testes compatíveis com sua complexidade.

Prioridades:

1. Testes Unitários
2. Testes de Integração
3. Testes End-to-End

Sempre que um bug for corrigido, adicione um teste que evite sua regressão.

---

# Qualidade do Código

Antes de abrir um Pull Request execute:

```bash
pnpm lint

pnpm format

pnpm test
```

Nenhum erro deve permanecer.

---

# Dependências

Antes de adicionar uma nova biblioteca, avalie:

* necessidade real;
* manutenção ativa;
* licença compatível;
* documentação;
* impacto em segurança;
* impacto no tamanho da aplicação.

Sempre prefira reutilizar soluções já existentes no projeto.

---

# Segurança

Nunca envie ao repositório:

* senhas;
* tokens;
* chaves privadas;
* arquivos `.env`;
* credenciais de banco de dados;
* certificados.

Utilize variáveis de ambiente para dados sensíveis.

---

# Documentação

Sempre que houver alterações relevantes, atualize:

* README.md
* ARCHITECTURE.md
* documentação da API;
* diagramas afetados;
* regras de negócio impactadas.

Código e documentação devem evoluir juntos.

---

# Inteligência Artificial

Ferramentas de IA podem ser utilizadas como apoio ao desenvolvimento.

Entretanto:

* todo código gerado deve ser revisado;
* decisões arquiteturais devem seguir a documentação oficial;
* código gerado automaticamente deve atender aos mesmos padrões exigidos para código escrito manualmente.

A responsabilidade final pela qualidade permanece com quem submete a alteração.

---

# Checklist para Pull Request

Antes de solicitar revisão, confirme:

* [ ] O código compila sem erros.
* [ ] Todos os testes passaram.
* [ ] Não há erros de lint.
* [ ] O código segue a arquitetura definida.
* [ ] Não existem credenciais no commit.
* [ ] A documentação foi atualizada quando necessário.
* [ ] O código foi revisado pelo autor.

---

# Conduta Esperada

Esperamos um ambiente colaborativo, respeitoso e focado na melhoria contínua.

Discussões técnicas devem ser baseadas em argumentos e evidências, sempre priorizando o sucesso do projeto.

---

# Dúvidas

Caso exista conflito entre este documento e outro documento oficial, prevalece a seguinte ordem:

1. ARCHITECTURE.md
2. CONTRIBUTING.md
3. README.md

Se a dúvida persistir, registre uma discussão antes de implementar mudanças estruturais.
