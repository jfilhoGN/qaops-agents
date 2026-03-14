<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: validateTestArchitecture()
responsavel: "@qaops:qa-chief"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: project_path
    tipo: string
    origem: User Input or auto-detect
    obrigatorio: true
    validacao: Valid project root path

Saida:
  - campo: architecture_report
    tipo: string
    destino: User Display
    persistido: false

Checklist:
  - "[ ] Test directory structure analyzed"
  - "[ ] Framework(s) detected"
  - "[ ] Test count per layer calculated"
  - "[ ] Pyramid ratio assessed"
  - "[ ] Anti-patterns identified"
  - "[ ] Recommendations provided"
```
-->

# Validate Test Architecture

## Purpose

Analyze the project's existing test architecture against test pyramid principles. Identify anti-patterns, assess pyramid balance, and provide improvement recommendations.

## Pre-Conditions

- [ ] Project root path is accessible
- [ ] Project has at least some tests

## Execution Steps

### Step 1: Detect Test Framework

Scan project for test configuration:
- `jest.config.*` / `vitest.config.*` -> JavaScript unit tests
- `playwright.config.*` / `cypress.config.*` -> E2E tests
- `pyproject.toml` with pytest -> Python tests
- `pom.xml` with JUnit -> Java tests

### Step 2: Analyze Test Directory Structure

Scan test directories for organization:
- `tests/unit/` or `__tests__/` -> Unit tests
- `tests/integration/` -> Integration tests
- `tests/e2e/` -> E2E tests
- Flat structure (all in one dir) -> Anti-pattern

### Step 3: Count Tests Per Layer

Parse test files to count test cases:
- Count `it()`, `test()`, `def test_*`, `@Test` blocks
- Categorize by directory/naming convention
- Calculate percentage per layer

### Step 4: Check Anti-Patterns

| Anti-Pattern | Detection | Severity |
|-------------|-----------|----------|
| No unit tests | 0 unit test files | CRITICAL |
| Inverted pyramid | More E2E than unit | HIGH |
| Sleep-based waits | `sleep()`, `waitForTimeout()` in E2E | MEDIUM |
| Shared test data | Global fixtures, no teardown | MEDIUM |
| CSS class selectors | `.class-name` in E2E selectors | LOW |
| Over-mocking | jest.mock() on same-module imports | LOW |

### Step 5: Generate Report

Produce a structured report with findings, pyramid visualization, and recommendations.

## Post-Conditions

- [ ] Test framework(s) identified
- [ ] Test count per layer calculated
- [ ] Anti-patterns flagged with severity
- [ ] Improvement recommendations listed

## Output Format

```
## Test Architecture Validation

### Framework Detection
{Detected frameworks}

### Current Pyramid
{ASCII pyramid with test counts}

### Pyramid Ratio
{Table with current vs target}

### Anti-Patterns Found
{List with severity}

### Recommendations
{Prioritized improvements}
```
