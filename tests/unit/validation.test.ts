/**
 * Validation tests
 */

import { contactSchema, validate } from '../../dist/utils/validation.js';
import { ContactFormData } from '../../dist/types/index.js';

describe('Contact Form Validation', () => {
  describe('contactSchema', () => {
    test('should validate correct contact data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.'
      };

      const { error } = contactSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.'
      };

      const { error } = contactSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error!.details[0]?.message).toContain('valid email address');
    });

    test('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.'
      };

      const { error } = contactSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error!.details[0]?.message).toContain('at least 2 characters');
    });

    test('should reject short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Short'
      };

      const { error } = contactSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error!.details[0]?.message).toContain('at least 10 characters');
    });

    test('should accept optional fields', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.',
        phone: '+1234567890',
        company: 'Test Company'
      };

      const { error } = contactSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject invalid phone number', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for the contact form.',
        phone: 'invalid-phone'
      };

      const { error } = contactSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error!.details[0]?.message).toContain('valid phone number');
    });
  });
});
