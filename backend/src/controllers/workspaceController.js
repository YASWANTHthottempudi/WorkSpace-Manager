import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

/**
 * Get all workspaces for the authenticated user
 * GET /api/workspaces
 */
export const getAllWorkspaces = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Find workspaces where user is owner or member
      const workspaces = await Workspace.find({
        $or: [
          { owner: userId },
          { members: userId },
        ],
      })
        .populate('owner', 'name email')
        .populate('members', 'name email')
        .sort({ updatedAt: -1 });
  
      res.status(200).json({
        workspaces,
        count: workspaces.length,
      });
    } catch (error) {
      console.error('Get all workspaces error:', error);
      res.status(500).json({
        error: {
          message: 'Internal server error',
        },
      });
    }
  };

/**
 * Get workspace by ID
 * GET /api/workspaces/:id
 */
export const getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user has access (owner or member)
    const isOwner = workspace.owner._id.toString() === userId.toString();
    const isMember = workspace.members.some(
      member => member._id.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this workspace',
        },
      });
    }

    res.status(200).json({
      workspace,
    });
  } catch (error) {
    console.error('Get workspace by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid workspace ID',
        },
      });
    }
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Create a new workspace
 * POST /api/workspaces
 */
export const createWorkspace = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Title is required',
        },
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        error: {
          message: 'Title cannot exceed 100 characters',
        },
      });
    }

    if (description && description.length > 500) {
      return res.status(400).json({
        error: {
          message: 'Description cannot exceed 500 characters',
        },
      });
    }

    // Create workspace
    const workspace = new Workspace({
      title: title.trim(),
      description: description ? description.trim() : '',
      owner: userId,
      members: [userId], // Add owner as a member
    });

    await workspace.save();

    // Populate owner and members
    await workspace.populate('owner', 'name email');
    await workspace.populate('members', 'name email');

    res.status(201).json({
      workspace,
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: {
          message: messages.join(', '),
        },
      });
    }
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Update workspace
 * PUT /api/workspaces/:id
 */
export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user is the owner
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        error: {
          message: 'Only the owner can update this workspace',
        },
      });
    }

    // Update fields
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          error: {
            message: 'Title cannot be empty',
          },
        });
      }
      if (title.length > 100) {
        return res.status(400).json({
          error: {
            message: 'Title cannot exceed 100 characters',
          },
        });
      }
      workspace.title = title.trim();
    }

    if (description !== undefined) {
      if (description.length > 500) {
        return res.status(400).json({
          error: {
            message: 'Description cannot exceed 500 characters',
          },
        });
      }
      workspace.description = description ? description.trim() : '';
    }

    await workspace.save();

    // Populate owner and members
    await workspace.populate('owner', 'name email');
    await workspace.populate('members', 'name email');

    res.status(200).json({
      workspace,
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid workspace ID',
        },
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: {
          message: messages.join(', '),
        },
      });
    }
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Delete workspace
 * DELETE /api/workspaces/:id
 */
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user is the owner
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        error: {
          message: 'Only the owner can delete this workspace',
        },
      });
    }

    await workspace.deleteOne();

    res.status(200).json({
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    console.error('Delete workspace error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid workspace ID',
        },
      });
    }
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Add member to workspace
 * POST /api/workspaces/:id/members
 */
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user._id;

    if (!email) {
      return res.status(400).json({
        error: {
          message: 'Email is required',
        },
      });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user is the owner
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        error: {
          message: 'Only the owner can add members',
        },
      });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email: email.toLowerCase() });

    if (!userToAdd) {
      return res.status(404).json({
        error: {
          message: 'User not found',
        },
      });
    }

    // Check if user is already a member
    const isAlreadyMember = workspace.members.some(
      memberId => memberId.toString() === userToAdd._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        error: {
          message: 'User is already a member of this workspace',
        },
      });
    }

    // Check if user is the owner
    if (workspace.owner.toString() === userToAdd._id.toString()) {
      return res.status(400).json({
        error: {
          message: 'Owner is already a member',
        },
      });
    }

    // Add member
    workspace.members.push(userToAdd._id);
    await workspace.save();

    // Populate owner and members
    await workspace.populate('owner', 'name email');
    await workspace.populate('members', 'name email');

    res.status(200).json({
      workspace,
      message: 'Member added successfully',
    });
  } catch (error) {
    console.error('Add member error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid workspace ID',
        },
      });
    }
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Remove member from workspace
 * DELETE /api/workspaces/:id/members/:memberId
 */
export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user is the owner or removing themselves
    const isOwner = workspace.owner.toString() === userId.toString();
    const isRemovingSelf = memberId === userId.toString();

    if (!isOwner && !isRemovingSelf) {
      return res.status(403).json({
        error: {
          message: 'Only the owner can remove members, or you can remove yourself',
        },
      });
    }

    // Prevent removing the owner
    if (workspace.owner.toString() === memberId) {
      return res.status(400).json({
        error: {
          message: 'Cannot remove the owner from the workspace',
        },
      });
    }

    // Check if member exists
    const memberIndex = workspace.members.findIndex(
      m => m.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Member not found in this workspace',
        },
      });
    }

    // Remove member
    workspace.members.splice(memberIndex, 1);
    await workspace.save();

    // Populate owner and members
    await workspace.populate('owner', 'name email');
    await workspace.populate('members', 'name email');

    res.status(200).json({
      workspace,
      message: 'Member removed successfully',
    });
  } catch (error) {
    console.error('Remove member error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid workspace ID or member ID',
        },
      });
    }
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
};

