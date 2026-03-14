# QAOps — AI-Powered Quality Assurance Platform

> **Plataforma de orquestracao de agentes de IA especializados em Quality Assurance**

[![NPM](https://img.shields.io/npm/v/@jfilhogn/qaops.svg)](https://www.npmjs.com/package/@jfilhogn/qaops)
[![Licenca: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Cinco agentes autonomos operam como uma consultoria de QA senior, cobrindo toda a **Piramide de Testes**. Cada agente domina seu nivel da piramide e colabora com os demais para garantir cobertura completa — de cenarios BDD ate testes E2E com acessibilidade.

```
        /   E2E    \        10% — Poucas jornadas criticas
       /─────────────\
      /  Integration   \     20% — Fronteiras e contratos
     /───────────────────\
    /    Unit Tests        \  70% — Rapidos e isolados
   /─────────────────────────\
```

## Instalacao

```bash
# Instala o QAOps squad no projeto atual
npx @jfilhogn/qaops install

# Preview sem escrever arquivos
npx @jfilhogn/qaops install --dry-run

# Valida instalacao existente
npx @jfilhogn/qaops validate
```

**Pre-requisito:** Node.js >= 18 e projeto com AIOX instalado (`npx aiox-core install`).

### Opcoes do Instalador

```bash
npx @jfilhogn/qaops install [dir] [opcoes]

  --force           Sobrescrever arquivos existentes
  --dry-run         Simular sem modificar
  --skip-agents     Pular registro em .claude/agents/
  --skip-core       Pular patch do executor-assignment.js
```

## Agentes QA Especializados

| Tier | Agent | Persona | Especialidade |
|------|-------|---------|---------------|
| 0 | **qa-chief** | Vega (Strategist) | Triage, balanco da piramide, coordenacao multi-camada |
| 1 | **qa-unit** | Prism (Craftsman) | Testes unitarios, mocks/stubs/spies, TDD, Jest/PyTest/Vitest |
| 1 | **qa-integration** | Nexo (Connector) | Contratos de API, persistencia, Pact/Supertest |
| 2 | **qa-e2e** | Pixel (Observer) | Playwright/Cypress, Page Objects, acessibilidade |
| 2 | **qa-analyst** | Sage (Scholar) | Cenarios BDD, planos de teste, particao de equivalencia |

### Tier 0 — QA Chief: Vega (Strategist)

Entry point do squad. Recebe qualquer request de QA, analisa keywords e roteia para o especialista certo. Monitora o ratio 70:20:10 da piramide e coordena workflows multi-agente.

**Routing automatico:**

| Keywords detectadas | Roteamento |
|-------------------|------------|
| mock, stub, jest, pytest, tdd, coverage | Prism (Unit) |
| api, contract, persistence, endpoint | Nexo (Integration) |
| playwright, cypress, browser, user-flow, a11y | Pixel (E2E) |
| scenario, bdd, gherkin, test-plan, boundary | Sage (Analyst) |
| pyramid, strategy, all layers | Piramide completa |

### Tier 1 — QA Unit: Prism (Craftsman)

Base da piramide. Projeta testes unitarios com isolamento total — sem DB, rede ou filesystem. Padrao AAA (Arrange-Act-Assert) rigoroso, mock com intencao (apenas nas fronteiras externas), execucao em milissegundos. Detecta framework do projeto (Jest/Vitest/PyTest/JUnit) e adapta output.

### Tier 1 — QA Integration: Nexo (Connector)

Camada media. Foco nos pontos de integracao onde bugs se escondem. Testes estreitos (uma fronteira por vez), DB de teste real (nao mocks), cada teste cria e limpa seus dados. Especialista em contratos de API, persistencia e comunicacao entre servicos.

### Tier 2 — QA E2E: Pixel (Observer)

Topo da piramide. Apenas jornadas criticas de negocio. Page Object Models para resiliencia a mudancas de UI. Selectors resilientes: `data-testid` > `getByRole` > `getByLabel` — nunca CSS classes. Auditoria de acessibilidade integrada com axe-core em cada pagina.

### Tier 2 — QA Analyst: Sage (Scholar)

Cross-layer. Deriva cenarios ANTES de qualquer codigo. Rastreabilidade completa: cenario -> requisito. Tecnicas: particao de equivalencia, boundary values, testes negativos. Output em BDD/Gherkin como linguagem comum entre devs e stakeholders.

## Como Usar

### Via Claude Code

```bash
# Chief faz triage automatico
@qaops-chief "Preciso de testes para o modulo de autenticacao"

# Acesso direto aos especialistas
@qaops-unit "Design unit tests para validateEmail()"
@qaops-integration "Teste de contrato para POST /auth/login"
@qaops-e2e "Fluxo E2E do login com validacao de acessibilidade"
@qaops-analyst "Derivar cenarios de teste da story de checkout"
```

### Comandos

| Comando | Agente | O que faz |
|---------|--------|-----------|
| `*triage {request}` | Chief | Analisa e roteia para especialista |
| `*test-pyramid {feature}` | Chief | Piramide completa (5 fases) |
| `*pyramid-status` | Chief | Cobertura por camada |
| `*derive-scenarios {story}` | Analyst | Cenarios BDD de requirements |
| `*test-plan {feature}` | Analyst | Plano de testes completo |
| `*boundary-analysis {spec}` | Analyst | Boundary values + equivalencia |
| `*design-unit {target}` | Unit | Testes unitarios + mock strategy |
| `*tdd-cycle {target}` | Unit | Red-Green-Refactor |
| `*coverage-analysis {target}` | Unit | Analise de cobertura |
| `*design-integration {target}` | Integration | Testes de integracao + contratos |
| `*contract-test {api}` | Integration | Contrato especifico |
| `*persistence-test {entity}` | Integration | Testes de persistencia |
| `*design-e2e {flow}` | E2E | Testes E2E + Page Objects |
| `*accessibility-test {page}` | E2E | Auditoria a11y com axe-core |
| `*page-objects {pages}` | E2E | Gerar Page Object Models |

## Fluxos de Trabalho

### Triage Automatico

```
Request do usuario
  -> QA Chief (Vega) analisa keywords
     -> 1 dominio detectado  -> Route direto ao especialista
     -> 2+ dominios          -> Coordenacao multi-agente
     -> Nenhum match         -> Chief responde diretamente
```

### Piramide Completa (`*test-pyramid`)

Workflow de 5 fases que cobre toda a piramide para uma feature:

```
Fase 1: Sage (Analyst)     -> Derivar cenarios de teste
Fase 2: Prism (Unit)       -> Projetar testes unitarios
Fase 3: Nexo (Integration) -> Projetar testes de integracao
Fase 4: Pixel (E2E)        -> Projetar testes E2E (skip se backend-only)
Fase 5: Vega (Chief)       -> Relatorio consolidado + balanco da piramide
```

## Exemplo Pratico: "Validacao de Login"

O Chief identifica como concern cross-layer e coordena todos os agentes:

### 1. Sage (Analyst) — Cenarios

- **Particoes de equivalencia:** email valido/invalido, password valido/invalido/vazio
- **Cenarios BDD:** login success, email invalido, password vazio, account lockout
- **Boundary values:** min/max password length, max email length, 5 tentativas = lock
- **Risk matrix:** SQL injection (P0), session fixation (P0), happy path (P1)

### 2. Prism (Unit) — 15 Testes Unitarios

```javascript
describe('validateEmail', () => {
  it('accepts valid email format', () => { /* ... */ });
  it('rejects email without @', () => { /* ... */ });
  it('rejects email exceeding max length', () => { /* ... */ });
  // ... 12 mais cobrindo todas as particoes
});
```
- Mock strategy: nenhum mock (validacao pura)
- Target: 100% branch coverage, ~200ms execucao

### 3. Nexo (Integration) — 8 Testes de Integracao

```javascript
describe('POST /auth/login', () => {
  it('returns 200 + JWT token for valid credentials', () => { /* ... */ });
  it('returns 401 for invalid password', () => { /* ... */ });
  it('returns 429 after 5 failed attempts', () => { /* ... */ });
  // ... 5 mais cobrindo contratos e persistencia
});
```
- Contrato YAML definido, fixtures com setup/teardown, ~3s execucao

### 4. Pixel (E2E) — 4 Testes E2E

```javascript
test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@test.com', 'ValidPass123!');
  await expect(page).toHaveURL('/dashboard');
});
```
- Page Object Model completo (LoginPage)
- Selectors: `data-testid` e `getByRole`
- Auditoria axe-core integrada
- ~15s execucao

### Resultado: Piramide Balanceada

```
Camada        | Testes | Ratio | Tempo
------------- | ------ | ----- | ------
Unit          |     15 |   56% | ~200ms
Integration   |      8 |   30% | ~3s
E2E           |      4 |   15% | ~15s
------------- | ------ | ----- | ------
Total         |     27 |  100% | ~18s
```

## Principios de QA

### O que torna o QAOps diferente

1. **Piramide como lei** — Toda decisao de teste respeita o ratio 70:20:10. Testes E2E nao substituem unit tests.

2. **Cenarios antes de codigo** — Sage deriva cenarios completos (BDD, boundary, equivalencia) antes de qualquer teste ser escrito.

3. **Especialistas, nao generalistas** — Cada agente domina profundamente uma camada. Prism nao tenta fazer E2E, Pixel nao tenta fazer unit.

4. **Isolamento por camada** — Unit tests nao tocam DB. Integration tests nao tocam browser. E2E tests nao testam logica de validacao.

5. **Acessibilidade integrada** — Todo E2E inclui auditoria a11y. Nao e um afterthought, e parte do fluxo.

6. **Framework-agnostico** — Detecta automaticamente Jest, Vitest, PyTest, JUnit, Playwright, Cypress e adapta output.

### Anti-patterns que o QAOps previne

| Anti-pattern | Deteccao | Correcao |
|-------------|----------|----------|
| Ice Cream Cone (mais E2E que unit) | `*pyramid-status` | Rebalancear com mais unit tests |
| Testing implementation details | Review por Prism | Testar comportamento, nao implementacao |
| Flaky tests com sleep/timeout | Review por Pixel | Usar wait for state, nunca waitForTimeout |
| Mocks excessivos em integration | Review por Nexo | DB real de teste, nao mocks |
| Cenarios sem rastreabilidade | Review por Sage | Mapear cenario -> requisito |

## Estrutura do Projeto

```
squads/qaops/
├── config.yaml                     # Configuracao (tiers, agents, handoffs)
├── agents/                         # 5 agentes especializados
│   ├── qa-chief.md                 #   Vega — Triage & Orquestracao
│   ├── qa-unit.md                  #   Prism — Testes Unitarios
│   ├── qa-integration.md           #   Nexo — Testes de Integracao
│   ├── qa-e2e.md                   #   Pixel — Testes E2E
│   └── qa-analyst.md               #   Sage — Analise & Cenarios
├── tasks/                          # 8 tarefas
│   ├── triage-test-request.md      #   Triagem de requisicoes
│   ├── design-unit-tests.md        #   Design de testes unitarios
│   ├── design-integration-tests.md #   Design de testes de integracao
│   ├── design-e2e-tests.md         #   Design de testes E2E
│   ├── derive-test-scenarios.md    #   Derivacao de cenarios
│   ├── generate-test-plan.md       #   Plano de testes
│   ├── pyramid-coverage-report.md  #   Relatorio de cobertura
│   └── validate-test-architecture.md # Validacao de arquitetura
├── workflows/                      # 2 workflows
│   ├── wf-test-pyramid.yaml        #   Piramide completa (5 fases)
│   └── wf-qa-triage.yaml           #   Triage e routing
├── checklists/                     # 4 checklists de qualidade
│   ├── unit-test-checklist.md
│   ├── integration-test-checklist.md
│   ├── e2e-test-checklist.md
│   └── test-plan-checklist.md
├── templates/                      # 2 templates
│   ├── test-plan-tmpl.yaml
│   └── test-report-tmpl.yaml
└── data/                           # Dados de referencia
    ├── test-pyramid-patterns.yaml  #   Padroes por framework
    └── testing-vocabulary.yaml     #   Vocabulario compartilhado
```

## Frameworks Suportados

### Testes Unitarios
- **JavaScript/TypeScript:** Jest, Vitest
- **Python:** PyTest
- **Java:** JUnit 5

### Testes de Integracao
- **Node.js:** Supertest, Pact
- **Python:** httpx, pytest-django
- **Java:** REST Assured, Spring Boot Test

### Testes E2E
- **Playwright** (recomendado)
- **Cypress**
- **Selenium WebDriver**

### Acessibilidade
- **axe-core** (integrado nos E2E)
- **Lighthouse CI**

## Tecnologia

O QAOps e construido sobre o [AIOX Framework](https://github.com/SynkraAI/aiox-core) — um sistema open source de orquestracao de agentes de IA. O AIOX fornece a infraestrutura de agentes, tasks, workflows e CLI que o QAOps utiliza para especializar em Quality Assurance.

### Pre-requisitos

- Node.js >= 18.0.0
- Projeto com AIOX instalado
- Claude Code (para uso dos agentes via `@qaops-*`)

## Contribuindo

1. Fork o repositorio
2. Crie uma branch (`git checkout -b feat/minha-melhoria`)
3. Commit suas mudancas (`git commit -m 'feat: adicionar novo checklist'`)
4. Push para a branch (`git push origin feat/minha-melhoria`)
5. Abra um Pull Request

## Licenca

MIT

---

<sub>Construido com a Piramide de Testes como fundacao. Cada teste no lugar certo.</sub>
