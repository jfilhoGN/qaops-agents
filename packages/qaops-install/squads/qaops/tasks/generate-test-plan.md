<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: generateTestPlan()
responsavel: "@qaops:qa-analyst"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: feature
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Feature name or story reference

  - campo: scope
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: "full | unit-only | integration-only | e2e-only"

Saida:
  - campo: test_plan
    tipo: string
    destino: User Display + File
    persistido: true

Checklist:
  - "[ ] Scope defined"
  - "[ ] Test objectives listed"
  - "[ ] In-scope/out-of-scope documented"
  - "[ ] Test approach per pyramid layer"
  - "[ ] Entry/exit criteria defined"
  - "[ ] Environment requirements listed"
  - "[ ] Risk assessment included"
  - "[ ] Schedule/effort estimate provided"
```
-->

# Generate Test Plan

## Purpose

Generate a comprehensive test plan document for a feature or release. Covers scope, approach, resources, schedule, and risk assessment following IEEE 829 standard adapted for agile teams.

## Pre-Conditions

- [ ] Feature/story is identified
- [ ] Scope is clear (full pyramid or specific layer)

## Execution Steps

### Step 1: Define Scope

- **In scope:** What will be tested (features, components, integrations)
- **Out of scope:** What will NOT be tested (explicitly listed)
- **Assumptions:** Environmental and technical assumptions

### Step 2: Define Test Approach

For each pyramid layer:

| Layer | Approach | Tools | Responsible |
|-------|----------|-------|-------------|
| Unit | TDD, AAA pattern | Jest/PyTest | qa-unit (Prism) |
| Integration | Contract testing, API testing | Supertest/Pact | qa-integration (Nexo) |
| E2E | Critical user flows | Playwright/Cypress | qa-e2e (Pixel) |

### Step 3: Define Entry/Exit Criteria

**Entry criteria (start testing when):**
- [ ] Code is committed and builds successfully
- [ ] Unit tests pass
- [ ] Test environment is available

**Exit criteria (testing is complete when):**
- [ ] All P0/P1 test cases pass
- [ ] Coverage target met (line >= 80%, branch >= 75%)
- [ ] No open P0 defects
- [ ] All P1 defects have workarounds documented

### Step 4: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| {risk} | High/Medium/Low | High/Medium/Low | {strategy} |

### Step 5: Environment Requirements

- Test database configuration
- API endpoints (staging/test)
- Browser matrix (if E2E)
- CI/CD pipeline integration

### Step 6: Effort Estimate

| Activity | Effort | Responsible |
|----------|--------|-------------|
| Scenario derivation | X hours | qa-analyst |
| Unit test design | X hours | qa-unit |
| Integration test design | X hours | qa-integration |
| E2E test design | X hours | qa-e2e |
| Test execution | X hours | All |
| Defect resolution | X hours | @dev |

## Post-Conditions

- [ ] Test plan document is complete
- [ ] All pyramid layers are addressed
- [ ] Entry/exit criteria are actionable
- [ ] Risks are identified with mitigations

## Output Format

Uses template: `test-plan-tmpl.yaml`
