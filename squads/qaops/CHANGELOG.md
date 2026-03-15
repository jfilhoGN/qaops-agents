# Changelog

## [1.3.0] - 2026-03-15

### Added
- GitHub Copilot agent compatibility — 5 agents in `.github/agents/` format
- `.github/copilot-instructions.md` project-wide instructions for Copilot
- Dual-IDE support: Claude Code (.claude/agents/) + GitHub Copilot (.github/agents/)
- `handoffs` support in Copilot chief agent for agent-to-agent delegation

### Changed
- `findRepoRoot()` now prefers actual git repo root over bundled package directory

## [1.2.0] - 2026-03-15

### Added
- Overlay mode: `npx @jfilhogn/qaops init .` adds QAOps to existing projects
- Overlay preserves existing package.json, .gitignore, .git/, skips npm install

### Fixed
- Repository URLs corrected to jfilhoGN/qaops-agents

## [1.1.0] - 2026-03-15

### Added
- `npx @jfilhogn/qaops init <name>` command to create new QAOps projects from scratch
- Generates .aiox-core/, .claude/, package.json, executor-assignment.js, git init

## [1.0.0] - 2026-03-14

### Added
- QAOps squad with 5 specialized QA agents based on the Test Pyramid
- Tier 0: QA Chief (Vega) — triage and orchestration
- Tier 1: QA Unit (Prism) — unit test specialist
- Tier 1: QA Integration (Nexo) — integration test specialist
- Tier 2: QA E2E (Pixel) — end-to-end test specialist
- Tier 2: QA Analyst (Sage) — test scenario derivation
- 8 task definitions for test design workflows
- 2 workflow definitions (test-pyramid, qa-triage)
- 4 quality checklists (unit, integration, e2e, test-plan)
- 2 document templates (test-plan, test-report)
- 2 reference data files (pyramid-patterns, vocabulary)
- Core executor-assignment.js extended with `testing` story type
