/**
 * Simple logging utility
 */

import config from '../config/index.js';
import { Logger } from '../types/index.js';

class LoggerImpl implements Logger {
  private level: string;
  private levels: Record<string, number>;

  constructor() {
    this.level = config.logging.level;
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  private shouldLog(level: string): boolean {
    const levelValue = this.levels[level];
    const currentLevelValue = this.levels[this.level];
    return levelValue !== undefined && currentLevelValue !== undefined && levelValue <= currentLevelValue;
  }

  private formatMessage(level: string, message: string, meta: Record<string, any> = {}): string {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  error(message: string, meta: Record<string, any> = {}): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message: string, meta: Record<string, any> = {}): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message: string, meta: Record<string, any> = {}): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  debug(message: string, meta: Record<string, any> = {}): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, meta));
    }
  }
}

export default new LoggerImpl();
