# Changelog

All notable changes to QAOps will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-15

### GitHub Copilot Compatibility

QAOps agora suporta dois formatos de agentes simultaneamente: Claude Code e GitHub Copilot.

### Added

- 5 agent files em `.github/agents/` no formato Copilot (YAML frontmatter com `tools`, `handoffs`)
- `.github/copilot-instructions.md` — instrucoes project-wide para Copilot
- `registerCopilotAgents()` no installer — registra agentes em ambos os formatos
- Initializer cria `.github/` structure durante `init` (novo e overlay)
- Bundle script inclui `.github/agents/` e `copilot-instructions.md` no tarball npm
- Keyword `github-copilot` adicionada ao package.json

### Changed

- `findRepoRoot()` agora prefere o repo root real (com `.git/`) sobre package dirs bundled
- Summary do installer mostra stats separados para Claude e Copilot agents
- Next steps no initializer agora lista IDEs suportados (Claude Code/Cursor + Copilot)

### IDEs Suportados

- **Claude Code / Cursor** — `.claude/agents/qaops-*.md` (auto-detected)
- **GitHub Copilot (VSCode)** — `.github/agents/qaops-*.md` (auto-detected)

## [1.2.0] - 2026-03-15

### Overlay Mode

Suporte para adicionar QAOps a projetos existentes sem sobrescrever configuracoes.

### Added

- Overlay mode: `npx @jfilhogn/qaops init .` adiciona QAOps a projetos existentes
- Preserva package.json, .gitignore, .git/ existentes
- Skip npm install em overlay mode

### Fixed

- URLs do repositorio corrigidas de SynkraAI/aiox-core para jfilhoGN/qaops-agents
- Author corrigido para "Joao Martins Filho"

## [1.1.0] - 2026-03-15

### Project Initializer

Novo comando para criar projetos QAOps do zero.

### Added

- `npx @jfilhogn/qaops init <name>` — cria novo projeto com toda a estrutura
- Gera: .aiox-core/, .claude/, package.json, executor-assignment.js
- Git init automatico com primeiro commit
- npm install automatico (opcional)

### CI/CD

- Reescrita completa do CI workflow (5 jobs limpos)
- Jest com `--forceExit --detectOpenHandles` para evitar hangs
- Removidos 15 workflows AIOX-specific

## [1.0.0] - 2026-03-14

### QAOps — Test Pyramid Squad (Initial Release)

Primeira versao da plataforma de orquestracao de agentes especializados em Quality Assurance. Cinco agentes autonomos cobrindo toda a Piramide de Testes.

### Added

#### 5 Agentes QA Especializados

- **qa-chief (Vega)** — Tier 0: Triage de requests, balanco da piramide 70:20:10, coordenacao multi-agente
- **qa-unit (Prism)** — Tier 1: Testes unitarios, mocks/stubs/spies, TDD, cobertura (Jest, PyTest, Vitest, JUnit)
- **qa-integration (Nexo)** — Tier 1: Contratos de API, persistencia, Pact/Supertest, comunicacao entre servicos
- **qa-e2e (Pixel)** — Tier 2: Playwright/Cypress, Page Objects, acessibilidade (axe-core), visual regression
- **qa-analyst (Sage)** — Tier 2: Cenarios BDD/Gherkin, planos de teste, particao de equivalencia, boundary values

#### 8 Tasks

- `triage-test-request.md` — Chief roteia requests via keyword scoring
- `design-unit-tests.md` — Unit test design com mock strategy e coverage targets
- `design-integration-tests.md` — Integration test design com contratos e fixtures
- `design-e2e-tests.md` — E2E test design com Page Objects e selectors resilientes
- `derive-test-scenarios.md` — Derivacao de cenarios de teste a partir de stories
- `generate-test-plan.md` — Plano de testes completo
- `pyramid-coverage-report.md` — Relatorio consolidado de cobertura por camada
- `validate-test-architecture.md` — Validacao de arquitetura de testes contra a piramide

#### 2 Workflows

- `wf-test-pyramid.yaml` — Piramide completa em 5 fases: Sage -> Prism -> Nexo -> Pixel -> Vega
- `wf-qa-triage.yaml` — Triage e routing automatico

#### 4 Checklists de Qualidade

- `unit-test-checklist.md` — Padroes para testes unitarios (isolamento, AAA, determinismo)
- `integration-test-checklist.md` — Padroes para testes de integracao (contratos, idempotencia)
- `e2e-test-checklist.md` — Padroes para testes E2E (selectors, a11y, Page Objects)
- `test-plan-checklist.md` — Padroes para planos de teste (rastreabilidade, cobertura)

#### 2 Templates

- `test-plan-tmpl.yaml` — Template de plano de testes
- `test-report-tmpl.yaml` — Template de relatorio de execucao

#### 2 Arquivos de Dados

- `test-pyramid-patterns.yaml` — Padroes por framework (Jest, Vitest, PyTest, JUnit, Playwright, Cypress) + anti-patterns
- `testing-vocabulary.yaml` — Vocabulario compartilhado entre todos os agentes

#### Instalador NPX

- `npx @jfilhogn/qaops install` — Instala o QAOps squad em projetos AIOX existentes
- `npx @jfilhogn/qaops validate` — Valida integridade da instalacao
- Opcoes: `--force`, `--dry-run`, `--skip-agents`, `--skip-core`
- Bundle automatico de squad files e agent registrations para npm publish

#### Claude Code Integration

- 5 agent files em `.claude/agents/` (qaops-chief, qaops-unit, qaops-integration, qaops-e2e, qaops-analyst)
- Cada agente opera autonomamente com persona, context loading e mission routing
- Hook de seguranca: `enforce-git-push-authority.sh` em todos os agentes

#### Core Integration

- Story type `testing` adicionado ao `executor-assignment.js`
- Keywords: test, testing, unit_test, integration_test, e2e, coverage, mock, playwright, jest, pytest
- Executor: `@qa`, Quality Gate: `@architect`

### Frameworks Suportados

- **Unit:** Jest, Vitest, PyTest, JUnit 5
- **Integration:** Supertest, Pact, httpx, REST Assured
- **E2E:** Playwright, Cypress, Selenium
- **Acessibilidade:** axe-core, Lighthouse CI
