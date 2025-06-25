#!/usr/bin/env node

// CSV-based test runner for comprehensive testing
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const commands = {
  all: 'npm test',
  coverage: 'npm run test:coverage',
  csv: 'npx jest csvBasedTests.test.js --verbose',
  auth: 'npx jest --testNamePattern="Authentication|AUTH"',
  user: 'npx jest userFunctionTests.test.js --verbose',
  admin: 'npx jest adminFunctionTests.test.js --verbose',
  login: 'npx jest login.test.js --verbose',
  original: 'npx jest login.test.js loginEdgeCases.test.js',
  help: 'show this help'
};

function showHelp() {
  console.log('\nCSV-Based Test Runner');
  console.log('=========================\n');
  console.log('Available commands:');
  console.log('  node test/csvTestRunner.js all        - Run all tests');
  console.log('  node test/csvTestRunner.js coverage   - Run tests with coverage');
  console.log('  node test/csvTestRunner.js csv        - Run CSV-generated tests');
  console.log('  node test/csvTestRunner.js auth       - Run authentication tests');
  console.log('  node test/csvTestRunner.js user       - Run user function tests');
  console.log('  node test/csvTestRunner.js admin      - Run admin function tests');
  console.log('  node test/csvTestRunner.js login      - Run original login tests');
  console.log('  node test/csvTestRunner.js original   - Run original test suite');
  console.log('  node test/csvTestRunner.js help       - Show this help\n');
  
  console.log('Test Categories from CSV:');
  console.log('  • Authorization (AUTH 001-005): Login, logout, registration');
  console.log('  • User Functions (USER 001-010): Cart, checkout, subscription');
  console.log('  • Admin Functions (ADM 001-011): Product & order management\n');
  
  console.log('Test Status Summary:');
  console.log('  • Passed: Tests that are implemented and working');
  console.log('  • Failed: Tests that need fixing');
  console.log('  • Not Run: Tests not yet executed');
  console.log('  • Not Completed: Tests requiring additional implementation\n');
}

function checkCSVFile() {
  const csvPath = path.join(process.cwd(), 'test', 'test-cases-document', 'Function Test Cases.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    console.log('Please ensure the CSV file is in the correct location.');
    return false;
  }
  console.log('CSV file found at:', csvPath);
  return true;
}

function runCommand(command) {
  try {
    console.log(`\nRunning: ${commands[command]}\n`);
    
    if (command === 'csv' || command === 'user' || command === 'admin') {
      if (!checkCSVFile()) {
        return;
      }
    }
    
    execSync(commands[command], { stdio: 'inherit', cwd: process.cwd() });
    
    console.log(`\nCommand completed successfully: ${command}`);
    
    if (command === 'csv') {
      console.log('\nCSV Test Results Summary:');
      console.log('Check the output above for detailed test case results');
      console.log('Each test case from your CSV file has been processed');
    }
    
  } catch (error) {
    console.error(`Command failed: ${error.message}`);
    
    if (command === 'csv') {
      console.log('\nTroubleshooting CSV Tests:');
      console.log('1. Ensure CSV file is in test/test-cases-document/');
      console.log('2. Check that csv-parser is installed: npm install csv-parser');
      console.log('3. Verify CSV file format matches expected structure');
    }
    
    process.exit(1);
  }
}

function showTestCaseOverview() {
  console.log('\nTest Case Overview from CSV:');
  console.log('=====================================');
  
  const testCases = [
    { id: 'AUTH 001', desc: 'Invalid login (missing fields)', status: 'Passed' },
    { id: 'AUTH 002', desc: 'Invalid login (wrong info)', status: 'Passed' },
    { id: 'AUTH 003', desc: 'Successful login', status: 'Passed' },
    { id: 'AUTH 004', desc: 'Successful registration', status: 'Passed' },
    { id: 'AUTH 005', desc: 'Successful logout', status: 'Passed' },
    { id: 'USER 001', desc: 'Add valid product to cart', status: 'Passed' },
    { id: 'USER 002', desc: 'Add out of stock product', status: 'Passed' },
    { id: 'USER 003', desc: 'Remove product from cart', status: 'Passed' },
    { id: 'USER 004', desc: 'Update product quantity', status: 'Passed' },
    { id: 'USER 005', desc: 'Checkout empty cart', status: 'Not Completed' },
    { id: 'USER 006', desc: 'Checkout with products', status: 'Passed' },
    { id: 'USER 007', desc: 'Confirm order', status: 'Passed' },
    { id: 'USER 008', desc: 'Confirm order (missing info)', status: 'Not Run' },
    { id: 'ADM 001', desc: 'Admin successful login', status: 'Passed' },
    { id: 'ADM 002', desc: 'Admin login (missing fields)', status: 'Passed' },
    { id: 'ADM 003', desc: 'Admin login (wrong info)', status: 'Passed' },
    { id: 'ADM 004', desc: 'Admin logout', status: 'Passed' },
    { id: 'ADM 005', desc: 'Add valid product', status: 'Passed' },
    { id: 'ADM 006', desc: 'Add invalid product', status: 'Passed' },
    { id: 'ADM 007', desc: 'Edit product', status: 'Passed' },
    { id: 'ADM 008', desc: 'Edit product (invalid)', status: 'Passed' },
    { id: 'ADM 009', desc: 'Delete product', status: 'Passed' },
    { id: 'ADM 010', desc: 'Update order status', status: 'Passed' },
    { id: 'ADM 011', desc: 'Delete order', status: 'Not Completed' }
  ];
  
  const passed = testCases.filter(tc => tc.status === 'Passed').length;
  const notCompleted = testCases.filter(tc => tc.status === 'Not Completed').length;
  const notRun = testCases.filter(tc => tc.status === 'Not Run').length;
  
  console.log(`Total Test Cases: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Not Completed: ${notCompleted}`);
  console.log(`Not Run: ${notRun}`);
  console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%\n`);
}

const arg = process.argv[2] || 'help';

if (arg === 'help' || !commands[arg]) {
  showHelp();
  if (arg === 'overview') {
    showTestCaseOverview();
  }
  if (!commands[arg] && arg !== 'help' && arg !== 'overview') {
    console.error(`Unknown command: ${arg}`);
    process.exit(1);
  }
} else {
  if (arg === 'all' || arg === 'coverage') {
    showTestCaseOverview();
  }
  runCommand(arg);
}
