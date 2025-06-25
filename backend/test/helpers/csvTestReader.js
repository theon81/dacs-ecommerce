import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

export class TestCaseReader {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath;
    this.testCases = [];
  }

  async readTestCases() {
    return new Promise((resolve, reject) => {
      const results = [];
      let lineNumber = 0;
      
      fs.createReadStream(this.csvFilePath)
        .pipe(csv({
          skipEmptyLines: true,
          headers: ['col1', 'category', 'testId', 'description', 'prerequisite', 'steps', 'stepExpected', 'expectedResult', 'status']
        }))
        .on('data', (data) => {
          lineNumber++;
          
          // Skip header lines and empty lines
          if (lineNumber <= 8 || !data.testId || data.testId.trim() === '' || !data.testId.includes('AUTH') && !data.testId.includes('USER') && !data.testId.includes('ADM')) {
            return;
          }
          
          results.push({
            category: data.category?.trim() || 'Authorization',
            testId: data.testId?.trim(),
            description: data.description?.trim(),
            prerequisite: data.prerequisite?.trim(),
            steps: data.steps?.trim(),
            stepExpected: data.stepExpected?.trim(),
            expectedResult: data.expectedResult?.trim(),
            status: data.status?.trim()
          });
        })
        .on('end', () => {
          this.testCases = results;
          console.log(`Parsed ${results.length} test cases from CSV`);
          results.forEach(tc => {
            console.log(`- ${tc.testId}: ${tc.description} (${tc.status})`);
          });
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  getTestCasesByCategory(category) {
    return this.testCases.filter(testCase => 
      testCase.category?.toLowerCase() === category.toLowerCase()
    );
  }

  getAuthenticationTestCases() {
    return this.getTestCasesByCategory('Authorization');
  }

  getUserFunctionTestCases() {
    return this.getTestCasesByCategory('User Functions');
  }

  getAdminFunctionTestCases() {
    return this.getTestCasesByCategory('Admin Functions');
  }
}

// Helper function to convert test case to Jest test
export function convertToJestTest(testCase) {
  const testName = `${testCase.testId} - ${testCase.description}`;
  
  // Determine test type based on description and expected result
  const isLoginTest = testCase.description.toLowerCase().includes('đăng nhập');
  const isLogoutTest = testCase.description.toLowerCase().includes('đăng xuất');
  const isSignupTest = testCase.description.toLowerCase().includes('đăng ký');
  const shouldPass = testCase.description.toLowerCase().includes('thành công');
  const hasMissingFields = testCase.prerequisite?.toLowerCase().includes('thiếu');
  const hasInvalidInfo = testCase.prerequisite?.toLowerCase().includes('không hợp lệ');

  return {
    testName,
    testId: testCase.testId,
    category: testCase.category,
    description: testCase.description,
    shouldPass,
    isLoginTest,
    isLogoutTest,
    isSignupTest,
    hasMissingFields,
    hasInvalidInfo,
    expectedResult: testCase.expectedResult,
    steps: testCase.steps,
    status: testCase.status
  };
}

// Generate test data based on test case requirements
export function generateTestData(testCase) {
  const converted = convertToJestTest(testCase);
  
  if (converted.isLoginTest) {
    if (converted.hasMissingFields) {
      return [
        { email: '', password: 'password123' },
        { email: 'test@example.com', password: '' },
        { email: '', password: '' },
        { password: 'password123' }, // missing email
        { email: 'test@example.com' }  // missing password
      ];
    } else if (converted.hasInvalidInfo) {
      return [
        { email: 'nonexistent@example.com', password: 'password123' },
        { email: 'test@example.com', password: 'wrongpassword' },
        { email: 'invalid-email', password: 'password123' },
        { email: 'test@example.com', password: '123' } // too short
      ];
    } else if (converted.shouldPass) {
      return [
        { email: 'test@example.com', password: 'password123' }
      ];
    }
  }

  if (converted.isSignupTest) {
    if (converted.shouldPass) {
      return [
        { 
          name: 'Test User',
          email: 'newuser@example.com', 
          password: 'password123' 
        }
      ];
    }
  }

  return [];
}
