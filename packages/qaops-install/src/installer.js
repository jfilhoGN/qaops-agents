'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * QAOps Squad Installer
 *
 * Installs the QAOps Test Pyramid squad into an existing project.
 *
 * Steps:
 * 1. Validate target directory exists
 * 2. Copy squads/qaops/ directory
 * 3. Register agents in .claude/agents/ (Claude Code)
 * 4. Register agents in .github/agents/ (GitHub Copilot)
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


/**
 * @param {Object} options
 * @param {string} options.targetDir - Target project root
 * @param {boolean} options.force - Overwrite existing files
 * @param {boolean} options.dryRun - Preview without writing
 * @param {boolean} options.skipAgents - Skip .claude/agents/ registration
 */
async function installQAOps(options) {
  const { targetDir, force, dryRun, skipAgents } = options;

  console.log(`  Target: ${targetDir}`);
  console.log(`  Mode:   ${dryRun ? 'DRY RUN (no files written)' : force ? 'FORCE (overwrite)' : 'NORMAL'}\n`);

  // Step 1: Validate target
  validateTarget(targetDir);

  // Step 2: Resolve source directory
  const sourceDir = resolveSourceDir();

  // Step 3: Copy squad directory
  const squadStats = copySquadDirectory(sourceDir, targetDir, { force, dryRun });

  // Step 4: Register Claude Code agents
  let agentStats = { copied: 0, skipped: 0 };
  if (!skipAgents) {
    agentStats = registerAgents(sourceDir, targetDir, { force, dryRun });
  }

  // Step 5: Register GitHub Copilot agents
  let copilotStats = { copied: 0, skipped: 0 };
  if (!skipAgents) {
    copilotStats = registerCopilotAgents(sourceDir, targetDir, { force, dryRun });
  }

  // Step 6: Summary
  printSummary({
    squadStats,
    agentStats,
    copilotStats,
    dryRun,
    skipAgents,
  });
}

/**
 * Validates that the target directory exists
 */
function validateTarget(targetDir) {
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  console.log('  ✓ Target directory validated\n');
}

/**
 * Resolves the source directory for QAOps files.
 * First checks if running from within the source repo,
 * then falls back to the package's bundled files.
 */
function resolveSourceDir() {
  // Option 1: Running from within the source repo
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
    'within the QAOps repository or have the bundled files.'
  );
}

/**
 * Walks up the directory tree to find the repo root.
 * Prefers the actual git repo root over bundled package directories.
 */
function findRepoRoot() {
  let dir = __dirname;
  let firstMatch = null;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, SQUAD_SOURCE_DIR, 'config.yaml'))) {
      // Prefer actual repo root (has .git/) over bundled package dir
      if (fs.existsSync(path.join(dir, '.git'))) {
        return dir;
      }
      if (!firstMatch) firstMatch = dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return firstMatch;
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
 * Registers QAOps agents in .github/agents/ (GitHub Copilot format)
 */
function registerCopilotAgents(sourceDir, targetDir, options) {
  const agentsDir = path.join(targetDir, '.github', 'agents');
  const srcAgentsDir = path.join(sourceDir, '.github', 'agents');

  const stats = { copied: 0, skipped: 0 };

  console.log('  🐙 Registering agents in .github/agents/ (Copilot)...');

  if (!fs.existsSync(srcAgentsDir)) {
    console.log('     [SKIP] No Copilot agent sources found\n');
    return stats;
  }

  if (!options.dryRun && !fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  for (const agentFile of AGENT_FILES) {
    const srcPath = path.join(srcAgentsDir, agentFile);
    const destPath = path.join(agentsDir, agentFile);

    if (!fs.existsSync(srcPath)) {
      stats.skipped++;
      continue;
    }

    if (fs.existsSync(destPath) && !options.force) {
      stats.skipped++;
      if (options.dryRun) {
        console.log(`     [SKIP] .github/agents/${agentFile}`);
      }
    } else {
      if (options.dryRun) {
        console.log(`     [COPY] .github/agents/${agentFile}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      stats.copied++;
    }
  }

  // Also copy copilot-instructions.md if available
  const instructionsSrc = path.join(sourceDir, '.github', 'copilot-instructions.md');
  const instructionsDest = path.join(targetDir, '.github', 'copilot-instructions.md');
  if (fs.existsSync(instructionsSrc)) {
    if (fs.existsSync(instructionsDest) && !options.force) {
      if (options.dryRun) {
        console.log('     [SKIP] .github/copilot-instructions.md');
      }
    } else {
      if (options.dryRun) {
        console.log('     [COPY] .github/copilot-instructions.md');
      } else {
        fs.copyFileSync(instructionsSrc, instructionsDest);
      }
      stats.copied++;
    }
  }

  console.log(`     ${stats.copied} Copilot agents registered, ${stats.skipped} skipped\n`);
  return stats;
}

/**
 * Prints installation summary
 */
function printSummary({ squadStats, agentStats, copilotStats, dryRun, skipAgents }) {
  const prefix = dryRun ? '  [DRY RUN] ' : '  ';

  console.log('  ═══════════════════════════════════════');
  console.log(`${prefix}✅ QAOps installation ${dryRun ? 'preview' : 'complete'}!`);
  console.log('  ═══════════════════════════════════════\n');

  console.log(`  Squad files:    ${squadStats.copied} copied, ${squadStats.skipped} skipped`);

  if (!skipAgents) {
    console.log(`  Claude agents:  ${agentStats.copied} registered, ${agentStats.skipped} skipped`);
    console.log(`  Copilot agents: ${copilotStats.copied} registered, ${copilotStats.skipped} skipped`);
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
