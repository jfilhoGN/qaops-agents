# Integration Test Quality Checklist

Use this checklist to validate integration test quality.

## Boundary Definition

- [ ] Integration boundary is clearly identified (API, DB, service)
- [ ] Test focuses on one boundary (narrow integration)
- [ ] API contract is defined (request/response schemas)
- [ ] Error responses are documented with status codes

## Data Management

- [ ] Each test creates its own test data
- [ ] Test data uses factories (no hardcoded IDs)
- [ ] Tests clean up their data after execution
- [ ] No shared state between test files
- [ ] Database transactions or explicit cleanup used

## Contract Compliance

- [ ] Success response matches defined schema
- [ ] Error responses match defined schema
- [ ] Status codes are correct (200, 201, 400, 401, 404, 422, 500)
- [ ] Response headers are validated (Content-Type, etc.)
- [ ] Request validation is tested (missing fields, wrong types)

## Error Handling

- [ ] 4xx errors tested (validation, auth, not found)
- [ ] 5xx error handling tested (or documented as out-of-scope)
- [ ] Timeout scenarios considered
- [ ] Connection failure handling tested
- [ ] Malformed request handling tested

## Persistence

- [ ] Data actually saved in database is verified (not just API response)
- [ ] Data types and constraints are validated
- [ ] Relationships between entities are verified
- [ ] Unique constraints tested (duplicate creation)

## Performance

- [ ] Tests complete within reasonable time (< 30s each)
- [ ] Appropriate timeouts are configured
- [ ] No unnecessary waits or delays
- [ ] Connection pooling is handled correctly
