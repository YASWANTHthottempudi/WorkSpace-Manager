import Joi from 'joi';

/**
 * Page Validation Schemas
 */

export const createPageSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required',
    }),
  content: Joi.string()
    .allow('')
    .optional(),
  workspaceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid workspace ID format',
      'any.required': 'Workspace ID is required',
    }),
  parentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid parent page ID format',
    }),
});

export const updatePageSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title cannot exceed 200 characters',
    }),
  content: Joi.string()
    .allow('')
    .optional(),
  parentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid parent page ID format',
    }),
  order: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Order must be a number',
      'number.integer': 'Order must be an integer',
      'number.min': 'Order must be 0 or greater',
    }),
});

export const pageIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid page ID format',
      'any.required': 'Page ID is required',
    }),
});

export const workspaceIdSchema = Joi.object({
  workspaceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid workspace ID format',
      'any.required': 'Workspace ID is required',
    }),
});

export const reorderPageSchema = Joi.object({
  newParentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid parent page ID format',
    }),
  newIndex: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'New index must be a number',
      'number.integer': 'New index must be an integer',
      'number.min': 'New index must be 0 or greater',
    }),
});

