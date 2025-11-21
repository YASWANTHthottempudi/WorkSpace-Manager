/**
 * Global Error Handler Middleware
 * Handles all errors in the application and returns consistent error responses
 */

export const errorHandler = (err, req, res, next) => {
  // Set default error status
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    
    // Extract validation messages
    if (err.errors) {
      const messages = Object.values(err.errors).map(error => {
        if (typeof error === 'object' && error.message) {
          return error.message;
        }
        return String(error);
      });
      message = messages.join(', ');
    }
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    
    // Extract duplicate field
    if (err.keyPattern) {
      const field = Object.keys(err.keyPattern)[0];
      message = `${field} already exists`;
    }
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
    });
  } else {
    // Log minimal error info in production
    console.error('Error:', {
      name: err.name,
      message: err.message,
      path: req.path,
      method: req.method,
      statusCode,
    });
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details,
      }),
    },
  });
};

/**
 * Async handler wrapper
 * Catches errors from async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found handler
 * Handles 404 errors for routes that don't exist
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.path,
      method: req.method,
    },
  });
};

