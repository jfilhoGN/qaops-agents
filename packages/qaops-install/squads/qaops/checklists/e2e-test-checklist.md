# E2E Test Quality Checklist

Use this checklist to validate end-to-end test quality.

## Justification

- [ ] Test covers a business-critical user journey
- [ ] Test cannot be adequately covered at unit or integration level
- [ ] Test count is minimal (pyramid top = fewest tests)

## Selectors

- [ ] Uses data-testid or role-based selectors (never CSS classes)
- [ ] Selectors are resilient to styling changes
- [ ] No XPath selectors
- [ ] No positional selectors (nth-child, first-of-type)

## Waits

- [ ] No sleep-based waits (waitForTimeout, page.waitFor(3000))
- [ ] Uses state-based waits (waitForSelector, waitForLoadState)
- [ ] Network idle checks where appropriate
- [ ] Explicit element visibility checks before interaction

## Page Objects

- [ ] Page Object Model used for each page
- [ ] POM encapsulates selectors and actions
- [ ] Tests read like user stories (page.login(), not page.click('#btn'))
- [ ] POMs are reusable across tests

## Accessibility

- [ ] At least one a11y audit per page (axe-core)
- [ ] Keyboard navigation tested for critical flows
- [ ] Screen reader compatibility considered
- [ ] Color contrast meets WCAG 2.1 AA

## Reliability

- [ ] Test passes consistently (run 5x, same result)
- [ ] No dependency on external services (use test environment)
- [ ] Tests can run in parallel (no shared state)
- [ ] Test data is isolated per test
- [ ] Screenshots captured on failure for debugging

## Visual Regression (if applicable)

- [ ] Baseline screenshots established
- [ ] Comparison threshold configured
- [ ] Critical UI states captured
- [ ] Responsive viewports tested
