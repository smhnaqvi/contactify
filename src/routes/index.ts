/**
 * Main routes configuration
 */

import express, { Router, Request, Response } from 'express';
import contactRoutes from './contactRoutes.js';
import { ApiResponse } from '../types/index.js';

const router: Router = express.Router();

// API routes
router.use('/api/contact', contactRoutes);

// Root endpoint
router.get('/', (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    message: 'Contactify API is running',
    data: {
      version: '1.0.0',
      endpoints: {
        contact: '/api/contact',
        health: '/api/contact/health',
        submissions: '/api/contact/submissions'
      },
      documentation: 'https://github.com/smhnaqvi/contactify#readme'
    }
  };
  res.json(response);
});

// API info endpoint
router.get('/api', (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    message: 'Contactify API',
    data: {
      version: '1.0.0',
      description: 'A lightweight backend service for contact forms',
      endpoints: {
        'POST /api/contact': 'Submit contact form',
        'GET /api/contact/health': 'Health check',
        'GET /api/contact/submissions': 'Get all submissions (admin)',
        'GET /api/contact/submissions/:id': 'Get submission by ID (admin)'
      }
    }
  };
  res.json(response);
});

export default router;
