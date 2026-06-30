# SECURITY.md

# Política de Segurança

Este documento define as práticas oficiais de segurança do projeto **Conta Comigo**.

A segurança é um requisito fundamental do sistema e deve ser considerada durante todas as fases do desenvolvimento.

---

# Objetivos

Garantir:

* confidencialidade;
* integridade;
* disponibilidade;
* rastreabilidade;
* conformidade com boas práticas de segurança.

---

# Princípios

Toda implementação deverá seguir os princípios de:

* Security by Design
* Least Privilege
* Defense in Depth
* Fail Secure
* Zero Trust (quando aplicável)
* Secure Defaults

---

# Dados Sensíveis

São considerados dados sensíveis:

* senhas;
* tokens;
* chaves de API;
* Refresh Tokens;
* credenciais de banco de dados;
* informações financeiras;
* documentos pessoais;
* dados bancários.

Esses dados nunca devem ser armazenados em texto puro.

---

# Senhas

As senhas deverão ser:

* armazenadas utilizando algoritmo seguro (Argon2id, preferencialmente);
* comparadas apenas por funções de verificação criptográfica;
* nunca registradas em logs;
* nunca retornadas por APIs.

---

# Autenticação

O sistema utilizará:

* JWT para autenticação;
* Refresh Tokens para renovação de sessão;
* expiração configurável de tokens;
* invalidação de sessões quando necessário.

---

# Autorização

O controle de acesso seguirá o modelo **RBAC (Role-Based Access Control)**.

Toda requisição deverá validar:

* identidade do usuário;
* permissões;
* contexto da operação.

Nenhuma rota protegida poderá confiar apenas em validações do cliente.

---

# Comunicação

Toda comunicação deverá utilizar HTTPS.

Não será permitido:

* HTTP em produção;
* certificados inválidos;
* conexões inseguras entre serviços externos.

---

# Variáveis de Ambiente

Credenciais devem ser armazenadas exclusivamente em variáveis de ambiente.

Nunca versionar:

```text
.env
.env.local
.env.production
.env.development
```

Arquivos de exemplo poderão ser disponibilizados como:

```text
.env.example
```

Sem informações sensíveis.

---

# Banco de Dados

As consultas devem:

* utilizar parâmetros preparados (prepared statements);
* evitar SQL dinâmico quando possível;
* validar entradas antes da persistência.

O acesso ao banco deve ocorrer apenas por meio da camada de repositórios.

---

# Logs

Os logs não devem conter:

* senhas;
* tokens;
* números completos de cartões;
* documentos pessoais completos;
* chaves privadas.

Sempre que possível, dados sensíveis devem ser mascarados.

---

# Upload de Arquivos

Todo arquivo enviado deverá:

* possuir tamanho máximo configurado;
* ser validado quanto ao tipo;
* ser armazenado fora do diretório público da aplicação;
* receber nome interno gerado pelo sistema.

Arquivos executáveis não devem ser aceitos, salvo necessidade previamente documentada.

---

# Dependências

Antes de adicionar uma nova dependência:

* verificar manutenção ativa;
* avaliar histórico de vulnerabilidades;
* revisar a licença;
* analisar impacto no projeto.

Dependências desatualizadas devem ser revisadas periodicamente.

---

# Atualizações de Segurança

Vulnerabilidades críticas deverão receber prioridade máxima.

Correções urgentes devem ser distribuídas por meio de branches `hotfix`.

---

# Auditoria

O sistema deverá registrar eventos relevantes, incluindo:

* autenticação;
* alteração de permissões;
* operações financeiras;
* exclusões;
* falhas de autenticação;
* mudanças administrativas.

Os registros devem permitir rastreabilidade sem expor informações sensíveis.

---

# Backup

A estratégia de backup deverá considerar:

* criptografia dos dados;
* testes periódicos de restauração;
* retenção conforme política operacional;
* armazenamento seguro.

---

# Monitoramento

A infraestrutura deverá monitorar:

* disponibilidade;
* uso de recursos;
* falhas de autenticação;
* tentativas de acesso indevido;
* erros críticos;
* comportamento anômalo.

---

# Reporte de Vulnerabilidades

Caso seja identificada uma possível vulnerabilidade:

1. não divulgue publicamente;
2. registre um relatório privado para a equipe responsável;
3. descreva os passos para reprodução;
4. informe impacto e evidências;
5. aguarde a análise antes da divulgação.

Relatórios responsáveis serão tratados com prioridade.

---

# Resposta a Incidentes

Em caso de incidente de segurança:

1. identificar o impacto;
2. conter a ameaça;
3. preservar evidências;
4. corrigir a vulnerabilidade;
5. validar a correção;
6. registrar as lições aprendidas.

---

# Conformidade

O projeto buscará aderência às principais boas práticas de segurança e privacidade aplicáveis ao seu contexto, incluindo requisitos da legislação vigente sobre proteção de dados.

---

# Revisão da Política

Esta política deverá ser revisada periodicamente e sempre que ocorrerem mudanças significativas na arquitetura, infraestrutura ou requisitos de segurança do sistema.
