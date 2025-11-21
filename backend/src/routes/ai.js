import express from 'express';
import { summarize, rewrite, query, suggestions } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All AI routes require authentication
router.post('/summarize', authenticate, summarize);
router.post('/rewrite', authenticate, rewrite);
router.post('/query', authenticate, query);
router.post('/suggestions', authenticate, suggestions);

export default router;

