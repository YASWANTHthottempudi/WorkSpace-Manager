import express from 'express';
import {
  getPagesByWorkspace,
  getPagesTree,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  reorderPage,
} from '../controllers/pageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.get('/workspace/:workspaceId', authenticate, getPagesByWorkspace);
router.get('/workspace/:workspaceId/tree', authenticate, getPagesTree);
router.get('/:id', authenticate, getPageById);
router.post('/', authenticate, createPage);
router.put('/:id', authenticate, updatePage);
router.delete('/:id', authenticate, deletePage);
router.put('/:id/reorder', authenticate, reorderPage);

export default router;

