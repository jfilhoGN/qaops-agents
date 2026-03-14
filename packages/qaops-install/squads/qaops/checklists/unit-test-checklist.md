# Unit Test Quality Checklist

Use this checklist to validate unit test quality before considering tests complete.

## Structure

- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Each test has a single logical assertion (one concept per test)
- [ ] Test names are descriptive and read as documentation
- [ ] Tests are organized by function/method under test (describe blocks)
- [ ] Setup/teardown is used for shared configuration (beforeEach/afterEach)

## Isolation

- [ ] No database calls in unit tests
- [ ] No network/HTTP calls in unit tests
- [ ] No filesystem operations in unit tests
- [ ] External dependencies are mocked at boundaries
- [ ] Internal collaborators use real implementations (not over-mocked)
- [ ] Tests are deterministic (no Date.now(), Math.random(), or timers)

## Coverage

- [ ] All public functions/methods have at least one test
- [ ] Happy path is tested for each function
- [ ] Error/exception paths are tested
- [ ] Boundary values are tested (min, max, empty, null)
- [ ] Equivalence partitions have representative tests
- [ ] Branch coverage >= 85% for business logic

## Quality

- [ ] No flaky tests (run 3x, same result every time)
- [ ] Tests execute in < 5 seconds total
- [ ] No test depends on another test's execution
- [ ] Tests survive code refactoring (test behavior, not implementation)
- [ ] Mock assertions verify correct calls (not just mock existence)

## Framework Compliance

- [ ] Uses project's standard test framework
- [ ] Follows project's naming conventions
- [ ] Integrates with existing test runner configuration
- [ ] Coverage reports are generated correctly
