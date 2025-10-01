/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { ErrorWithStatusCode } from '../types/index.js';

// Custom error class
export class AppError extends Error implements ErrorWithStatusCode {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export const errorHandler = (err: ErrorWithStatusCode, req: Request, res: Response, _next: NextFunction): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if ((err as any).name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if ((err as any).name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if ((err as any).name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if ((err as any).name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Nodemailer errors
  if ((err as any).code === 'ECONNECTION' || (err as any).code === 'EAUTH') {
    const message = 'Email service temporarily unavailable';
    error = new AppError(message, 503);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async error wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
