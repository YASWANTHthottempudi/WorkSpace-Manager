import { verifyToken, extractToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Authentication required. Please provide a valid token.',
        },
      });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'User not found. Token is invalid.',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: error.message || 'Invalid or expired token',
      },
    });
  }
};