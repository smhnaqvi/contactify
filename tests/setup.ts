/**
 * Test setup and configuration
 */

import { ContactFormData } from '../dist/types/index.js';

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

// Mock email service
jest.mock('../dist/services/emailService.js', () => ({
  __esModule: true,
  default: {
    verifyConnection: jest.fn().mockResolvedValue(true),
    sendContactEmail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  }
}));

// Global test utilities
declare global {
  var testUtils: {
    validContactData: ContactFormData;
    invalidContactData: Partial<ContactFormData>;
  };
}

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
