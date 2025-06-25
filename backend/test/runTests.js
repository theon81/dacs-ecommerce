#!/usr/bin/env node

// Simple test runner for login functionality
import { execSync } from 'child_process';

const commands = {
  all: 'npm test',
  coverage: 'npm run test:coverage',
  watch: 'npm run test:watch',
  login: 'npx jest --testNamePattern="Login"',
  verbose: 'npx jest --verbose',
  help: 'show this help'
};

function showHelp() {
  console.log('\n🧪 Login Test Runner');
  console.log('====================\n');
  console.log('Available commands:');
  console.log('  node test/runTests.js all        - Run all tests');
  console.log('  node test/runTests.js coverage   - Run tests with coverage');
  console.log('  node test/runTests.js watch      - Run tests in watch mode');
  console.log('  node test/runTests.js login      - Run only login tests');
  console.log('  node test/runTests.js verbose    - Run tests with verbose output');
  console.log('  node test/runTests.js help       - Show this help\n');
}

function runCommand(command) {
  try {
    console.log(`\n🚀 Running: ${commands[command]}\n`);
    execSync(commands[command], { stdio: 'inherit', cwd: process.cwd() });
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

const arg = process.argv[2] || 'all';

if (arg === 'help' || !commands[arg]) {
  showHelp();
  if (!commands[arg] && arg !== 'help') {
    console.error(`❌ Unknown command: ${arg}`);
    process.exit(1);
  }
} else {
  runCommand(arg);
}
