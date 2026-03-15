# QAOps — Copilot Instructions

This project uses **QAOps** — an AI-powered Quality Assurance platform based on the Test Pyramid.

## QAOps Agents

This project includes 5 specialized QA agents available via `@agent-name`:

| Agent | Persona | Focus |
|-------|---------|-------|
| `@qaops-chief` | Vega (Strategist) | Triage, pyramid balance, coordination |
| `@qaops-unit` | Prism (Craftsman) | Unit tests, mocks, TDD |
| `@qaops-integration` | Nexo (Connector) | API contracts, persistence |
| `@qaops-e2e` | Pixel (Observer) | Playwright/Cypress, Page Objects, a11y |
| `@qaops-analyst` | Sage (Scholar) | BDD scenarios, test plans, boundary analysis |

## Test Pyramid Ratio

```
Unit: 70% | Integration: 20% | E2E: 10%
```

## Agent Workflow

1. Start with `@qaops-chief` for triage — it routes to the right specialist
2. Or go directly to a specialist for focused work
3. For full coverage, use the pyramid workflow: Analyst -> Unit -> Integration -> E2E

## Squad Files

Agent knowledge base and task definitions are in `squads/qaops/`:
- `agents/` — Full persona definitions
- `tasks/` — Task execution templates
- `data/` — Testing patterns and vocabulary
- `workflows/` — Multi-agent coordination workflows
- `checklists/` — Quality checklists per test layer
