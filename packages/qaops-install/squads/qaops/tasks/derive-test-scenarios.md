<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: deriveTestScenarios()
responsavel: "@qaops:qa-analyst"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: story
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: User story, feature description, or acceptance criteria

Saida:
  - campo: test_scenarios
    tipo: object
    destino: User Display + File
    persistido: true

  - campo: traceability_matrix
    tipo: object
    destino: User Display
    persistido: false

Checklist:
  - "[ ] Requirements/AC analyzed"
  - "[ ] Equivalence partitions identified"
  - "[ ] Boundary values defined"
  - "[ ] BDD scenarios written (Gherkin)"
  - "[ ] Negative scenarios included"
  - "[ ] Risk matrix created"
  - "[ ] Traceability matrix built"
  - "[ ] Pyramid layer recommendations made"
```
-->

# Derive Test Scenarios

## Purpose

Derive comprehensive test scenarios from a user story, feature description, or acceptance criteria. Produce structured output that serves as input for the specialist agents (Prism, Nexo, Pixel) to create actual test code.

## Pre-Conditions

- [ ] User story, feature, or requirements text is provided
- [ ] Acceptance criteria are identifiable (explicit or implicit)

## Execution Steps

### Step 1: Extract Requirements

1. Read the story/feature description
2. Identify explicit acceptance criteria (AC)
3. Identify implicit requirements (security, performance, accessibility)
4. List all input fields and their domains

### Step 2: Equivalence Partitioning

For each input field, create equivalence classes:

| Input | Class | Type | Representative | Expected |
|-------|-------|------|---------------|----------|
| email | Standard format | Valid | user@example.com | Accept |
| email | Empty | Invalid | "" | Reject |
| email | No @ symbol | Invalid | "userexample.com" | Reject |

### Step 3: Boundary Value Analysis

For each input with numeric or length constraints:

| Input | Boundary | Test Value | Expected |
|-------|----------|-----------|----------|
| password | min length (8) | 7 chars | Reject |
| password | min length (8) | 8 chars | Accept |
| password | max length (128) | 128 chars | Accept |
| password | max length (128) | 129 chars | Reject |

### Step 4: Write BDD Scenarios

Write Gherkin scenarios covering:
1. Happy path(s) — Primary success flow
2. Validation errors — Each invalid input class
3. Business rules — Each AC-specific behavior
4. Edge cases — Boundary values, empty states, concurrency
5. Security — Injection, authorization, session management

```gherkin
Feature: {Feature name}

  Scenario: {Descriptive name}
    Given {precondition}
    When {action}
    Then {expected outcome}
```

### Step 5: Create Risk Matrix

| Scenario | Risk Level | Priority | Rationale |
|----------|-----------|----------|-----------|
| SQL injection | CRITICAL | P0 | Security vulnerability |
| Happy path | HIGH | P1 | Core business flow |
| Edge case | MEDIUM | P2 | Less likely but impactful |

### Step 6: Build Traceability Matrix

| Requirement/AC | Scenarios | Pyramid Layer |
|---------------|-----------|---------------|
| AC1: Valid login | S1, S2, S3 | Unit + Integration + E2E |
| AC2: Error message | S4, S5 | Unit + E2E |

### Step 7: Recommend Pyramid Layer

For each scenario, recommend which pyramid layer should implement it:

- **Unit** — Isolated validation logic, calculations, transformations
- **Integration** — API contracts, persistence, service communication
- **E2E** — Critical user flows requiring browser interaction
- **Multiple** — Cross-layer scenarios needing coverage at multiple levels

## Post-Conditions

- [ ] All AC have at least one scenario
- [ ] All input fields have equivalence partitions
- [ ] Boundary values are identified for constrained inputs
- [ ] Negative scenarios are explicitly listed
- [ ] Risk matrix provides clear prioritization
- [ ] Traceability matrix has zero gaps

## Output Format

```
## Test Scenarios — {Feature Name}

### Equivalence Partitions
{Table}

### Boundary Values
{Table}

### BDD Scenarios (Gherkin)
{Gherkin code}

### Risk Matrix
{Priority table}

### Traceability Matrix
{Requirement-to-scenario mapping}

### Pyramid Layer Recommendations
{Per-scenario layer assignment}

### Coverage Summary
- Total scenarios: N
- Unit-level: N
- Integration-level: N
- E2E-level: N
- Gaps: {list or "None detected"}
```
