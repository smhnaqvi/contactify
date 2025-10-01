/**
 * Type definitions for Contactify API
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string[];
  submissionId?: string;
  count?: number;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  services: {
    email: 'connected' | 'disconnected';
  };
}

export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  recipient: string;
}

export interface SecurityConfig {
  corsOrigin: string;
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
}

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  email: EmailConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
}

export interface Logger {
  error(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}

export interface Database {
  createSubmission(data: ContactFormData): ContactSubmission;
  getAllSubmissions(): ContactSubmission[];
  getSubmissionById(id: string): ContactSubmission | undefined;
  updateSubmissionStatus(id: string, status: ContactSubmission['status']): ContactSubmission | undefined;
}

export interface EmailService {
  verifyConnection(): Promise<boolean>;
  sendContactEmail(contactData: ContactFormData): Promise<any>;
}

export interface ValidationResult {
  error?: {
    details: Array<{
      message: string;
      path: (string | number)[];
    }>;
  };
  value: ContactFormData;
}

export interface RequestWithBody<T = any> extends Express.Request {
  body: T;
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
