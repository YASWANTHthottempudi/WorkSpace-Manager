import Joi from 'joi';

/**
 * Workspace Validation Schemas
 */

export const createWorkspaceSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
});

export const updateWorkspaceSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title cannot exceed 100 characters',
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
});

export const workspaceIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid workspace ID format',
      'any.required': 'Workspace ID is required',
    }),
});

export const addMemberSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
});

export const memberIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid workspace ID format',
      'any.required': 'Workspace ID is required',
    }),
  memberId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid member ID format',
      'any.required': 'Member ID is required',
    }),
});

