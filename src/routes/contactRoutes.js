/**
 * Contact form routes
 */

const express = require('express');
const router = express.Router();
const { submitContact, getAllSubmissions, getSubmissionById, healthCheck } = require('../controllers/contactController');
const { validate, contactSchema } = require('../utils/validation');

// Health check endpoint
router.get('/health', healthCheck);

// Submit contact form
router.post('/', validate(contactSchema), submitContact);

// Admin endpoints (in a real app, these would be protected with authentication)
router.get('/submissions', getAllSubmissions);
router.get('/submissions/:id', getSubmissionById);

module.exports = router;
