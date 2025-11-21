import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

// Async thunks for API calls
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/pages/workspace/${workspaceId}`);
      return { workspaceId, pages: response.data.pages };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch pages');
    }
  }
);

export const fetchPagesTree = createAsyncThunk(
  'pages/fetchPagesTree',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/pages/workspace/${workspaceId}/tree`);
      return { workspaceId, pages: response.data.pages };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch pages tree');
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/createPage',
  async ({ workspaceId, title, content, parentId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/pages', {
        workspaceId,
        title,
        content,
        parentId,
      });
      return { workspaceId, page: response.data.page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create page');
    }
  }
);

export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, title, content, parentId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/pages/${id}`, {
        title,
        content,
        parentId,
      });
      return response.data.page;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update page');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async ({ id, workspaceId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/pages/${id}`);
      return { id, workspaceId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete page');
    }
  }
);

const initialState = {
  pages: {}, // { workspaceId: [pages] }
  loading: false,
  error: null,
};

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Local update for optimistic UI
    updatePageLocal: (state, action) => {
      const { workspaceId, pageId, updates } = action.payload;
      if (!state.pages) {
        state.pages = {};
      }
      const workspacePages = state.pages[workspaceId];
      if (workspacePages) {
        const page = workspacePages.find(
          (p) => (p._id || p.id) === pageId
        );
        if (page) {
          Object.assign(page, updates);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pages
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, pages } = action.payload;
        if (!state.pages) {
          state.pages = {};
        }
        state.pages[workspaceId] = pages.map(page => ({
          ...page,
          id: page._id || page.id,
          workspaceId: page.workspaceId?._id || page.workspaceId || workspaceId,
        }));
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch pages tree
      .addCase(fetchPagesTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagesTree.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, pages } = action.payload;
        // Flatten tree to array
        const flattenTree = (nodes, parentId = null) => {
          let result = [];
          if (Array.isArray(nodes)) {
            nodes.forEach(node => {
              const page = {
                ...node,
                id: node._id || node.id,
                parentId: parentId || node.parentId?._id || node.parentId || null,
                workspaceId: node.workspaceId?._id || node.workspaceId || workspaceId,
              };
              result.push(page);
              if (node.children && node.children.length > 0) {
                result = result.concat(flattenTree(node.children, page.id));
              }
            });
          }
          return result;
        };
        if (!state.pages) {
          state.pages = {};
        }
        state.pages[workspaceId] = flattenTree(pages);
      })
      .addCase(fetchPagesTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create page
      .addCase(createPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, page } = action.payload;
        if (!state.pages) {
          state.pages = {};
        }
        if (!state.pages[workspaceId]) {
          state.pages[workspaceId] = [];
        }
        const newPage = {
          ...page,
          id: page._id || page.id,
          workspaceId: page.workspaceId?._id || page.workspaceId || workspaceId,
        };
        state.pages[workspaceId].push(newPage);
      })
      .addCase(createPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update page
      .addCase(updatePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPage = {
          ...action.payload,
          id: action.payload._id || action.payload.id,
        };
        const workspaceId = updatedPage.workspaceId?._id || updatedPage.workspaceId;
        if (workspaceId && state.pages[workspaceId]) {
          const index = state.pages[workspaceId].findIndex(
            p => (p._id || p.id) === updatedPage.id
          );
          if (index !== -1) {
            state.pages[workspaceId][index] = updatedPage;
          }
        }
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete page
      .addCase(deletePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.loading = false;
        const { id, workspaceId } = action.payload;
        if (state.pages[workspaceId]) {
          // Find all children recursively
          const findChildren = (parentId) => {
            const children = state.pages[workspaceId].filter(
              p => (p.parentId?._id || p.parentId) === parentId
            );
            const allChildren = [...children];
            children.forEach((child) => {
              allChildren.push(...findChildren(child._id || child.id));
            });
            return allChildren;
          };
          const childrenToDelete = findChildren(id);
          const idsToDelete = new Set([id, ...childrenToDelete.map(c => c._id || c.id)]);
          state.pages[workspaceId] = state.pages[workspaceId].filter(
            p => !idsToDelete.has(p._id || p.id)
          );
        }
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  updatePageLocal,
} = pageSlice.actions;

export default pageSlice.reducer;