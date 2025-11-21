import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logger Middleware
 * Enhanced logging with file output
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Create write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

/**
 * Morgan logger for HTTP requests
 */
export const httpLogger = morgan('combined', {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400, // Only log errors in file
});

/**
 * Console logger (for development)
 */
export const consoleLogger = morgan('dev');

/**
 * Custom logger utility
 */
export const logger = {
  info: (message, data = {}) => {
    const log = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...data,
    };
    console.log(JSON.stringify(log));
  },

  error: (message, error = {}, data = {}) => {
    const log = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...data,
    };
    console.error(JSON.stringify(log));
    errorLogStream.write(JSON.stringify(log) + '\n');
  },

  warn: (message, data = {}) => {
    const log = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      ...data,
    };
    console.warn(JSON.stringify(log));
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = {
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        message,
        ...data,
      };
      console.log(JSON.stringify(log));
    }
  },
};

