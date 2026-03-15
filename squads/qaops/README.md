# QAOps — Test Pyramid Squad

**Plataforma de orquestracao de agentes especializados em Quality Assurance.**

Cinco agentes autonomos operam como uma consultoria de QA senior, cobrindo toda a piramide de testes: analise de cenarios, testes unitarios, integracao, E2E e orquestracao estrategica. Cada agente domina seu nivel da piramide e colabora com os demais para garantir cobertura completa.

## Instalacao

```bash
npx @jfilhogn/qaops install           # Instala no projeto AIOX atual
npx @jfilhogn/qaops install --dry-run # Preview sem escrever arquivos
npx @jfilhogn/qaops validate          # Valida instalacao existente
```

**Pre-requisito:** Projeto com AIOX instalado (`npx aiox-core install`).

## Agentes QA Especializados

| Tier | Agent | Persona | Especialidade |
|------|-------|---------|---------------|
| 0 | qa-chief | Vega (Strategist) | Triage de requests, balanco da piramide, coordenacao multi-camada |
| 1 | qa-unit | Prism (Craftsman) | Testes unitarios, mocks/stubs/spies, TDD, cobertura, Jest/PyTest/Vitest |
| 1 | qa-integration | Nexo (Connector) | Contratos de API, persistencia, Pact/Supertest, comunicacao entre servicos |
| 2 | qa-e2e | Pixel (Observer) | Fluxos de usuario, Playwright/Cypress, Page Objects, acessibilidade, visual regression |
| 2 | qa-analyst | Sage (Scholar) | Derivacao de cenarios, BDD/Gherkin, planos de teste, particao de equivalencia, boundary values |

## Como Usar

### Via Claude Code (agentes registrados)

```bash
# Chief faz triage e roteia para o especialista certo
@qaops-chief "Preciso de testes para o modulo de autenticacao"

# Acesso direto aos especialistas
@qaops-unit "Design unit tests para validateEmail()"
@qaops-integration "Teste de contrato para POST /auth/login"
@qaops-e2e "Fluxo E2E do login com validacao de acessibilidade"
@qaops-analyst "Derivar cenarios de teste da story de checkout"
```

### Comandos Principais

| Comando | Agente | O que faz |
|---------|--------|-----------|
| `*triage {request}` | Chief | Analisa request e roteia para especialista |
| `*test-pyramid {feature}` | Chief | Piramide completa: Analyst -> Unit -> Integration -> E2E |
| `*pyramid-status` | Chief | Status de cobertura por camada |
| `*derive-scenarios {story}` | Analyst | Deriva cenarios BDD de requirements |
| `*test-plan {feature}` | Analyst | Plano de testes completo |
| `*design-unit {target}` | Unit | Projeta testes unitarios com mock strategy |
| `*tdd-cycle {target}` | Unit | Ciclo Red-Green-Refactor |
| `*design-integration {target}` | Integration | Projeta testes de integracao com contratos |
| `*contract-test {api}` | Integration | Testes de contrato especificos |
| `*design-e2e {flow}` | E2E | Projeta testes E2E com Page Objects |
| `*accessibility-test {page}` | E2E | Auditoria de acessibilidade com axe-core |

## Piramide de Testes

```
        /   E2E    \        10% — Poucas jornadas criticas do usuario
       /─────────────\
      /  Integration   \     20% — Fronteiras de servico, contratos de API
     /───────────────────\
    /    Unit Tests        \  70% — Rapidos, isolados, deterministicos
   /─────────────────────────\
```

### Principios por Camada

**Unit (Prism)** — Base da piramide
- Isolamento total: sem DB, rede ou filesystem
- Padrao AAA (Arrange-Act-Assert) rigoroso
- Mock apenas nas fronteiras externas
- Execucao em milissegundos

**Integration (Nexo)** — Camada media
- Foco nos pontos de integracao (onde bugs se escondem)
- Testes estreitos: uma fronteira por vez
- DB de teste real, nao mocks
- Cada teste cria e limpa seus proprios dados

**E2E (Pixel)** — Topo da piramide
- Apenas jornadas criticas de negocio
- Page Object Models para resiliencia
- Selectors: data-testid > getByRole > getByLabel (nunca CSS)
- Auditoria de acessibilidade integrada (axe-core)

**Analyst (Sage)** — Cross-layer
- Cenarios ANTES de codigo
- Rastreabilidade: cenario -> requisito
- Particao de equivalencia + boundary values
- Testes negativos: happy paths nao bastam

## Fluxo de Trabalho

### Triage Automatico

```
Request do usuario
  -> QA Chief (Vega) analisa keywords
     -> Score > 0 em 1 dominio  -> Route direto ao especialista
     -> Scores em 2+ dominios   -> Coordenacao multi-agente
     -> Nenhum match            -> Chief responde diretamente
```

### Piramide Completa (5 fases)

```
Fase 1: Sage (Analyst)    -> Derivar cenarios de teste
Fase 2: Prism (Unit)      -> Projetar testes unitarios
Fase 3: Nexo (Integration)-> Projetar testes de integracao
Fase 4: Pixel (E2E)       -> Projetar testes E2E (skip se backend-only)
Fase 5: Vega (Chief)      -> Relatorio consolidado da piramide
```

## Exemplo: "Criar validacao de login"

O Chief (Vega) identifica como concern cross-layer e coordena:

1. **Sage** deriva: particoes de equivalencia (email/password valido e invalido), cenarios BDD (login success, email invalido, password vazio, account lockout), boundary values (min/max password, 5 tentativas = lock)

2. **Prism** projeta: 15 unit tests Jest cobrindo `validateEmail()` e `validatePassword()` com 100% branch coverage, execucao ~200ms

3. **Nexo** projeta: 8 integration tests Supertest contra `POST /auth/login` — contrato success (200+token), error (401), rate limiting (429), schema validation (422), execucao ~3s

4. **Pixel** projeta: 4 E2E tests Playwright — login success, validation error, lockout, accessibility audit — com LoginPage Page Object, execucao ~15s

## Estrutura do Squad

```
squads/qaops/
├── config.yaml                    # Configuracao do squad (tiers, agents, handoffs)
├── agents/                        # 5 agentes especializados
│   ├── qa-chief.md                #   Tier 0: Vega — Triage & Orquestracao
│   ├── qa-unit.md                 #   Tier 1: Prism — Testes Unitarios
│   ├── qa-integration.md          #   Tier 1: Nexo — Testes de Integracao
│   ├── qa-e2e.md                  #   Tier 2: Pixel — Testes E2E
│   └── qa-analyst.md              #   Tier 2: Sage — Analise & Cenarios
├── tasks/                         # 8 definicoes de tarefas
│   ├── triage-test-request.md     #   Triagem de requisicoes
│   ├── design-unit-tests.md       #   Design de testes unitarios
│   ├── design-integration-tests.md#   Design de testes de integracao
│   ├── design-e2e-tests.md        #   Design de testes E2E
│   ├── derive-test-scenarios.md   #   Derivacao de cenarios
│   ├── generate-test-plan.md      #   Plano de testes completo
│   ├── pyramid-coverage-report.md #   Relatorio de cobertura
│   └── validate-test-architecture.md # Validacao de arquitetura
├── workflows/                     # 2 workflows
│   ├── wf-test-pyramid.yaml       #   Piramide completa (5 fases)
│   └── wf-qa-triage.yaml          #   Triage e routing
├── checklists/                    # 4 checklists de qualidade
├── templates/                     # 2 templates (test plan, test report)
└── data/                          # Dados de referencia
    ├── test-pyramid-patterns.yaml #   Padroes por framework
    └── testing-vocabulary.yaml    #   Vocabulario compartilhado
```

## Integracao com QA Core

O QAOps **complementa** o agente QA core (Quinn), nao o substitui:

| Responsabilidade | Dono |
|-----------------|------|
| Story review, quality gates, NFR assessment | Quinn (@qa) |
| Design de testes, autoria, cobertura | QAOps Squad |
| Risk profiles, security review | Quinn (@qa) |
| Derivacao de cenarios, planos de teste | QAOps Squad |

Quinn delega para `@qaops-chief` quando precisa de design de testes durante `*review` ou `*test-design`.

## Licenca

MIT
