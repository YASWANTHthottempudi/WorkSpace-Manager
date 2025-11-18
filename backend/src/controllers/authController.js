import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          message: 'Please provide name, email, and password',
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: {
          message: 'User with this email already exists',
        },
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        error: {
          message: 'Password must be at least 8 characters long',
        },
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save hook
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({ id: user._id });

    // Return user and token (passwordHash is excluded by toJSON method)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: {
          message: messages.join(', '),
        },
      });
    }

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        error: {
          message: 'User with this email already exists',
        },
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Please provide email and password',
        },
      });
    }

    // Find user by email and include passwordHash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
        },
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
        },
      });
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    // Return user and token (passwordHash is excluded by toJSON method)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 * Requires authentication middleware
 */
export const getCurrentUser = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};