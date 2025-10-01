/**
 * Contact form controller
 */

import { type Request, type Response } from 'express'
import emailService from '../services/emailService.js'
import db from '../config/database.js'
import logger from '../utils/logger.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'
import { type ContactFormData, type ApiResponse, type HealthCheckResponse } from '../types/index.js'

// Submit contact form
export const submitContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const contactData: ContactFormData = req.body

  logger.info('New contact form submission', {
    email: contactData.email,
    subject: contactData.subject,
    ip: req.ip
  })

  let submission: any = null

  try {
    // Store submission in database
    submission = db.createSubmission(contactData)

    // Send email
    await emailService.sendContactEmail(contactData)

    // Update submission status
    db.updateSubmissionStatus(submission.id, 'sent')

    logger.info('Contact form processed successfully', {
      submissionId: submission.id,
      email: contactData.email
    })

    const response: ApiResponse = {
      success: true,
      message: 'Email sent successfully',
      submissionId: submission.id
    }

    res.status(200).json(response)
  } catch (error) {
    // Update submission status to failed
    if (submission) {
      db.updateSubmissionStatus(submission.id, 'failed')
    }

    logger.error('Failed to process contact form', {
      error: (error as Error).message,
      email: contactData.email
    })

    throw new AppError('Failed to send email. Please try again later.', 500)
  }
})

// Get all submissions (admin endpoint)
export const getAllSubmissions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const submissions = db.getAllSubmissions()

  const response: ApiResponse = {
    success: true,
    count: submissions.length,
    data: submissions
  }

  res.status(200).json(response)
})

// Get submission by ID (admin endpoint)
export const getSubmissionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id) {
    throw new AppError('Submission ID is required', 400)
  }

  const submission = db.getSubmissionById(id)

  if (!submission) {
    throw new AppError('Submission not found', 404)
  }

  const response: ApiResponse = {
    success: true,
    data: submission
  }

  res.status(200).json(response)
})

// Health check endpoint
export const healthCheck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const emailServiceStatus = await emailService.verifyConnection()

  const response: HealthCheckResponse = {
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    services: {
      email: emailServiceStatus ? 'connected' : 'disconnected'
    }
  }

  res.status(200).json(response)
})
