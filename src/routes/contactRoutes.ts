/**
 * Contact form routes
 */

import express, { type Router } from 'express'
import { submitContact, getAllSubmissions, getSubmissionById, healthCheck } from '../controllers/contactController.js'
import { validate, contactSchema } from '../utils/validation.js'

const router: Router = express.Router()

// Health check endpoint
router.get('/health', healthCheck)

// Submit contact form
router.post('/', validate(contactSchema), submitContact)

// Admin endpoints (in a real app, these would be protected with authentication)
router.get('/submissions', getAllSubmissions)
router.get('/submissions/:id', getSubmissionById)

export default router
