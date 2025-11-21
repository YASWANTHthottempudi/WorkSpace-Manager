import express from 'express';
import {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
} from '../controllers/workspaceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, getAllWorkspaces);
router.get('/:id', authenticate, getWorkspaceById);
router.post('/', authenticate, createWorkspace);
router.put('/:id', authenticate, updateWorkspace);
router.delete('/:id', authenticate, deleteWorkspace);
router.post('/:id/members', authenticate, addMember);
router.delete('/:id/members/:memberId', authenticate, removeMember);

export default router;

