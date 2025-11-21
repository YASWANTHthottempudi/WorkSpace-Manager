import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let geminiClient = null;

/**
 * Initialize Gemini AI client
 */
export const initializeGemini = () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Warning: GEMINI_API_KEY not found in environment variables');
      console.warn('AI features will be disabled');
      return null;
    }

    geminiClient = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI client initialized');
    
    return geminiClient;
  } catch (error) {
    console.error('Error initializing Gemini AI:', error.message);
    return null;
  }
};

/**
 * Get Gemini AI client instance
 */
export const getGeminiClient = () => {
  if (!geminiClient) {
    geminiClient = initializeGemini();
  }
  return geminiClient;
};

/**
 * Get Gemini model instance
 * @param {string} modelName - Model name (default: 'gemini-2.5-flash')
 */
export const getGeminiModel = (modelName = 'gemini-2.5-flash') => {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }
  return client.getGenerativeModel({ model: modelName });
};

export default {
  initializeGemini,
  getGeminiClient,
  getGeminiModel,
};

