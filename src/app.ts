/**
 * Express application setup
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import config from './config/index.js';
import logger from './utils/logger.js';
import { setupSecurity } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import routes from './routes/index.js';

// Create Express app
const app: Application = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
setupSecurity(app);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression() as any);

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging
app.use((req: Request, res: Response, next: NextFunction): void => {
  logger.info('Request received', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
