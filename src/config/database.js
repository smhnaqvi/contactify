/**
 * Database configuration
 * Currently using in-memory storage for simplicity
 * Can be extended to use MongoDB, PostgreSQL, etc.
 */

// In-memory storage for demo purposes
const submissions = [];

const db = {
  // Store a new submission
  createSubmission: (data) => {
    const submission = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    submissions.push(submission);
    return submission;
  },

  // Get all submissions (for admin purposes)
  getAllSubmissions: () => {
    return submissions;
  },

  // Get submission by ID
  getSubmissionById: (id) => {
    return submissions.find(submission => submission.id === id);
  },

  // Update submission status
  updateSubmissionStatus: (id, status) => {
    const submission = submissions.find(sub => sub.id === id);
    if (submission) {
      submission.status = status;
      submission.updatedAt = new Date().toISOString();
    }
    return submission;
  }
};

module.exports = db;
