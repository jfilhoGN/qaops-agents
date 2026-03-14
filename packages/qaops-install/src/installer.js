'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * QAOps Squad Installer
 *
 * Installs the QAOps Test Pyramid squad into an existing AIOX project.
 *
 * Steps:
 * 1. Validate target is an AIOX project
 * 2. Copy squads/qaops/ directory
 * 3. Register agents in .claude/agents/
 * 4. Patch executor-assignment.js with testing story type
 * 5. Validate installation
 */

const SQUAD_SOURCE_DIR = 'squads/qaops';

const AGENT_FILES = [
  'qaops-chief.md',
  'qaops-unit.md',
  'qaops-integration.md',
  'qaops-e2e.md',
  'qaops-analyst.md',
];

const TESTING_STORY_TYPE = `
  // Testing: test design, test strategy, coverage, QA (added by QAOps installer)
  testing: {
    keywords: [
      'test',
      'testing',
      'unit_test',
      'integration_test',
      'e2e',
      'end_to_end',
      'coverage',
      'mock',
      'stub',
      'fixture',
      'test_plan',
      'test_strategy',
      'test_pyramid',
      'playwright',
      'cypress',
      'jest',
      'pytest',
      'acceptance_test',
      'test_scenario',
      'test_suite',
    ],
    executor: '@qa',
    quality_gate: '@architect',
    quality_gate_tools: ['test_review', 'coverage_validation', 'pyramid_balance_check'],
  },`;

/**
 * @param {Object} options
 * @param {string} options.targetDir - Target project root
 * @param {boolean} options.force - Overwrite existing files
 * @param {boolean} options.dryRun - Preview without writing
 * @param {boolean} options.skipAgents - Skip .claude/agents/ registration
 * @param {boolean} options.skipCore - Skip executor-assignment.js patch
 */
async function installQAOps(options) {
  const { targetDir, force, dryRun, skipAgents, skipCore } = options;

  console.log(`  Target: ${targetDir}`);
  console.log(`  Mode:   ${dryRun ? 'DRY RUN (no files written)' : force ? 'FORCE (overwrite)' : 'NORMAL'}\n`);

  // Step 1: Validate target
  validateTarget(targetDir);

  // Step 2: Resolve source directory
  const sourceDir = resolveSourceDir();

  // Step 3: Copy squad directory
  const squadStats = copySquadDirectory(sourceDir, targetDir, { force, dryRun });

  // Step 4: Register agents
  let agentStats = { copied: 0, skipped: 0 };
  if (!skipAgents) {
    agentStats = registerAgents(sourceDir, targetDir, { force, dryRun });
  }

  // Step 5: Patch executor-assignment.js
  let corePatched = false;
  if (!skipCore) {
    corePatched = patchExecutorAssignment(targetDir, { force, dryRun });
  }

  // Step 6: Summary
  printSummary({
    squadStats,
    agentStats,
    corePatched,
    dryRun,
    skipAgents,
    skipCore,
  });
}

/**
 * Validates that the target directory is an AIOX project
 */
function validateTarget(targetDir) {
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  const aioxCore = path.join(targetDir, '.aiox-core');
  if (!fs.existsSync(aioxCore)) {
    throw new Error(
      `Not an AIOX project (missing .aiox-core/). ` +
      `Run 'npx aiox-core install' first to set up AIOX.`
    );
  }

  const claudeDir = path.join(targetDir, '.claude');
  if (!fs.existsSync(claudeDir)) {
    throw new Error(
      `Missing .claude/ directory. ` +
      `Run 'npx aiox-core install' first to set up Claude Code integration.`
    );
  }

  console.log('  ✓ Target is a valid AIOX project\n');
}

/**
 * Resolves the source directory for QAOps files.
 * First checks if running from within the aiox-core repo,
 * then falls back to the package's bundled files.
 */
function resolveSourceDir() {
  // Option 1: Running from within aiox-core repo
  const repoRoot = findRepoRoot();
  if (repoRoot) {
    const squadDir = path.join(repoRoot, SQUAD_SOURCE_DIR);
    if (fs.existsSync(squadDir)) {
      console.log(`  Source: ${repoRoot} (repo)\n`);
      return repoRoot;
    }
  }

  // Option 2: Bundled files in this package
  const packageRoot = path.resolve(__dirname, '..');
  const bundledSquad = path.join(packageRoot, SQUAD_SOURCE_DIR);
  if (fs.existsSync(bundledSquad)) {
    console.log(`  Source: ${packageRoot} (package)\n`);
    return packageRoot;
  }

  throw new Error(
    'Cannot find QAOps source files. Ensure you are running from ' +
    'within the aiox-core repository or have the bundled files.'
  );
}

/**
 * Walks up the directory tree to find the aiox-core repo root
 */
function findRepoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, SQUAD_SOURCE_DIR, 'config.yaml'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Recursively copies the squad directory
 */
function copySquadDirectory(sourceDir, targetDir, options) {
  const srcSquad = path.join(sourceDir, SQUAD_SOURCE_DIR);
  const destSquad = path.join(targetDir, SQUAD_SOURCE_DIR);

  const stats = { copied: 0, skipped: 0, dirs: 0 };

  console.log('  📦 Installing QAOps squad...');

  copyDirRecursive(srcSquad, destSquad, options, stats);

  console.log(`     ${stats.copied} files copied, ${stats.skipped} skipped, ${stats.dirs} dirs created\n`);
  return stats;
}

/**
 * Recursively copies a directory
 */
function copyDirRecursive(src, dest, options, stats) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }

  if (!options.dryRun && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    stats.dirs++;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, options, stats);
    } else {
      if (fs.existsSync(destPath) && !options.force) {
        stats.skipped++;
        if (options.dryRun) {
          console.log(`     [SKIP] ${path.relative(options.targetDir || dest, destPath)}`);
        }
      } else {
        if (options.dryRun) {
          console.log(`     [COPY] ${path.relative(options.targetDir || dest, destPath)}`);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
        stats.copied++;
      }
    }
  }
}

/**
 * Registers QAOps agents in .claude/agents/
 */
function registerAgents(sourceDir, targetDir, options) {
  const agentsDir = path.join(targetDir, '.claude', 'agents');
  const srcAgentsDir = path.join(sourceDir, '.claude', 'agents');

  const stats = { copied: 0, skipped: 0 };

  console.log('  🤖 Registering agents in .claude/agents/...');

  if (!options.dryRun && !fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  for (const agentFile of AGENT_FILES) {
    const srcPath = path.join(srcAgentsDir, agentFile);
    const destPath = path.join(agentsDir, agentFile);

    if (!fs.existsSync(srcPath)) {
      // If not found in .claude/agents source, try generating from template
      console.log(`     [WARN] Source agent not found: ${agentFile}`);
      stats.skipped++;
      continue;
    }

    if (fs.existsSync(destPath) && !options.force) {
      stats.skipped++;
      if (options.dryRun) {
        console.log(`     [SKIP] .claude/agents/${agentFile}`);
      }
    } else {
      if (options.dryRun) {
        console.log(`     [COPY] .claude/agents/${agentFile}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      stats.copied++;
    }
  }

  console.log(`     ${stats.copied} agents registered, ${stats.skipped} skipped\n`);
  return stats;
}

/**
 * Patches executor-assignment.js to add the testing story type
 */
function patchExecutorAssignment(targetDir, options) {
  const filePath = path.join(
    targetDir,
    '.aiox-core',
    'core',
    'orchestration',
    'executor-assignment.js'
  );

  console.log('  ⚙️  Patching executor-assignment.js...');

  if (!fs.existsSync(filePath)) {
    console.log('     [SKIP] File not found (not a standard AIOX layout)\n');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if already patched
  if (content.includes('testing:') && content.includes('test_pyramid')) {
    console.log('     [SKIP] Already contains testing story type\n');
    return false;
  }

  // Find the closing of the EXECUTOR_ASSIGNMENT_TABLE
  const marker = "quality_gate_tools: ['architecture_review', 'impact_analysis'],\n  },\n};";

  if (!content.includes(marker)) {
    console.log('     [WARN] Could not find insertion point. Manual patch needed.\n');
    return false;
  }

  if (options.dryRun) {
    console.log('     [PATCH] Would add testing story type\n');
    return true;
  }

  const patched = content.replace(
    marker,
    `quality_gate_tools: ['architecture_review', 'impact_analysis'],\n  },\n${TESTING_STORY_TYPE}\n};`
  );

  fs.writeFileSync(filePath, patched, 'utf-8');
  console.log('     ✓ Added testing story type\n');
  return true;
}

/**
 * Prints installation summary
 */
function printSummary({ squadStats, agentStats, corePatched, dryRun, skipAgents, skipCore }) {
  const prefix = dryRun ? '  [DRY RUN] ' : '  ';

  console.log('  ═══════════════════════════════════════');
  console.log(`${prefix}✅ QAOps installation ${dryRun ? 'preview' : 'complete'}!`);
  console.log('  ═══════════════════════════════════════\n');

  console.log(`  Squad files:    ${squadStats.copied} copied, ${squadStats.skipped} skipped`);

  if (!skipAgents) {
    console.log(`  Agent files:    ${agentStats.copied} registered, ${agentStats.skipped} skipped`);
  }

  if (!skipCore) {
    console.log(`  Core patched:   ${corePatched ? 'Yes (testing story type added)' : 'No (already patched or skipped)'}`);
  }

  console.log(`
  📋 Next steps:
     1. Activate the QA Chief:  Ask Claude to use @qaops-chief
     2. Or go to a specialist:  @qaops-analyst, @qaops-unit, @qaops-integration, @qaops-e2e
     3. Try the full pyramid:   "Use @qaops-chief for *test-pyramid login validation"
     4. Validate installation:  npx @jfilhogn/qaops validate
  `);
}

module.exports = { installQAOps };
