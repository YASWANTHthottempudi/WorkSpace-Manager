import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pages: {}, // { workspaceId: [pages] }
};

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    // Add new page to workspace
    addPage: (state, action) => {
      const { workspaceId, page } = action.payload;
      // Ensure pages object exists
      if (!state.pages) {
        state.pages = {};
      }
      if (!state.pages[workspaceId]) {
        state.pages[workspaceId] = [];
      }
      const newPage = {
        id: page.id || Date.now().toString(),
        title: page.title || 'Untitled Page',
        content: page.content || '',
        workspaceId,
        parentId: page.parentId || null, // Support parent-child relationship
        updatedBy: page.updatedBy || 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.pages[workspaceId].push(newPage);
    },
    
    // Update page
    updatePage: (state, action) => {
      const { workspaceId, pageId, updates } = action.payload;
      // Ensure pages object exists
      if (!state.pages) {
        state.pages = {};
      }
      const workspacePages = state.pages[workspaceId];
      if (workspacePages) {
        const page = workspacePages.find((p) => p.id === pageId);
        if (page) {
          Object.assign(page, updates, {
            updatedAt: new Date().toISOString(),
          });
        }
      }
    },
    
    // Delete page (and its children recursively)
    deletePage: (state, action) => {
      const { workspaceId, pageId } = action.payload;
      // Ensure pages object exists
      if (!state.pages) {
        state.pages = {};
      }
      const workspacePages = state.pages[workspaceId];
      if (workspacePages) {
        // Find all children recursively
        const findChildren = (parentId) => {
          const children = workspacePages.filter((p) => p.parentId === parentId);
          const allChildren = [...children];
          children.forEach((child) => {
            allChildren.push(...findChildren(child.id));
          });
          return allChildren;
        };

        const childrenToDelete = findChildren(pageId);
        const idsToDelete = new Set([pageId, ...childrenToDelete.map((c) => c.id)]);
        
        state.pages[workspaceId] = workspacePages.filter(
          (p) => !idsToDelete.has(p.id)
        );
      }
    },
    
    // Reorder pages (for drag-and-drop)
    reorderPages: (state, action) => {
      const { workspaceId, pageId, newParentId, newIndex } = action.payload;
      const workspacePages = state.pages[workspaceId];
      if (workspacePages) {
        const page = workspacePages.find((p) => p.id === pageId);
        if (page) {
          page.parentId = newParentId;
          page.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Initialize with mock pages for workspace
    initializeWorkspacePages: (state, action) => {
      const { workspaceId } = action.payload;
      // Ensure pages object exists
      if (!state.pages) {
        state.pages = {};
      }
      // Initialize workspace pages if they don't exist
      if (!state.pages[workspaceId] || state.pages[workspaceId].length === 0) {
        state.pages[workspaceId] = [
          {
            id: '1',
            title: 'Welcome Page',
            content: '# Welcome to Your Workspace\n\nThis is your first page. Start editing to add your content!',
            workspaceId,
            parentId: null,
            updatedBy: 'current-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    },
  },
});

export const {
  addPage,
  updatePage,
  deletePage,
  reorderPages,
  initializeWorkspacePages,
} = pageSlice.actions;

export default pageSlice.reducer;