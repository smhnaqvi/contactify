/**
 * Security middleware configuration
 */

import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';
import { Application, Request, Response } from 'express';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// CORS configuration
export const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.security.corsOrigin === '*') {
      return callback(null, true);
    }
    
    const allowedOrigins = config.security.corsOrigin.split(',');
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    logger.warn('CORS blocked request from origin', { origin });
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Rate limiting configuration
export const rateLimitOptions = {
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response): void => {
    logger.warn('Rate limit exceeded', { 
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    });
  }
};

// Helmet security configuration
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
};

// Security middleware setup
export const setupSecurity = (app: Application): void => {
  // Trust proxy for accurate IP addresses
  app.set('trust proxy', 1);
  
  // Helmet for security headers
  app.use(helmet(helmetOptions));
  
  // CORS
  app.use(cors(corsOptions));
  
  // Rate limiting
  app.use(rateLimit(rateLimitOptions));
  
  logger.info('Security middleware configured', {
    corsOrigin: config.security.corsOrigin,
    rateLimit: config.security.rateLimit
  });
};
