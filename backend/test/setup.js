import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'dotenv/config';

let mongod;

// Setup before all tests
beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Error setting up test database:', error);
  }
});

// Cleanup after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error tearing down test database:', error);
  }
});

// Set test environment variables
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.ADMIN_EMAIL = 'admin@test.com';
process.env.ADMIN_PASSWORD = 'admin123';
