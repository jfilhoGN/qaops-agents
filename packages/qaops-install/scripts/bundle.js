#!/usr/bin/env node

'use strict';

/**
 * Pre-publish bundle script.
 *
 * Copies the QAOps squad files and Claude agent registrations
 * into the package directory so they're included in the npm tarball.
 *
 * Run automatically via `npm publish` (prepublishOnly hook).
 */

const fs = require('node:fs');
const path = require('node:path');

const PACKAGE_ROOT = path.resolve(__dirname, '..');

// Find the aiox-core repo root
function findRepoRoot() {
  let dir = PACKAGE_ROOT;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'squads', 'qaops', 'config.yaml'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  [SKIP] Source not found: ${src}`);
    return 0;
  }

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function main() {
  const repoRoot = findRepoRoot();

  if (!repoRoot) {
    console.error('ERROR: Cannot find aiox-core repo root. Run from within the repository.');
    process.exit(1);
  }

  console.log('Bundling QAOps files for npm publish...\n');
  console.log(`  Repo root: ${repoRoot}`);
  console.log(`  Package:   ${PACKAGE_ROOT}\n`);

  // 1. Copy squads/qaops/ into package
  const squadSrc = path.join(repoRoot, 'squads', 'qaops');
  const squadDest = path.join(PACKAGE_ROOT, 'squads', 'qaops');
  const squadCount = copyDirRecursive(squadSrc, squadDest);
  console.log(`  ✓ Bundled ${squadCount} squad files → squads/qaops/`);

  // 2. Copy .claude/agents/qaops-*.md into package
  const agentsSrc = path.join(repoRoot, '.claude', 'agents');
  const agentsDest = path.join(PACKAGE_ROOT, '.claude', 'agents');
  fs.mkdirSync(agentsDest, { recursive: true });

  let agentCount = 0;
  const agentFiles = fs.readdirSync(agentsSrc).filter(f => f.startsWith('qaops-') && f.endsWith('.md'));
  for (const file of agentFiles) {
    fs.copyFileSync(path.join(agentsSrc, file), path.join(agentsDest, file));
    agentCount++;
  }
  console.log(`  ✓ Bundled ${agentCount} agent files → .claude/agents/`);

  console.log(`\n  Done. Package is ready to publish.\n`);
}

main();
