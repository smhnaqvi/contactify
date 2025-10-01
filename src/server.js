/**
 * Server entry point
 */

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const emailService = require('./services/emailService');

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 Contactify server is running on port ${config.port}`);
  logger.info(`📧 Environment: ${config.nodeEnv}`);
  logger.info(`🌐 CORS Origin: ${config.security.corsOrigin}`);
  
  // Verify email connection on startup
  emailService.verifyConnection()
    .then(isConnected => {
      if (isConnected) {
        logger.info('✅ Email service connection verified');
      } else {
        logger.warn('⚠️  Email service connection failed - check your SMTP configuration');
      }
    })
    .catch(error => {
      logger.error('❌ Email service verification error', { error: error.message });
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection', {
    error: err.message,
    stack: err.stack
  });
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

module.exports = server;
