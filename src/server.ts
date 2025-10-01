/**
 * Server entry point
 */

import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import emailService from './services/emailService.js';

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 Contactify server is running on port ${config.port}`);
  logger.info(`📧 Environment: ${config.nodeEnv}`);
  logger.info(`🌐 CORS Origin: ${config.security.corsOrigin}`);
  
  // Verify email connection on startup
  emailService.verifyConnection()
    .then((isConnected: boolean) => {
      if (isConnected) {
        logger.info('✅ Email service connection verified');
      } else {
        logger.warn('⚠️  Email service connection failed - check your SMTP configuration');
      }
    })
    .catch((error: Error) => {
      logger.error('❌ Email service verification error', { error: error.message });
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise: Promise<any>) => {
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
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

export default server;
