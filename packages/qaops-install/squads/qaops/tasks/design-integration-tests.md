<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: designIntegrationTests()
responsavel: "@qaops:qa-integration"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: target
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: API endpoint, service, or repository to test

  - campo: scenarios
    tipo: array
    origem: qa-analyst output (optional)
    obrigatorio: false
    validacao: Derived test scenarios from Sage

Saida:
  - campo: integration_test_spec
    tipo: string
    destino: User Display + File
    persistido: true

  - campo: contract_definition
    tipo: object
    destino: User Display
    persistido: false

Checklist:
  - "[ ] Target boundary identified"
  - "[ ] API contract defined (request/response schemas)"
  - "[ ] Success scenarios covered"
  - "[ ] Error scenarios covered (4xx, 5xx, timeouts)"
  - "[ ] Data persistence verified"
  - "[ ] Test data setup/teardown strategy defined"
  - "[ ] Schema validation included"
  - "[ ] Test code follows narrow integration pattern"
```
-->

# Design Integration Tests

## Purpose

Design integration tests that verify the correct interaction between system components at their boundaries. Focus on API contracts, database persistence, and service communication.

## Pre-Conditions

- [ ] Target boundary is identified (API endpoint, service, repository)
- [ ] API documentation or code is accessible
- [ ] Test database or container strategy is known

## Execution Steps

### Step 1: Identify Integration Boundary

Determine the type of integration being tested:
- **API endpoint** — HTTP request/response contract
- **Database persistence** — Data saved/retrieved correctly
- **Service-to-service** — Inter-service communication
- **Middleware** — Request/response pipeline behavior

### Step 2: Define Contract

For API integrations, define the contract:

```yaml
contract:
  endpoint: "{METHOD} {path}"
  request:
    headers: {required headers}
    body: {schema}
  responses:
    200: {success schema}
    400: {validation error schema}
    401: {authentication error schema}
    404: {not found schema}
    500: {server error schema}
```

### Step 3: Design Test Data Strategy

1. **Setup** — Create test data using factories (never hardcoded IDs)
2. **Isolation** — Each test creates its own data, no shared state
3. **Teardown** — Clean up all test data after each test
4. **Strategy options** — Transaction rollback, explicit delete, test containers

### Step 4: Write Integration Tests

For each boundary:

1. **Contract compliance** — Response matches defined schema
2. **Success path** — Valid request produces correct response + side effects
3. **Persistence verification** — Data actually saved in database
4. **Error paths** — Invalid input (422), unauthorized (401), not found (404)
5. **Edge cases** — Duplicate creation, concurrent requests, large payloads
6. **Timeout handling** — What happens when downstream is slow

### Step 5: Define Test Execution Plan

- Estimated execution time per test
- Database setup requirements
- Environment variables needed
- Test ordering considerations (if any)

## Post-Conditions

- [ ] All contract endpoints have at least one success and one error test
- [ ] Persistence is verified (data saved matches data sent)
- [ ] Error paths are tested with correct status codes
- [ ] Test data is properly cleaned up

## Output Format

```
## Integration Test Specification

### Target: {endpoint/service/repository}
### Framework: {Supertest/Pact/httpx}

### Contract Definition
{YAML contract}

### Fixture Strategy
{Setup/teardown approach}

### Test Cases
{Complete test code}

### Estimated: N tests, ~Xs execution
```
