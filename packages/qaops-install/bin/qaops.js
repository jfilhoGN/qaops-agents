#!/usr/bin/env node

'use strict';

const path = require('node:path');
const { installQAOps } = require('../src/installer');

const BANNER = `
  ╔══════════════════════════════════════════════╗
  ║     🎯 QAOps — Test Pyramid Squad           ║
  ║     Quality Assurance Specialists            ║
  ╚══════════════════════════════════════════════╝
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'install';

  console.log(BANNER);

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  if (command === 'install') {
    const positionalArgs = args.slice(1).filter(a => !a.startsWith('--'));
    const targetDir = positionalArgs[0] || '.';
    const resolvedTarget = path.resolve(process.cwd(), targetDir);

    const options = {
      targetDir: resolvedTarget,
      force: args.includes('--force'),
      dryRun: args.includes('--dry-run'),
      skipAgents: args.includes('--skip-agents'),
      skipCore: args.includes('--skip-core'),
    };

    try {
      await installQAOps(options);
    } catch (error) {
      console.error(`\n  ❌ Installation failed: ${error.message}`);
      process.exit(1);
    }
  } else if (command === 'validate') {
    const positionalArgs = args.slice(1).filter(a => !a.startsWith('--'));
    const targetDir = positionalArgs[0] || '.';
    const resolvedTarget = path.resolve(process.cwd(), targetDir);
    const { validateInstallation } = require('../src/validator');

    try {
      await validateInstallation(resolvedTarget);
    } catch (error) {
      console.error(`\n  ❌ Validation failed: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.error(`  Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
  Usage: npx @jfilhogn/qaops <command> [target] [options]

  Commands:
    install [dir]     Install QAOps squad into target project (default: .)
    validate [dir]    Validate existing QAOps installation
    help              Show this help message

  Options:
    --force           Overwrite existing files
    --dry-run         Show what would be installed without writing
    --skip-agents     Skip .claude/agents/ registration
    --skip-core       Skip executor-assignment.js modification

  Examples:
    npx @jfilhogn/qaops install              # Install in current directory
    npx @jfilhogn/qaops install ./my-project # Install in specific project
    npx @jfilhogn/qaops install --dry-run    # Preview installation
    npx @jfilhogn/qaops validate             # Check installation integrity
  `);
}

main().catch((error) => {
  console.error(`\n  Fatal error: ${error.message}`);
  process.exit(1);
});
