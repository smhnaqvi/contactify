/**
 * Security middleware configuration
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
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
const rateLimitOptions = {
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
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
const setupSecurity = (app) => {
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

module.exports = {
  setupSecurity,
  corsOptions,
  rateLimitOptions
};
