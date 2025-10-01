/**
 * Application configuration
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';
import { AppConfig } from '../types/index.js';

dotenv.config();

const config: AppConfig = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
  
  // Email configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
      }
    },
    recipient: process.env.RECIPIENT_EMAIL!
  },

  // Security configuration
  security: {
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') // limit each IP to 100 requests per windowMs
    }
  },

  // Logging configuration
  logging: {
    level: (process.env.LOG_LEVEL as AppConfig['logging']['level']) || 'info'
  }
};

// Validate required environment variables
const requiredEnvVars: (keyof NodeJS.ProcessEnv)[] = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'RECIPIENT_EMAIL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

export default config;
