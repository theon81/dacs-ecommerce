import express from 'express';
import cors from 'cors';
import userRouter from '../../routes/userRoute.js';

// Create test app without connecting to real database
export const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(cors());
  
  // Routes
  app.use('/api/user', userRouter);
  
  return app;
};

// Helper function to create test user data
export const createTestUser = (overrides = {}) => {
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    ...overrides
  };
};

// Helper function for invalid credentials
export const getInvalidCredentials = () => {
  return [
    {
      description: 'invalid email',
      email: 'nonexistent@example.com',
      password: 'password123'
    },
    {
      description: 'invalid password',
      email: 'test@example.com',
      password: 'wrongpassword'
    },
    {
      description: 'both invalid',
      email: 'wrong@example.com',
      password: 'wrongpassword'
    }
  ];
};

// Helper function for empty field tests
export const getEmptyFieldTests = () => {
  return [
    {
      description: 'empty email',
      email: '',
      password: 'password123'
    },
    {
      description: 'empty password',
      email: 'test@example.com',
      password: ''
    },
    {
      description: 'both fields empty',
      email: '',
      password: ''
    },
    {
      description: 'missing email field',
      password: 'password123'
    },
    {
      description: 'missing password field',
      email: 'test@example.com'
    },
    {
      description: 'missing both fields',
    }
  ];
};
