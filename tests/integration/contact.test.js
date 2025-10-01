/**
 * Integration tests for contact endpoints
 */

const request = require('supertest');
const app = require('../../src/app');

describe('Contact API Integration Tests', () => {
  describe('POST /api/contact', () => {
    test('should submit valid contact form', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Email sent successfully');
      expect(response.body.submissionId).toBeDefined();
    });

    test('should reject invalid contact data', async () => {
      const invalidData = {
        name: 'J',
        email: 'invalid-email',
        subject: 'Hi',
        message: 'Short'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });

    test('should reject missing required fields', async () => {
      const incompleteData = {
        name: 'John Doe'
        // Missing email, subject, message
      };

      const response = await request(app)
        .post('/api/contact')
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /api/contact/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/contact/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Service is healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.services).toBeDefined();
    });
  });

  describe('GET /api/contact/submissions', () => {
    test('should return all submissions', async () => {
      const response = await request(app)
        .get('/api/contact/submissions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /', () => {
    test('should return API info', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Contactify API is running');
      expect(response.body.version).toBeDefined();
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /api', () => {
    test('should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Contactify API');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('404 handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Not found');
    });
  });
});
