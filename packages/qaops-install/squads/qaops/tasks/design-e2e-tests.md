<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: designE2eTests()
responsavel: "@qaops:qa-e2e"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: flow
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: User flow or page to test

  - campo: scenarios
    tipo: array
    origem: qa-analyst output (optional)
    obrigatorio: false
    validacao: Derived user flow scenarios from Sage

Saida:
  - campo: e2e_test_spec
    tipo: string
    destino: User Display + File
    persistido: true

  - campo: page_objects
    tipo: string
    destino: User Display + File
    persistido: true

Checklist:
  - "[ ] User flow mapped step-by-step"
  - "[ ] Page Object Models created"
  - "[ ] Selectors use data-testid or role-based strategy"
  - "[ ] Happy path tested"
  - "[ ] Key error path tested"
  - "[ ] Accessibility check included"
  - "[ ] No sleep-based waits"
  - "[ ] Tests can run in parallel"
```
-->

# Design E2E Tests

## Purpose

Design end-to-end tests that validate critical user journeys through the full application stack. Produce Playwright/Cypress test specifications with Page Object Models, resilient selectors, and accessibility checks.

## Pre-Conditions

- [ ] Target user flow is identified
- [ ] Application is accessible (URL or local server)
- [ ] E2E framework is detected (Playwright, Cypress, Selenium)

## Execution Steps

### Step 1: Map User Flow

Document the step-by-step user journey:

```
1. User navigates to {page}
2. User sees {element}
3. User interacts with {element} (click, type, select)
4. System responds with {expected behavior}
5. User is redirected to {next page}
```

### Step 2: Create Page Object Models

For each page in the flow, create a POM:

```typescript
export class PageName {
  readonly page: Page;
  readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    this.element = page.getByTestId('element-id');
  }

  async action() { /* ... */ }
}
```

**Selector priority:**
1. `data-testid` — Explicit, resilient
2. `getByRole` — Semantic, accessible
3. `getByLabel` — Form-specific
4. `getByText` — Content-based (less stable)

### Step 3: Design Test Scenarios

Only test what MUST be tested at E2E level:

1. **Critical happy path** — The primary user journey succeeds
2. **Key error path** — The most important error scenario
3. **Accessibility** — WCAG 2.1 AA compliance check
4. **Visual** — Screenshot comparison (if UI-critical)

**Decision: Should this be E2E?**
- Does it require real browser interaction? YES -> E2E
- Can it be verified at API level? -> Push to integration
- Can it be verified with isolated logic? -> Push to unit

### Step 4: Write Test Code

Produce test files following the framework conventions:
- Page Objects in separate files
- Tests use POM methods, not raw selectors
- Wait for state, never sleep
- Each test is independent and parallelizable

### Step 5: Include Accessibility

Add axe-core accessibility audit to at least one test per page:

```typescript
test('should meet WCAG 2.1 AA standards', async ({ page }) => {
  // Navigate to page
  // Run axe-core audit
  // Assert no violations
});
```

## Post-Conditions

- [ ] Critical user journey has E2E test
- [ ] Page Object Models are created for all pages
- [ ] Selectors are resilient (data-testid or role-based)
- [ ] No sleep-based waits used
- [ ] Accessibility check included

## Output Format

```
## E2E Test Specification

### User Flow: {flow name}
### Framework: {Playwright/Cypress}

### Flow Map
{Step-by-step journey}

### Page Objects
{POM code}

### Test Cases
{Complete test code}

### Selector Strategy
{Selectors used and why}

### Estimated: N tests, ~Xs execution
```
