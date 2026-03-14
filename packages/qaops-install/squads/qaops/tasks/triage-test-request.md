<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: triageTestRequest()
responsavel: "@qaops:qa-chief"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: request
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Non-empty test request description

  - campo: project_context
    tipo: object
    origem: Project Detection
    obrigatorio: false
    validacao: Tech stack profile if available

Saida:
  - campo: routing_decision
    tipo: object
    destino: Return value
    persistido: false

  - campo: specialist_recommendation
    tipo: string
    destino: User Display
    persistido: false

Checklist:
  - "[ ] Request analyzed for keyword matching"
  - "[ ] Pyramid layer(s) identified"
  - "[ ] Specialist agent recommended"
  - "[ ] Multi-agent sequence defined (if cross-layer)"
```
-->

# Triage Test Request

## Purpose

Analyze an incoming test request and route it to the appropriate QAOps specialist agent based on keyword matching against the routing matrix. For cross-layer requests, define a multi-agent sequence following the pyramid workflow.

## Pre-Conditions

- [ ] Request text is non-empty and describes a testing need
- [ ] QAOps squad config is accessible

## Execution Steps

### Step 1: Normalize Request

Normalize the request to lowercase. Extract key terms and context.

### Step 2: Score Against Routing Matrix

For each specialist domain (unit, integration, e2e, analysis), count keyword matches:

| Domain | Keywords | Agent |
|--------|----------|-------|
| Unit | mock, stub, spy, coverage, jest, pytest, junit, tdd, isolated, function, class | qa-unit (Prism) |
| Integration | api, contract, persistence, database, service, endpoint, middleware, http | qa-integration (Nexo) |
| E2E | playwright, cypress, selenium, browser, user-flow, visual, accessibility | qa-e2e (Pixel) |
| Analysis | scenario, acceptance, bdd, gherkin, test-plan, boundary, equivalence, derive | qa-analyst (Sage) |

### Step 3: Determine Routing

- **Single domain wins** (clear majority): Route directly to specialist
- **Multiple domains** (scores within 20%): Recommend multi-agent sequence
- **No clear match**: QA Chief answers directly or asks for clarification

### Step 4: Present Recommendation

Output a structured recommendation with:
- Identified pyramid layer(s)
- Recommended specialist(s) with rationale
- Suggested command to run
- For multi-agent: recommended sequence order

## Post-Conditions

- [ ] User received clear routing recommendation
- [ ] Specialist agent identified with rationale

## Error Handling

| Error | Recovery |
|-------|----------|
| Ambiguous request | Ask user for clarification with specific questions |
| No keyword match | Default to qa-analyst (Sage) for scenario derivation |
| Multi-domain conflict | Present options and let user choose |
