/**
 * Input validation schemas using Joi
 */

const Joi = require('joi');

// Contact form validation schema
const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .max(255)
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required'
    }),

  subject: Joi.string()
    .min(5)
    .max(200)
    .trim()
    .required()
    .messages({
      'string.min': 'Subject must be at least 5 characters long',
      'string.max': 'Subject must not exceed 200 characters',
      'any.required': 'Subject is required'
    }),

  message: Joi.string()
    .min(10)
    .max(2000)
    .trim()
    .required()
    .messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message must not exceed 2000 characters',
      'any.required': 'Message is required'
    }),

  // Optional fields
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),

  company: Joi.string()
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.max': 'Company name must not exceed 100 characters'
    })
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  contactSchema,
  validate
};
