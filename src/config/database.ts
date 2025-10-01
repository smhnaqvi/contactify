/**
 * Database configuration
 * Currently using in-memory storage for simplicity
 * Can be extended to use MongoDB, PostgreSQL, etc.
 */

import { ContactFormData, ContactSubmission, Database } from '../types/index.js';

// In-memory storage for demo purposes
const submissions: ContactSubmission[] = [];

const db: Database = {
  // Store a new submission
  createSubmission: (data: ContactFormData): ContactSubmission => {
    const submission: ContactSubmission = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    submissions.push(submission);
    return submission;
  },

  // Get all submissions (for admin purposes)
  getAllSubmissions: (): ContactSubmission[] => {
    return submissions;
  },

  // Get submission by ID
  getSubmissionById: (id: string): ContactSubmission | undefined => {
    return submissions.find(submission => submission.id === id);
  },

  // Update submission status
  updateSubmissionStatus: (id: string, status: ContactSubmission['status']): ContactSubmission | undefined => {
    const submission = submissions.find(sub => sub.id === id);
    if (submission) {
      submission.status = status;
      submission.updatedAt = new Date().toISOString();
    }
    return submission;
  }
};

export default db;
