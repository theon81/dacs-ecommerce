import request from 'supertest';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import { createTestApp, createTestUser } from './helpers/testHelpers.js';
import { TestCaseReader, convertToJestTest, generateTestData } from './helpers/csvTestReader.js';
import path from 'path';

const app = createTestApp();

describe('CSV-Based Authentication Test Cases', () => {
  let testCaseReader;
  let authTestCases = [];
  let testUser;

  beforeAll(async () => {
    // Load test cases from CSV
    const csvPath = path.join(__dirname, 'test-cases-document', 'Function Test Cases.csv');
    testCaseReader = new TestCaseReader(csvPath);
    
    try {
      await testCaseReader.readTestCases();
      authTestCases = testCaseReader.getAuthenticationTestCases();
      console.log(`Loaded ${authTestCases.length} authentication test cases from CSV`);
    } catch (error) {
      console.error('Error loading CSV test cases:', error);
      authTestCases = []; // Fallback to empty array
    }
  });

  beforeEach(async () => {
    // Create a test user before each test
    testUser = createTestUser();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    await userModel.create({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword
    });
  });

  describe('AUTH 001 - Invalid Login (Missing Fields)', () => {
    test('should fail login when missing required fields', async () => {
      const testData = [
        { email: '', password: 'password123', description: 'empty email' },
        { email: 'test@example.com', password: '', description: 'empty password' },
        { email: '', password: '', description: 'both fields empty' },
        { password: 'password123', description: 'missing email field' },
        { email: 'test@example.com', description: 'missing password field' }
      ];

      for (const data of testData) {
        const response = await request(app)
          .post('/api/user/login')
          .send(data);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email and password are required');
        expect(response.body.token).toBeUndefined();
      }
    });
  });

  describe('AUTH 002 - Invalid Login (Wrong Information)', () => {
    test('should fail login with invalid credentials', async () => {
      const testData = [
        { 
          email: 'nonexistent@example.com', 
          password: 'password123',
          expectedMessage: "User doesn't exist",
          description: 'non-existent email'
        },
        { 
          email: testUser.email, 
          password: 'wrongpassword',
          expectedMessage: 'Invalid credentials',
          description: 'wrong password'
        },
        { 
          email: 'invalid-email-format', 
          password: 'password123',
          expectedMessage: "User doesn't exist",
          description: 'invalid email format'
        }
      ];

      for (const data of testData) {
        const response = await request(app)
          .post('/api/user/login')
          .send({
            email: data.email,
            password: data.password
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(data.expectedMessage);
        expect(response.body.token).toBeUndefined();
      }
    });
  });

  describe('AUTH 003 - Successful Login', () => {
    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });

    test('should redirect user to dashboard after successful login', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      // In a full integration test, you would verify redirection
      // For API testing, we verify token generation
    });
  });

  describe('AUTH 004 - Successful Registration', () => {
    test('should register new user successfully', async () => {
      const newUser = {
        name: 'New Test User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/user/register')
        .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();

      // Verify user was created in database
      const createdUser = await userModel.findOne({ email: newUser.email });
      expect(createdUser).toBeTruthy();
      expect(createdUser.name).toBe(newUser.name);
      expect(createdUser.email).toBe(newUser.email);
    });

    test('should not register user with existing email', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: testUser.email, // Use existing email
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/user/register')
        .send(duplicateUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });
  });

  // Dynamic test generation from CSV
  if (authTestCases.length > 0) {
    describe('CSV-Generated Dynamic Tests', () => {
      authTestCases.forEach((testCase) => {
        const converted = convertToJestTest(testCase);
        
        test(converted.testName, async () => {
          console.log(`Running CSV test: ${converted.testId}`);
          console.log(`Description: ${converted.description}`);
          console.log(`Expected: ${converted.expectedResult}`);
          
          if (converted.isLoginTest) {
            const testDataArray = generateTestData(testCase);
            
            for (const testData of testDataArray) {
              const response = await request(app)
                .post('/api/user/login')
                .send(testData);

              if (converted.shouldPass) {
                expect(response.body.success).toBe(true);
                expect(response.body.token).toBeDefined();
              } else {
                expect(response.body.success).toBe(false);
                expect(response.body.token).toBeUndefined();
              }
            }
          } else if (converted.isSignupTest) {
            const testDataArray = generateTestData(testCase);
            
            for (const testData of testDataArray) {
              const response = await request(app)
                .post('/api/user/register')
                .send(testData);

              if (converted.shouldPass) {
                expect(response.body.success).toBe(true);
                expect(response.body.token).toBeDefined();
              } else {
                expect(response.body.success).toBe(false);
                expect(response.body.token).toBeUndefined();
              }
            }
          }
          
          // Mark test as completed in tracking
          console.log(`Test ${converted.testId} completed`);
        });
      });
    });
  }

  describe('Test Case Coverage Report', () => {
    test('should report CSV test case coverage', async () => {
      const totalCases = authTestCases.length;
      const passedCases = authTestCases.filter(tc => tc.status === 'Passed').length;
      const failedCases = authTestCases.filter(tc => tc.status === 'Failed').length;
      const notRunCases = authTestCases.filter(tc => tc.status === 'Not Run').length;
      const notCompletedCases = authTestCases.filter(tc => tc.status === 'Not Completed').length;

      console.log('\nTest Case Coverage Report:');
      console.log(`Total Authentication Cases: ${totalCases}`);
      console.log(`Passed: ${passedCases}`);
      console.log(`Failed: ${failedCases}`);
      console.log(`Not Run: ${notRunCases}`);
      console.log(`Not Completed: ${notCompletedCases}`);

      expect(totalCases).toBeGreaterThan(0);
      expect(passedCases + failedCases + notRunCases + notCompletedCases).toBe(totalCases);
    });
  });
});
