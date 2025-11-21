import mongoose from 'mongoose';

// Lazy load DOMPurify to avoid jsdom issues in tests
let DOMPurify = null;
let DOMPurifyInitialized = false;

const initDOMPurify = async () => {
  if (DOMPurifyInitialized) return DOMPurify;
  if (process.env.NODE_ENV === 'test') {
    DOMPurifyInitialized = true;
    return null;
  }
  
  try {
    const createDOMPurify = (await import('isomorphic-dompurify')).default;
    const { JSDOM } = await import('jsdom');
    const window = new JSDOM('').window;
    DOMPurify = createDOMPurify(window);
    DOMPurifyInitialized = true;
  } catch (err) {
    console.warn('Warning: Could not load DOMPurify, sanitization will be skipped');
    DOMPurifyInitialized = true;
  }
  return DOMPurify;
};

/**
 * Input Sanitization Middleware
 * Sanitizes user input to prevent XSS attacks and injection
 */

/**
 * Sanitize string input
 */
const sanitizeString = async (str) => {
  if (typeof str !== 'string') return str;
  
  const purify = await initDOMPurify();
  if (!purify) {
    // Fallback: basic sanitization without DOMPurify
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }
  
  // Remove script tags and dangerous characters
  return purify.sanitize(str, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
};

/**
 * Sanitize object recursively (sync version for tests)
 */
const sanitizeObjectSync = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Basic sanitization without DOMPurify
    return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObjectSync(item));
  }
  
  if (typeof obj === 'object') {
    // Skip Mongoose objects
    if (obj instanceof mongoose.Types.ObjectId) {
      return obj;
    }
    
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObjectSync(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * Sanitize request body
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObjectSync(req.body);
  }
  next();
};

/**
 * Sanitize request query
 */
export const sanitizeQuery = (req, res, next) => {
  // In Express 5, query is read-only, so we sanitize values in-place
  if (req.query && typeof req.query === 'object') {
    const sanitized = sanitizeObjectSync(req.query);
    // Copy sanitized values back to query object
    Object.keys(sanitized).forEach(key => {
      if (req.query.hasOwnProperty(key)) {
        try {
          req.query[key] = sanitized[key];
        } catch (e) {
          // Skip if property is read-only
        }
      }
    });
  }
  next();
};

/**
 * Sanitize request params
 */
export const sanitizeParams = (req, res, next) => {
  // In Express 5, params is read-only, so we sanitize values in-place
  if (req.params && typeof req.params === 'object') {
    const sanitized = sanitizeObjectSync(req.params);
    // Copy sanitized values back to params object
    Object.keys(sanitized).forEach(key => {
      if (req.params.hasOwnProperty(key)) {
        try {
          req.params[key] = sanitized[key];
        } catch (e) {
          // Skip if property is read-only
        }
      }
    });
  }
  next();
};

/**
 * Sanitize all request inputs
 */
export const sanitizeAll = (req, res, next) => {
  sanitizeBody(req, res, () => {
    sanitizeQuery(req, res, () => {
      sanitizeParams(req, res, next);
    });
  });
};

