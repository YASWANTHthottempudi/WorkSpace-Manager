import {
  summarizeContent,
  rewriteContent,
  answerQuestion,
  generateSuggestions,
} from '../services/aiService.js';

/**
 * Summarize content
 * POST /api/ai/summarize
 */
export const summarize = async (req, res) => {
  try {
    const { content } = req.body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Content is required and must be a non-empty string',
        },
      });
    }

    // Check content length (limit to prevent abuse)
    const maxLength = 10000; // 10k characters
    if (content.length > maxLength) {
      return res.status(400).json({
        error: {
          message: `Content is too long. Maximum length is ${maxLength} characters`,
        },
      });
    }

    const summary = await summarizeContent(content);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Failed to summarize content',
      },
    });
  }
};

/**
 * Rewrite content
 * POST /api/ai/rewrite
 */
export const rewrite = async (req, res) => {
  try {
    const { content, instruction } = req.body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Content is required and must be a non-empty string',
        },
      });
    }

    if (!instruction || typeof instruction !== 'string' || instruction.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Instruction is required and must be a non-empty string',
        },
      });
    }

    // Check content length
    const maxLength = 10000;
    if (content.length > maxLength) {
      return res.status(400).json({
        error: {
          message: `Content is too long. Maximum length is ${maxLength} characters`,
        },
      });
    }

    const rewritten = await rewriteContent(content, instruction);

    res.status(200).json({
      success: true,
      rewritten,
    });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Failed to rewrite content',
      },
    });
  }
};

/**
 * Answer a question about content
 * POST /api/ai/query
 */
export const query = async (req, res) => {
  try {
    const { content, question } = req.body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Content is required and must be a non-empty string',
        },
      });
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Question is required and must be a non-empty string',
        },
      });
    }

    // Check content length
    const maxLength = 10000;
    if (content.length > maxLength) {
      return res.status(400).json({
        error: {
          message: `Content is too long. Maximum length is ${maxLength} characters`,
        },
      });
    }

    const answer = await answerQuestion(content, question);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Failed to answer question',
      },
    });
  }
};

/**
 * Generate suggestions for content improvement
 * POST /api/ai/suggestions
 */
export const suggestions = async (req, res) => {
  try {
    const { content } = req.body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Content is required and must be a non-empty string',
        },
      });
    }

    // Check content length
    const maxLength = 10000;
    if (content.length > maxLength) {
      return res.status(400).json({
        error: {
          message: `Content is too long. Maximum length is ${maxLength} characters`,
        },
      });
    }

    const suggestions = await generateSuggestions(content);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Failed to generate suggestions',
      },
    });
  }
};

export default {
  summarize,
  rewrite,
  query,
  suggestions,
};

