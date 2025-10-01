/**
 * Contact form controller
 */

const emailService = require('../services/emailService');
const db = require('../config/database');
const logger = require('../utils/logger');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Submit contact form
const submitContact = asyncHandler(async (req, res) => {
  const contactData = req.body;
  
  logger.info('New contact form submission', {
    email: contactData.email,
    subject: contactData.subject,
    ip: req.ip
  });

  try {
    // Store submission in database
    const submission = db.createSubmission(contactData);
    
    // Send email
    await emailService.sendContactEmail(contactData);
    
    // Update submission status
    db.updateSubmissionStatus(submission.id, 'sent');
    
    logger.info('Contact form processed successfully', {
      submissionId: submission.id,
      email: contactData.email
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      submissionId: submission.id
    });

  } catch (error) {
    // Update submission status to failed
    if (submission) {
      db.updateSubmissionStatus(submission.id, 'failed');
    }
    
    logger.error('Failed to process contact form', {
      error: error.message,
      email: contactData.email
    });

    throw new AppError('Failed to send email. Please try again later.', 500);
  }
});

// Get all submissions (admin endpoint)
const getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = db.getAllSubmissions();
  
  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

// Get submission by ID (admin endpoint)
const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = db.getSubmissionById(id);
  
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: submission
  });
});

// Health check endpoint
const healthCheck = asyncHandler(async (req, res) => {
  const emailServiceStatus = await emailService.verifyConnection();
  
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    services: {
      email: emailServiceStatus ? 'connected' : 'disconnected'
    }
  });
});

module.exports = {
  submitContact,
  getAllSubmissions,
  getSubmissionById,
  healthCheck
};
