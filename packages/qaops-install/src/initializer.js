'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

/**
 * QAOps Project Initializer
 *
 * Creates a new QAOps project from scratch with all required structure.
 *
 * Steps:
 * 1. Create project directory
 * 2. Initialize package.json
 * 3. Create .claude/ directory (Claude Code)
 * 4. Create .github/ directory (GitHub Copilot)
 * 5. Create .gitignore
 * 6. Install QAOps squad files (both formats)
 * 7. Initialize git repository
 * 8. npm install
 */

const CLAUDE_MD = `# CLAUDE.md - QAOps Project

This project uses **QAOps** — an AI-powered Quality Assurance platform based on the Test Pyramid.

## QAOps Agents

| Agent | Persona | Focus |
|-------|---------|-------|
| \`@qaops-chief\` | Vega (Strategist) | Triage, pyramid balance, coordination |
| \`@qaops-unit\` | Prism (Craftsman) | Unit tests, mocks, TDD |
| \`@qaops-integration\` | Nexo (Connector) | API contracts, persistence |
| \`@qaops-e2e\` | Pixel (Observer) | Playwright/Cypress, Page Objects, a11y |
| \`@qaops-analyst\` | Sage (Scholar) | BDD scenarios, test plans |

## Quick Commands

- \`@qaops-chief "test my auth module"\` — Chief triages and routes
- \`@qaops-unit "design unit tests for validateEmail"\` — Direct to unit specialist
- \`@qaops-analyst "derive scenarios from checkout story"\` — Scenario derivation

## Test Pyramid Ratio

\`\`\`
Unit: 70% | Integration: 20% | E2E: 10%
\`\`\`
`;

const GITIGNORE = `node_modules/
.env
.env.*
*.log
.DS_Store
dist/
coverage/
.eslintcache
`;

const COPILOT_INSTRUCTIONS = `# QAOps — Copilot Instructions

This project uses **QAOps** — an AI-powered Quality Assurance platform based on the Test Pyramid.

## QAOps Agents

This project includes 5 specialized QA agents available via \`@agent-name\`:

| Agent | Persona | Focus |
|-------|---------|-------|
| \`@qaops-chief\` | Vega (Strategist) | Triage, pyramid balance, coordination |
| \`@qaops-unit\` | Prism (Craftsman) | Unit tests, mocks, TDD |
| \`@qaops-integration\` | Nexo (Connector) | API contracts, persistence |
| \`@qaops-e2e\` | Pixel (Observer) | Playwright/Cypress, Page Objects, a11y |
| \`@qaops-analyst\` | Sage (Scholar) | BDD scenarios, test plans, boundary analysis |

## Test Pyramid Ratio

\`\`\`
Unit: 70% | Integration: 20% | E2E: 10%
\`\`\`

## Agent Workflow

1. Start with \`@qaops-chief\` for triage — it routes to the right specialist
2. Or go directly to a specialist for focused work
3. For full coverage, use the pyramid workflow: Analyst -> Unit -> Integration -> E2E

## Squad Files

Agent knowledge base and task definitions are in \`squads/qaops/\`:
- \`agents/\` — Full persona definitions
- \`tasks/\` — Task execution templates
- \`data/\` — Testing patterns and vocabulary
- \`workflows/\` — Multi-agent coordination workflows
- \`checklists/\` — Quality checklists per test layer
`;

/**
 * @param {Object} options
 * @param {string} options.projectName - Name of the project to create
 * @param {boolean} options.skipGit - Skip git init
 * @param {boolean} options.skipInstall - Skip npm install
 */
async function initQAOps(options) {
  const { projectName, skipGit, skipInstall } = options;
  const projectDir = path.resolve(process.cwd(), projectName);
  const isOverlay = projectName === '.';
  const displayName = isOverlay ? path.basename(projectDir) : projectName;

  console.log(`  Project:  ${displayName}`);
  console.log(`  Location: ${projectDir}`);
  console.log(`  Mode:     ${isOverlay ? 'OVERLAY (existing project)' : 'NEW PROJECT'}\n`);

  // Step 1: Create or validate project directory
  if (isOverlay) {
    // Overlay mode: directory must exist
    if (!fs.existsSync(projectDir)) {
      throw new Error('Current directory does not exist.');
    }
    console.log('  ✓ Existing project detected\n');
  } else {
    // New project mode: create directory, fail if not empty
    if (fs.existsSync(projectDir)) {
      const entries = fs.readdirSync(projectDir);
      if (entries.length > 0) {
        throw new Error(
          `Directory "${projectName}" already exists and is not empty. ` +
          `Use "npx @jfilhogn/qaops init ." to add QAOps to an existing project, ` +
          `or choose a different name.`
        );
      }
    } else {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    console.log('  ✓ Project directory created\n');
  }

  // Step 2: Initialize package.json (skip if exists in overlay mode)
  const pkgJsonPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgJsonPath) && isOverlay) {
    console.log('  📦 package.json already exists — skipped\n');
  } else {
    console.log('  📦 Initializing package.json...');
    const packageJson = {
      name: displayName,
      version: '1.0.0',
      description: `${displayName} — QAOps powered project`,
      scripts: {
        test: 'echo "Configure your test runner (jest, vitest, pytest)"',
      },
      keywords: ['qaops', 'testing', 'test-pyramid'],
      license: 'MIT',
    };
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    );
    console.log('     ✓ package.json created\n');
  }

  // Step 3: Create .claude/ directory with CLAUDE.md
  const claudeMdPath = path.join(projectDir, '.claude', 'CLAUDE.md');
  if (fs.existsSync(claudeMdPath) && isOverlay) {
    console.log('  🤖 .claude/CLAUDE.md already exists — skipped');
    console.log('     (QAOps agent docs will be appended via squad install)\n');
  } else {
    console.log('  🤖 Creating .claude/ structure...');
    fs.mkdirSync(path.join(projectDir, '.claude', 'agents'), { recursive: true });
    fs.writeFileSync(claudeMdPath, CLAUDE_MD, 'utf-8');
    console.log('     ✓ .claude/CLAUDE.md created\n');
  }

  // Step 4: Create .github/ directory with copilot-instructions.md
  const copilotMdPath = path.join(projectDir, '.github', 'copilot-instructions.md');
  if (fs.existsSync(copilotMdPath) && isOverlay) {
    console.log('  🐙 .github/copilot-instructions.md already exists — skipped');
    console.log('     (Copilot agents will be installed via squad install)\n');
  } else {
    console.log('  🐙 Creating .github/ structure (Copilot compatibility)...');
    fs.mkdirSync(path.join(projectDir, '.github', 'agents'), { recursive: true });
    fs.writeFileSync(copilotMdPath, COPILOT_INSTRUCTIONS, 'utf-8');
    console.log('     ✓ .github/copilot-instructions.md created\n');
  }

  // Step 5: Create .gitignore (skip if exists in overlay mode)
  const gitignorePath = path.join(projectDir, '.gitignore');
  if (fs.existsSync(gitignorePath) && isOverlay) {
    console.log('  📄 .gitignore already exists — skipped');
  } else {
    fs.writeFileSync(gitignorePath, GITIGNORE, 'utf-8');
  }

  // Step 6: Install QAOps squad (copies agents to both .claude/ and .github/)
  console.log('  🎯 Installing QAOps squad...');
  const { installQAOps } = require('./installer');
  await installQAOps({
    targetDir: projectDir,
    force: true,
    dryRun: false,
    skipAgents: false,
  });

  // Step 7: Initialize git (skip if .git/ already exists)
  const hasGit = fs.existsSync(path.join(projectDir, '.git'));
  if (!skipGit && !hasGit) {
    console.log('  📁 Initializing git repository...');
    try {
      execSync('git init', { cwd: projectDir, stdio: 'pipe' });
      execSync('git add -A', { cwd: projectDir, stdio: 'pipe' });
      execSync('git commit -m "feat: init QAOps project"', { cwd: projectDir, stdio: 'pipe' });
      console.log('     ✓ Git initialized with first commit\n');
    } catch {
      console.log('     ⚠ Git init failed (git may not be installed)\n');
    }
  } else if (hasGit) {
    console.log('  📁 Git repository already exists — skipped init\n');
  }

  // Step 8: npm install (optional, skip in overlay mode)
  if (!skipInstall && !isOverlay) {
    console.log('  📦 Installing dependencies...');
    try {
      execSync('npm install', { cwd: projectDir, stdio: 'pipe', timeout: 60000 });
      console.log('     ✓ Dependencies installed\n');
    } catch {
      console.log('     ⚠ npm install failed (run manually: cd ' + displayName + ' && npm install)\n');
    }
  }

  // Summary
  console.log('  ═══════════════════════════════════════');
  if (isOverlay) {
    console.log('  ✅ QAOps added to existing project!');
  } else {
    console.log('  ✅ QAOps project created successfully!');
  }
  console.log('  ═══════════════════════════════════════\n');

  if (isOverlay) {
    console.log(`  📋 Next steps:
     1. Open with your IDE
     2. Activate the QA Chief:  @qaops-chief "test my feature"
     3. Or go to a specialist:  @qaops-unit, @qaops-integration, @qaops-e2e
     4. Full pyramid:           @qaops-chief "*test-pyramid login validation"

  🔌 Supported IDEs:
     - Claude Code / Cursor   → .claude/agents/ (auto-detected)
     - GitHub Copilot (VSCode) → .github/agents/ (auto-detected)
  `);
  } else {
    console.log(`  📋 Next steps:
     1. cd ${projectName}
     2. Open with your IDE
     3. Activate the QA Chief:  @qaops-chief "test my feature"
     4. Or go to a specialist:  @qaops-unit, @qaops-integration, @qaops-e2e
     5. Full pyramid:           @qaops-chief "*test-pyramid login validation"

  🔌 Supported IDEs:
     - Claude Code / Cursor   → .claude/agents/ (auto-detected)
     - GitHub Copilot (VSCode) → .github/agents/ (auto-detected)
  `);
  }
}

module.exports = { initQAOps };
