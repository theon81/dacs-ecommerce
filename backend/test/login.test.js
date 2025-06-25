import request from 'supertest';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import { createTestApp, createTestUser, getInvalidCredentials, getEmptyFieldTests } from './helpers/testHelpers.js';

const app = createTestApp();

describe('Login Functionality Tests', () => {
  let testUser;
  let hashedPassword;

  beforeEach(async () => {
    // Create a test user before each test
    testUser = createTestUser();
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    await userModel.create({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword
    });
  });

  describe('Successful Login', () => {
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
  });

  describe('Invalid Credentials Tests', () => {
    const invalidCredentials = getInvalidCredentials();

    test.each(invalidCredentials)(
      'should fail login with $description',
      async ({ email, password }) => {
        const response = await request(app)
          .post('/api/user/login')
          .send({ email, password });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.token).toBeUndefined();
        
        if (email === 'nonexistent@example.com' || email === 'wrong@example.com') {
          expect(response.body.message).toBe("User doesn't exist");
        } else {
          expect(response.body.message).toBe('Invalid credentials');
        }
      }
    );
  });

  describe('Empty Fields Tests', () => {
    const emptyFieldTests = getEmptyFieldTests();

    test.each(emptyFieldTests)(
      'should fail login with $description',
      async (credentials) => {
        const response = await request(app)
          .post('/api/user/login')
          .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email and password are required');
        expect(response.body.token).toBeUndefined();
      }
    );
  });

  describe('Account Locking Mechanism', () => {
    test('should lock account after maximum failed login attempts', async () => {
      const maxAttempts = 5;
      
      // Make maximum failed login attempts
      for (let i = 0; i < maxAttempts; i++) {
        await request(app)
          .post('/api/user/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          });
      }

      // Next attempt should be locked
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Account is locked. Try again in 10 minutes.');
    });

    test('should reset login attempts after successful login', async () => {
      // Make some failed attempts
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/user/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          });
      }

      // Successful login should reset attempts
      const successResponse = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(successResponse.body.success).toBe(true);

      // Verify user's login attempts are reset
      const user = await userModel.findOne({ email: testUser.email });
      expect(user.loginAttempts).toBe(0);
      expect(user.lockUntil).toBeNull();
    });
  });

  describe('Input Validation Tests', () => {
    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password":}'); // Invalid JSON

      expect(response.status).toBe(400);
    });

    test('should handle very long email', async () => {
      const longEmail = 'a'.repeat(1000) + '@example.com';
      
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: longEmail,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    });

    test('should handle very long password', async () => {
      const longPassword = 'a'.repeat(1000);
      
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: longPassword
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Security Tests', () => {
    test('should not expose user password in any response', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      const responseString = JSON.stringify(response.body);
      expect(responseString).not.toContain(testUser.password);
      expect(responseString).not.toContain(hashedPassword);
    });

    test('should return consistent response time for existing vs non-existing users', async () => {
      const startTime1 = Date.now();
      await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      const endTime1 = Date.now();

      const startTime2 = Date.now();
      await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });
      const endTime2 = Date.now();

      const diff1 = endTime1 - startTime1;
      const diff2 = endTime2 - startTime2;
      
      // Response times should be within reasonable range (not exact due to system variations)
      expect(Math.abs(diff1 - diff2)).toBeLessThan(1000); // Within 1 second difference
    });
  });
});
