import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

// Async thunks for API calls
export const fetchWorkspaces = createAsyncThunk(
  'workspaces/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/workspaces');
      return response.data.workspaces;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch workspaces');
    }
  }
);

export const createWorkspace = createAsyncThunk(
  'workspaces/createWorkspace',
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/workspaces', { title, description });
      return response.data.workspace;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create workspace');
    }
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspaces/updateWorkspace',
  async ({ id, title, description }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/workspaces/${id}`, { title, description });
      return response.data.workspace;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update workspace');
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  'workspaces/deleteWorkspace',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/workspaces/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete workspace');
    }
  }
);

const initialState = {
  workspaces: [],
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set workspaces (for backwards compatibility)
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workspaces
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload.map(ws => ({
          ...ws,
          id: ws._id || ws.id,
        }));
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create workspace
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        const workspace = {
          ...action.payload,
          id: action.payload._id || action.payload.id,
        };
        state.workspaces.push(workspace);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update workspace
      .addCase(updateWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWorkspace = {
          ...action.payload,
          id: action.payload._id || action.payload.id,
        };
        const index = state.workspaces.findIndex(
          ws => (ws._id || ws.id) === updatedWorkspace.id
        );
        if (index !== -1) {
          state.workspaces[index] = updatedWorkspace;
        }
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete workspace
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = state.workspaces.filter(
          ws => (ws._id || ws.id) !== action.payload
        );
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setWorkspaces,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;