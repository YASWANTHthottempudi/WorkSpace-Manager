import Page from '../models/Page.js';
import Workspace from '../models/Workspace.js';

/**
 * Get all pages for a workspace
 * GET /api/pages/workspace/:workspaceId
 */
export const getPagesByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    // Verify user has access to workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user has access (owner or member)
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this workspace',
        },
      });
    }

    // Get all pages for the workspace
    const pages = await Page.find({ workspaceId })
      .populate('updatedBy', 'name email')
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      pages,
      count: pages.length,
    });
  } catch (error) {
    console.error('Get pages by workspace error:', error);
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
 * Get page tree structure (nested)
 * GET /api/pages/workspace/:workspaceId/tree
 */
export const getPagesTree = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    // Verify user has access to workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user has access (owner or member)
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this workspace',
        },
      });
    }

    // Get all pages for the workspace
    const pages = await Page.find({ workspaceId })
      .populate('updatedBy', 'name email')
      .sort({ order: 1, createdAt: 1 });

    // Build tree structure
    const buildTree = (parentId = null) => {
      return pages
        .filter(page => {
          if (parentId === null) {
            return !page.parentId;
          }
          return page.parentId && page.parentId.toString() === parentId.toString();
        })
        .map(page => ({
          ...page.toObject(),
          children: buildTree(page._id),
        }));
    };

    const tree = buildTree(null);

    res.status(200).json({
      pages: tree,
      count: pages.length,
    });
  } catch (error) {
    console.error('Get pages tree error:', error);
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
 * Get page by ID
 * GET /api/pages/:id
 */
export const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const page = await Page.findById(id)
      .populate('workspaceId')
      .populate('parentId')
      .populate('updatedBy', 'name email');

    if (!page) {
      return res.status(404).json({
        error: {
          message: 'Page not found',
        },
      });
    }

    // Verify user has access to workspace
    const workspace = page.workspaceId;
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this page',
        },
      });
    }

    res.status(200).json({
      page,
    });
  } catch (error) {
    console.error('Get page by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid page ID',
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
 * Create a new page
 * POST /api/pages
 */
export const createPage = async (req, res) => {
  try {
    const { title, content, workspaceId, parentId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Title is required',
        },
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        error: {
          message: 'Workspace ID is required',
        },
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        error: {
          message: 'Title cannot exceed 200 characters',
        },
      });
    }

    // Verify user has access to workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: {
          message: 'Workspace not found',
        },
      });
    }

    // Check if user has access (owner or member)
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this workspace',
        },
      });
    }

    // If parentId is provided, verify it exists and belongs to the same workspace
    if (parentId) {
      const parentPage = await Page.findById(parentId);
      if (!parentPage) {
        return res.status(404).json({
          error: {
            message: 'Parent page not found',
          },
        });
      }
      if (parentPage.workspaceId.toString() !== workspaceId) {
        return res.status(400).json({
          error: {
            message: 'Parent page must be in the same workspace',
          },
        });
      }
    }

    // Get the highest order for pages with the same parent
    const maxOrderPage = await Page.findOne({
      workspaceId,
      parentId: parentId || null,
    }).sort({ order: -1 });

    const order = maxOrderPage ? maxOrderPage.order + 1 : 0;

    // Create page
    const page = new Page({
      title: title.trim(),
      content: content || '',
      workspaceId,
      parentId: parentId || null,
      updatedBy: userId,
      order,
    });

    await page.save();

    // Populate references
    await page.populate('workspaceId');
    await page.populate('parentId');
    await page.populate('updatedBy', 'name email');

    res.status(201).json({
      page,
    });
  } catch (error) {
    console.error('Create page error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: {
          message: messages.join(', '),
        },
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid workspace ID or parent ID',
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
 * Update page
 * PUT /api/pages/:id
 */
export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, parentId, order } = req.body;
    const userId = req.user._id;

    const page = await Page.findById(id).populate('workspaceId');

    if (!page) {
      return res.status(404).json({
        error: {
          message: 'Page not found',
        },
      });
    }

    // Verify user has access to workspace
    const workspace = page.workspaceId;
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this page',
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
      if (title.length > 200) {
        return res.status(400).json({
          error: {
            message: 'Title cannot exceed 200 characters',
          },
        });
      }
      page.title = title.trim();
    }

    if (content !== undefined) {
      page.content = content || '';
    }

    if (parentId !== undefined) {
      // If setting a parent, verify it exists and belongs to the same workspace
      if (parentId) {
        const parentPage = await Page.findById(parentId);
        if (!parentPage) {
          return res.status(404).json({
            error: {
              message: 'Parent page not found',
            },
          });
        }
        if (parentPage.workspaceId.toString() !== page.workspaceId.toString()) {
          return res.status(400).json({
            error: {
              message: 'Parent page must be in the same workspace',
            },
          });
        }
        // Prevent setting a page as its own parent
        if (parentId === id) {
          return res.status(400).json({
            error: {
              message: 'A page cannot be its own parent',
            },
          });
        }
      }
      page.parentId = parentId || null;
    }

    if (order !== undefined) {
      page.order = order;
    }

    // Update updatedBy
    page.updatedBy = userId;

    await page.save();

    // Populate references
    await page.populate('workspaceId');
    await page.populate('parentId');
    await page.populate('updatedBy', 'name email');

    res.status(200).json({
      page,
    });
  } catch (error) {
    console.error('Update page error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid page ID or parent ID',
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
 * Delete page (and its children recursively)
 * DELETE /api/pages/:id
 */
export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const page = await Page.findById(id).populate('workspaceId');

    if (!page) {
      return res.status(404).json({
        error: {
          message: 'Page not found',
        },
      });
    }

    // Verify user has access to workspace
    const workspace = page.workspaceId;
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this page',
        },
      });
    }

    // Find all children recursively
    const findChildren = async (parentId) => {
      const children = await Page.find({ parentId });
      const allChildren = [...children];
      for (const child of children) {
        const grandChildren = await findChildren(child._id);
        allChildren.push(...grandChildren);
      }
      return allChildren;
    };

    const childrenToDelete = await findChildren(id);
    const idsToDelete = [id, ...childrenToDelete.map(c => c._id.toString())];

    // Delete all pages (parent and children)
    await Page.deleteMany({ _id: { $in: idsToDelete } });

    res.status(200).json({
      message: 'Page and its children deleted successfully',
      deletedCount: idsToDelete.length,
    });
  } catch (error) {
    console.error('Delete page error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid page ID',
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
 * Reorder pages
 * PUT /api/pages/:id/reorder
 */
export const reorderPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { newParentId, newIndex } = req.body;
    const userId = req.user._id;

    const page = await Page.findById(id).populate('workspaceId');

    if (!page) {
      return res.status(404).json({
        error: {
          message: 'Page not found',
        },
      });
    }

    // Verify user has access to workspace
    const workspace = page.workspaceId;
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: {
          message: 'You do not have access to this page',
        },
      });
    }

    // If newParentId is provided, verify it exists and belongs to the same workspace
    if (newParentId !== undefined && newParentId !== null) {
      const newParent = await Page.findById(newParentId);
      if (!newParent) {
        return res.status(404).json({
          error: {
            message: 'New parent page not found',
          },
        });
      }
      if (newParent.workspaceId.toString() !== page.workspaceId.toString()) {
        return res.status(400).json({
          error: {
            message: 'New parent must be in the same workspace',
          },
        });
      }
      page.parentId = newParentId;
    } else {
      page.parentId = null;
    }

    // Update order
    if (newIndex !== undefined) {
      page.order = newIndex;
    }

    page.updatedBy = userId;
    await page.save();

    // Populate references
    await page.populate('workspaceId');
    await page.populate('parentId');
    await page.populate('updatedBy', 'name email');

    res.status(200).json({
      page,
      message: 'Page reordered successfully',
    });
  } catch (error) {
    console.error('Reorder page error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: {
          message: 'Invalid page ID or parent ID',
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

