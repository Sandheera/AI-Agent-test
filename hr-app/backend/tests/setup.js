const mongoose = require('mongoose');
require('dotenv').config();

// Setup for test database
beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set, tests will use default connection');
  }
});

// Cleanup after tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
