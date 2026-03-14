'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * QAOps Installation Validator
 *
 * Validates that the QAOps squad is correctly installed in a target project.
 *
 * Checks:
 * 1. Squad directory structure exists
 * 2. All agent files present
 * 3. Claude Code agent registrations exist
 * 4. Executor assignment has testing story type
 * 5. Config files are parseable
 */

const REQUIRED_SQUAD_FILES = [
  'squads/qaops/config.yaml',
  'squads/qaops/agents/qa-chief.md',
  'squads/qaops/agents/qa-unit.md',
  'squads/qaops/agents/qa-integration.md',
  'squads/qaops/agents/qa-e2e.md',
  'squads/qaops/agents/qa-analyst.md',
  'squads/qaops/data/test-pyramid-patterns.yaml',
  'squads/qaops/data/testing-vocabulary.yaml',
  'squads/qaops/tasks/triage-test-request.md',
  'squads/qaops/tasks/design-unit-tests.md',
  'squads/qaops/tasks/design-integration-tests.md',
  'squads/qaops/tasks/design-e2e-tests.md',
  'squads/qaops/tasks/derive-test-scenarios.md',
  'squads/qaops/tasks/generate-test-plan.md',
  'squads/qaops/tasks/pyramid-coverage-report.md',
  'squads/qaops/tasks/validate-test-architecture.md',
  'squads/qaops/workflows/wf-test-pyramid.yaml',
  'squads/qaops/workflows/wf-qa-triage.yaml',
  'squads/qaops/checklists/unit-test-checklist.md',
  'squads/qaops/checklists/integration-test-checklist.md',
  'squads/qaops/checklists/e2e-test-checklist.md',
  'squads/qaops/checklists/test-plan-checklist.md',
  'squads/qaops/templates/test-plan-tmpl.yaml',
  'squads/qaops/templates/test-report-tmpl.yaml',
];

const REQUIRED_AGENT_FILES = [
  '.claude/agents/qaops-chief.md',
  '.claude/agents/qaops-unit.md',
  '.claude/agents/qaops-integration.md',
  '.claude/agents/qaops-e2e.md',
  '.claude/agents/qaops-analyst.md',
];

/**
 * @param {string} targetDir - Target project root
 */
async function validateInstallation(targetDir) {
  console.log(`  Validating QAOps installation in: ${targetDir}\n`);

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: [],
  };

  // Check 1: Squad directory exists
  checkExists(targetDir, 'squads/qaops', 'Squad directory', results);

  // Check 2: All squad files present
  console.log('  📦 Squad files...');
  for (const file of REQUIRED_SQUAD_FILES) {
    checkExists(targetDir, file, file, results);
  }
  console.log('');

  // Check 3: Claude Code agent registrations
  console.log('  🤖 Agent registrations...');
  for (const file of REQUIRED_AGENT_FILES) {
    checkExists(targetDir, file, file, results);
  }
  console.log('');

  // Check 4: Executor assignment patch
  console.log('  ⚙️  Core integration...');
  checkExecutorAssignment(targetDir, results);
  console.log('');

  // Check 5: Config parseable
  console.log('  📋 Config validation...');
  checkConfigParseable(targetDir, results);
  console.log('');

  // Summary
  printValidationSummary(results);

  if (results.failed > 0) {
    throw new Error(`Validation failed: ${results.failed} check(s) did not pass`);
  }
}

function checkExists(targetDir, relativePath, label, results) {
  const fullPath = path.join(targetDir, relativePath);
  if (fs.existsSync(fullPath)) {
    results.passed++;
  } else {
    console.log(`     ✗ Missing: ${label}`);
    results.failed++;
    results.details.push(`Missing: ${label}`);
  }
}

function checkExecutorAssignment(targetDir, results) {
  const filePath = path.join(
    targetDir,
    '.aiox-core',
    'core',
    'orchestration',
    'executor-assignment.js'
  );

  if (!fs.existsSync(filePath)) {
    console.log('     ⚠ executor-assignment.js not found (non-standard layout)');
    results.warnings++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('testing:') && content.includes('test_pyramid')) {
    console.log('     ✓ testing story type present in executor-assignment.js');
    results.passed++;
  } else {
    console.log('     ✗ testing story type NOT found in executor-assignment.js');
    results.failed++;
    results.details.push('Missing testing story type in executor-assignment.js');
  }
}

function checkConfigParseable(targetDir, results) {
  const configPath = path.join(targetDir, 'squads', 'qaops', 'config.yaml');

  if (!fs.existsSync(configPath)) {
    console.log('     ✗ config.yaml not found');
    results.failed++;
    return;
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  // Basic YAML structure check (no external dependency needed)
  if (content.includes('squad:') && content.includes('agents:') && content.includes('tiers:')) {
    console.log('     ✓ config.yaml has valid structure');
    results.passed++;
  } else {
    console.log('     ✗ config.yaml missing required sections (squad, agents, tiers)');
    results.failed++;
    results.details.push('config.yaml malformed');
  }

  // Check agent files reference valid personas
  const agentFiles = ['qa-chief.md', 'qa-unit.md', 'qa-integration.md', 'qa-e2e.md', 'qa-analyst.md'];
  for (const agentFile of agentFiles) {
    const agentPath = path.join(targetDir, 'squads', 'qaops', 'agents', agentFile);
    if (fs.existsSync(agentPath)) {
      const agentContent = fs.readFileSync(agentPath, 'utf-8');
      if (agentContent.includes('## Persona') || agentContent.includes('## Identity')) {
        results.passed++;
      } else {
        console.log(`     ⚠ ${agentFile} may be missing persona section`);
        results.warnings++;
      }
    }
  }
}

function printValidationSummary(results) {
  console.log('  ═══════════════════════════════════════');
  console.log('  📊 Validation Summary');
  console.log('  ═══════════════════════════════════════\n');

  console.log(`  ✓ Passed:   ${results.passed}`);
  console.log(`  ✗ Failed:   ${results.failed}`);
  console.log(`  ⚠ Warnings: ${results.warnings}`);

  if (results.details.length > 0) {
    console.log('\n  Issues:');
    for (const detail of results.details) {
      console.log(`     - ${detail}`);
    }
  }

  if (results.failed === 0) {
    console.log('\n  ✅ QAOps installation is valid!\n');
  } else {
    console.log('\n  ❌ QAOps installation has issues. Run `npx @jfilhogn/qaops install --force` to repair.\n');
  }
}

module.exports = { validateInstallation };
