import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [],
};

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    // Add new workspace
    addWorkspace: (state, action) => {
      const newWorkspace = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description || '',
        owner: action.payload.owner || 'current-user',
        members: action.payload.members || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.workspaces.push(newWorkspace);
    },
    
    // Update workspace
    updateWorkspace: (state, action) => {
      const { id, updates } = action.payload;
      const workspace = state.workspaces.find((ws) => ws.id === id);
      if (workspace) {
        Object.assign(workspace, updates, {
          updatedAt: new Date().toISOString(),
        });
      }
    },
    
    // Delete workspace
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (ws) => ws.id !== action.payload
      );
    },
    
    // Set workspaces (for initialization)
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    
    // Initialize with mock data
    initializeMockData: (state) => {
      if (state.workspaces.length === 0) {
        state.workspaces = [
          {
            id: '1',
            title: 'My First Workspace',
            description: 'A workspace to get started',
            owner: 'current-user',
            members: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Team Collaboration',
            description: 'Workspace for team projects',
            owner: 'current-user',
            members: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    },
  },
});

export const {
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setWorkspaces,
  initializeMockData,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;