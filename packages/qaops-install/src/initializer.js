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
 * 3. Create .aiox-core/ minimal structure
 * 4. Create .claude/ directory
 * 5. Install QAOps squad files
 * 6. Initialize git repository
 */

const CORE_CONFIG = `# QAOps Project Configuration
project:
  name: "{PROJECT_NAME}"
  type: qaops
  version: 1.0.0

boundary:
  frameworkProtection: false

agents:
  qa-chief:
    id: qa-chief
    persona: Vega
    tier: 0
  qa-unit:
    id: qa-unit
    persona: Prism
    tier: 1
  qa-integration:
    id: qa-integration
    persona: Nexo
    tier: 1
  qa-e2e:
    id: qa-e2e
    persona: Pixel
    tier: 2
  qa-analyst:
    id: qa-analyst
    persona: Sage
    tier: 2
`;

const EXECUTOR_ASSIGNMENT = `'use strict';

/**
 * Executor Assignment Table
 *
 * Maps story types to executors based on keyword scoring.
 */

const EXECUTOR_ASSIGNMENT_TABLE = {
  testing: {
    keywords: [
      'test', 'testing', 'unit_test', 'integration_test', 'e2e',
      'end_to_end', 'coverage', 'mock', 'stub', 'fixture',
      'test_plan', 'test_strategy', 'test_pyramid', 'playwright',
      'cypress', 'jest', 'pytest', 'acceptance_test', 'test_scenario', 'test_suite',
    ],
    executor: '@qa',
    quality_gate: '@architect',
    quality_gate_tools: ['test_review', 'coverage_validation', 'pyramid_balance_check'],
  },
};

/**
 * Detect story type from title/description using keyword scoring.
 */
function detectStoryType(text) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9_\\s]/g, ' ');
  const words = normalized.split(/\\s+/);

  let bestType = null;
  let bestScore = 0;

  for (const [type, config] of Object.entries(EXECUTOR_ASSIGNMENT_TABLE)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (words.includes(keyword) || normalized.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  return bestType;
}

module.exports = { EXECUTOR_ASSIGNMENT_TABLE, detectStoryType };
`;

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

/**
 * @param {Object} options
 * @param {string} options.projectName - Name of the project to create
 * @param {boolean} options.skipGit - Skip git init
 * @param {boolean} options.skipInstall - Skip npm install
 */
async function initQAOps(options) {
  const { projectName, skipGit, skipInstall } = options;
  const projectDir = path.resolve(process.cwd(), projectName);

  console.log(`  Project:  ${projectName}`);
  console.log(`  Location: ${projectDir}\n`);

  // Step 1: Create project directory
  if (fs.existsSync(projectDir)) {
    const entries = fs.readdirSync(projectDir);
    if (entries.length > 0) {
      throw new Error(
        `Directory "${projectName}" already exists and is not empty. ` +
        `Use --force to overwrite or choose a different name.`
      );
    }
  } else {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  console.log('  ✓ Project directory created\n');

  // Step 2: Initialize package.json
  console.log('  📦 Initializing package.json...');
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: `${projectName} — QAOps powered project`,
    scripts: {
      test: 'echo "Configure your test runner (jest, vitest, pytest)"',
    },
    keywords: ['qaops', 'testing', 'test-pyramid'],
    license: 'MIT',
  };
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  );
  console.log('     ✓ package.json created\n');

  // Step 3: Create .aiox-core/ minimal structure
  console.log('  ⚙️  Creating .aiox-core/ structure...');
  const aioxDirs = [
    '.aiox-core',
    '.aiox-core/core',
    '.aiox-core/core/orchestration',
    '.aiox-core/data',
  ];
  for (const dir of aioxDirs) {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  }

  // core-config.yaml
  fs.writeFileSync(
    path.join(projectDir, '.aiox-core', 'core-config.yaml'),
    CORE_CONFIG.replace('{PROJECT_NAME}', projectName),
    'utf-8'
  );

  // executor-assignment.js
  fs.writeFileSync(
    path.join(projectDir, '.aiox-core', 'core', 'orchestration', 'executor-assignment.js'),
    EXECUTOR_ASSIGNMENT,
    'utf-8'
  );

  console.log('     ✓ .aiox-core/ with core-config and executor-assignment\n');

  // Step 4: Create .claude/ directory with CLAUDE.md
  console.log('  🤖 Creating .claude/ structure...');
  fs.mkdirSync(path.join(projectDir, '.claude', 'agents'), { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, '.claude', 'CLAUDE.md'),
    CLAUDE_MD,
    'utf-8'
  );
  console.log('     ✓ .claude/CLAUDE.md created\n');

  // Step 5: Create .gitignore
  fs.writeFileSync(
    path.join(projectDir, '.gitignore'),
    GITIGNORE,
    'utf-8'
  );

  // Step 6: Install QAOps squad
  console.log('  🎯 Installing QAOps squad...');
  const { installQAOps } = require('./installer');
  await installQAOps({
    targetDir: projectDir,
    force: true,
    dryRun: false,
    skipAgents: false,
    skipCore: true, // Already created executor-assignment above
  });

  // Step 7: Initialize git
  if (!skipGit) {
    console.log('  📁 Initializing git repository...');
    try {
      execSync('git init', { cwd: projectDir, stdio: 'pipe' });
      execSync('git add -A', { cwd: projectDir, stdio: 'pipe' });
      execSync('git commit -m "feat: init QAOps project"', { cwd: projectDir, stdio: 'pipe' });
      console.log('     ✓ Git initialized with first commit\n');
    } catch {
      console.log('     ⚠ Git init failed (git may not be installed)\n');
    }
  }

  // Step 8: npm install (optional)
  if (!skipInstall) {
    console.log('  📦 Installing dependencies...');
    try {
      execSync('npm install', { cwd: projectDir, stdio: 'pipe', timeout: 60000 });
      console.log('     ✓ Dependencies installed\n');
    } catch {
      console.log('     ⚠ npm install failed (run manually: cd ' + projectName + ' && npm install)\n');
    }
  }

  // Summary
  console.log('  ═══════════════════════════════════════');
  console.log('  ✅ QAOps project created successfully!');
  console.log('  ═══════════════════════════════════════\n');

  console.log(`  📋 Next steps:
     1. cd ${projectName}
     2. Open with your IDE (Claude Code, Cursor, etc.)
     3. Activate the QA Chief:  @qaops-chief "test my feature"
     4. Or go to a specialist:  @qaops-unit, @qaops-integration, @qaops-e2e
     5. Full pyramid:           @qaops-chief "*test-pyramid login validation"
  `);
}

module.exports = { initQAOps };
