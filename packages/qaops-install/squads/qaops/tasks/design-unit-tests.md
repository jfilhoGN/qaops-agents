<!--
## Task Definition (AIOX Task Format V1.0)

```yaml
task: designUnitTests()
responsavel: "@qaops:qa-unit"
responsavel_type: Squad Agent
atomic_layer: Organism

Entrada:
  - campo: target
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Path to function/class/module or description

  - campo: scenarios
    tipo: array
    origem: qa-analyst output (optional)
    obrigatorio: false
    validacao: Derived test scenarios from Sage

Saida:
  - campo: unit_test_spec
    tipo: string
    destino: User Display + File
    persistido: true

  - campo: mock_strategy
    tipo: object
    destino: User Display
    persistido: false

Checklist:
  - "[ ] Target code read and analyzed"
  - "[ ] Dependencies identified for mocking"
  - "[ ] Equivalence partitions covered"
  - "[ ] Boundary values tested"
  - "[ ] Negative scenarios included"
  - "[ ] Mock strategy documented"
  - "[ ] Coverage target defined"
  - "[ ] Test code follows AAA pattern"
```
-->

# Design Unit Tests

## Purpose

Design comprehensive unit tests for a target function, class, or module. Produce test specifications that are framework-aware, follow AAA pattern, and cover all equivalence partitions and boundary values.

## Pre-Conditions

- [ ] Target code is accessible (file path provided or code shared)
- [ ] Project's test framework is detected (Jest, Vitest, PyTest, JUnit)

## Execution Steps

### Step 1: Analyze Target Code

1. Read the target function/class/module
2. Identify public API surface (functions, methods, return types)
3. Identify dependencies (imports, injected services, external calls)
4. Identify input domains (types, ranges, constraints)

### Step 2: Build Mock Strategy

For each dependency, decide:

| Dependency Type | Strategy | Rationale |
|----------------|----------|-----------|
| External API call | Mock | Isolation from network |
| Database query | Mock | Isolation from persistence |
| Filesystem operation | Mock | Isolation from OS |
| Internal collaborator (same module) | Real | Test real interaction |
| Configuration/constants | Stub | Control test inputs |
| Time/random | Stub | Deterministic results |

### Step 3: Define Test Cases

For each public function/method:

1. **Happy path** — Standard valid input produces expected output
2. **Equivalence partitions** — One test per input class (valid/invalid)
3. **Boundary values** — Test at min, min+1, max-1, max boundaries
4. **Error cases** — Invalid input, null/undefined, type mismatches
5. **Edge cases** — Empty arrays, zero values, max length strings

### Step 4: Write Test Code

Produce complete test file following the project's framework conventions:
- Framework-specific syntax (describe/it, def test_*, @Test)
- AAA pattern in every test
- Descriptive test names that read as documentation
- Proper setup/teardown for mocks

### Step 5: Define Coverage Target

- Line coverage: >= 90% for business logic
- Branch coverage: >= 85% for conditional logic
- Function coverage: 100% for public API

## Post-Conditions

- [ ] All equivalence partitions have at least one test
- [ ] All boundary values are tested
- [ ] Negative scenarios are included
- [ ] Mock strategy is documented
- [ ] Test code is syntactically valid for the detected framework

## Output Format

```
## Unit Test Specification

### Target: {function/class name}
### Framework: {Jest/Vitest/PyTest/JUnit}

### Mock Strategy
| Dependency | Mock Type | Rationale |
|-----------|-----------|-----------|

### Test Cases
{Complete test code}

### Coverage Target
- Line: X%
- Branch: X%
- Estimated test count: N tests, ~Xms execution
```
