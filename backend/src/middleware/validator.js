/**
 * Request Validation Middleware
 * Validates request body, params, and query
 */

/**
 * Validate request body
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: {
          message: messages || 'Validation error',
        },
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validate request params
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: {
          message: messages || 'Invalid parameters',
        },
      });
    }

    req.params = value;
    next();
  };
};

/**
 * Validate request query
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: {
          message: messages || 'Invalid query parameters',
        },
      });
    }

    req.query = value;
    next();
  };
};

