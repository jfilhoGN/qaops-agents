<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: pyramidCoverageReport()
responsavel: "@qaops:qa-chief"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: unit_spec
    tipo: object
    origem: qa-unit output
    obrigatorio: false

  - campo: integration_spec
    tipo: object
    origem: qa-integration output
    obrigatorio: false

  - campo: e2e_spec
    tipo: object
    origem: qa-e2e output
    obrigatorio: false

  - campo: scenarios
    tipo: object
    origem: qa-analyst output
    obrigatorio: false

Saida:
  - campo: pyramid_report
    tipo: string
    destino: User Display + File
    persistido: true

  - campo: coverage_summary
    tipo: object
    destino: Return value
    persistido: false

Checklist:
  - "[ ] All specialist outputs collected"
  - "[ ] Pyramid ratio calculated"
  - "[ ] Coverage gaps identified"
  - "[ ] Balance assessment provided"
  - "[ ] Recommendations listed"
```
-->

# Pyramid Coverage Report

## Purpose

Consolidate outputs from all QAOps specialist agents into a unified test pyramid coverage report. Assess pyramid balance, identify coverage gaps, and provide actionable recommendations.

## Pre-Conditions

- [ ] At least one specialist has produced output
- [ ] Feature/story context is available

## Execution Steps

### Step 1: Collect Specialist Outputs

Gather outputs from each specialist (if available):
- Sage (qa-analyst): Test scenarios, traceability matrix
- Prism (qa-unit): Unit test spec, mock strategy
- Nexo (qa-integration): Integration test spec, contracts
- Pixel (qa-e2e): E2E test spec, page objects

### Step 2: Calculate Pyramid Ratio

| Layer | Test Count | Percentage | Target | Status |
|-------|-----------|-----------|--------|--------|
| Unit | N | X% | 70% | OK/WARN |
| Integration | N | X% | 20% | OK/WARN |
| E2E | N | X% | 10% | OK/WARN |
| **Total** | **N** | **100%** | — | — |

### Step 3: Assess Balance

- **Healthy:** Ratio is within 10% of 70:20:10 target
- **Top-heavy:** Too many E2E tests relative to unit tests
- **Bottom-heavy:** Missing integration or E2E coverage
- **Inverted:** More E2E than unit tests (anti-pattern)

### Step 4: Identify Coverage Gaps

Cross-reference scenarios from Sage against test specs from specialists:

| Scenario | Unit | Integration | E2E | Gap? |
|----------|------|-------------|-----|------|
| S1 | Yes | Yes | No | No (E2E optional) |
| S2 | Yes | No | No | WARN (integration recommended) |
| S3 | No | No | Yes | CRITICAL (needs unit foundation) |

### Step 5: Generate Recommendations

Provide actionable recommendations:
1. Which tests to add (specific scenarios + layer)
2. Which tests to remove or push down (cost optimization)
3. Framework-specific guidance
4. Estimated effort for gap closure

## Post-Conditions

- [ ] Pyramid ratio is calculated
- [ ] Balance status is assessed
- [ ] Coverage gaps are listed with severity
- [ ] Actionable recommendations provided

## Output Format

```
## Pyramid Coverage Report — {Feature Name}

### Pyramid Balance
{Ratio table with status}

### Balance Assessment
{Healthy/Top-heavy/Bottom-heavy/Inverted with explanation}

### Coverage Matrix
{Scenario-to-layer cross-reference}

### Gaps Identified
{List of gaps with severity}

### Recommendations
{Actionable next steps}

### Summary
- Total scenarios: N
- Covered: N (X%)
- Gaps: N
- Pyramid health: {status}
```
