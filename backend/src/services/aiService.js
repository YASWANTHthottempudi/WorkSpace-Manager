import { getGeminiModel } from '../config/gemini.js';

/**
 * AI Service for Gemini API
 * Handles summarization, rewriting, and Q&A
 */

/**
 * Summarize content using Gemini AI
 * @param {string} content - Content to summarize
 * @returns {Promise<string>} - Summary
 */
export const summarizeContent = async (content) => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required for summarization');
    }

    const model = getGeminiModel();
    if (!model) {
      throw new Error('Gemini AI client not initialized');
    }

    const prompt = `Please provide a concise summary of the following content. Focus on the main points and key information:

${content}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary.trim();
  } catch (error) {
    console.error('Error in summarizeContent:', error);
    throw new Error(`Failed to summarize content: ${error.message}`);
  }
};

/**
 * Rewrite content using Gemini AI
 * @param {string} content - Content to rewrite
 * @param {string} instruction - Instruction for rewriting (e.g., "make it more formal", "simplify")
 * @returns {Promise<string>} - Rewritten content
 */
export const rewriteContent = async (content, instruction) => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required for rewriting');
    }

    if (!instruction || instruction.trim().length === 0) {
      throw new Error('Instruction is required for rewriting');
    }

    const model = getGeminiModel();
    if (!model) {
      throw new Error('Gemini AI client not initialized');
    }

    const prompt = `Please rewrite the following content according to this instruction: "${instruction}"

Original content:
${content}

Rewritten content:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rewritten = response.text();

    return rewritten.trim();
  } catch (error) {
    console.error('Error in rewriteContent:', error);
    throw new Error(`Failed to rewrite content: ${error.message}`);
  }
};

/**
 * Answer a question about content using Gemini AI
 * @param {string} content - Content to ask about
 * @param {string} question - Question to ask
 * @returns {Promise<string>} - Answer
 */
export const answerQuestion = async (content, question) => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required for Q&A');
    }

    if (!question || question.trim().length === 0) {
      throw new Error('Question is required');
    }

    const model = getGeminiModel();
    if (!model) {
      throw new Error('Gemini AI client not initialized');
    }

    const prompt = `Based on the following content, please answer this question:

Content:
${content}

Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return answer.trim();
  } catch (error) {
    console.error('Error in answerQuestion:', error);
    throw new Error(`Failed to answer question: ${error.message}`);
  }
};

/**
 * Generate suggestions for content improvement
 * @param {string} content - Content to analyze
 * @returns {Promise<string>} - Suggestions
 */
export const generateSuggestions = async (content) => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required for suggestions');
    }

    const model = getGeminiModel();
    if (!model) {
      throw new Error('Gemini AI client not initialized');
    }

    const prompt = `Please analyze the following content and provide suggestions for improvement. Focus on clarity, structure, grammar, and overall quality:

${content}

Suggestions:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    return suggestions.trim();
  } catch (error) {
    console.error('Error in generateSuggestions:', error);
    throw new Error(`Failed to generate suggestions: ${error.message}`);
  }
};

export default {
  summarizeContent,
  rewriteContent,
  answerQuestion,
  generateSuggestions,
};

