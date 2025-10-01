/**
 * Test setup and configuration
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

// Mock environment variables for testing
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test@test.com';
process.env.SMTP_PASS = 'testpass';
process.env.RECIPIENT_EMAIL = 'recipient@test.com';

// Increase timeout for async operations
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  validContactData: {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message for the contact form.'
  },
  
  invalidContactData: {
    name: 'J', // Too short
    email: 'invalid-email',
    subject: 'Hi', // Too short
    message: 'Short' // Too short
  }
};
