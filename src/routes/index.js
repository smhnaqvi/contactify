/**
 * Main routes configuration
 */

const express = require('express');
const router = express.Router();
const contactRoutes = require('./contactRoutes');

// API routes
router.use('/api/contact', contactRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Contactify API is running',
    version: '1.0.0',
    endpoints: {
      contact: '/api/contact',
      health: '/api/contact/health',
      submissions: '/api/contact/submissions'
    },
    documentation: 'https://github.com/smhnaqvi/contactify#readme'
  });
});

// API info endpoint
router.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Contactify API',
    version: '1.0.0',
    description: 'A lightweight backend service for contact forms',
    endpoints: {
      'POST /api/contact': 'Submit contact form',
      'GET /api/contact/health': 'Health check',
      'GET /api/contact/submissions': 'Get all submissions (admin)',
      'GET /api/contact/submissions/:id': 'Get submission by ID (admin)'
    }
  });
});

module.exports = router;
