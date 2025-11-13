import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './workspaceSlice';
import pageReducer from './pageSlice';

// Load state from localStorage (only in browser)
const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  try {
    const serializedState = localStorage.getItem('workspace-storage');
    if (serializedState === null) {
      return undefined;
    }
    const parsed = JSON.parse(serializedState);
    
    // Handle workspace state
    let workspaceState = undefined;
    if (parsed.workspaces) {
      if (Array.isArray(parsed.workspaces)) {
        workspaceState = {
          workspaces: {
            workspaces: parsed.workspaces,
          },
        };
      } else if (parsed.workspaces.workspaces && Array.isArray(parsed.workspaces.workspaces)) {
        workspaceState = {
          workspaces: parsed.workspaces,
        };
      }
    }
    
    // Handle page state
    let pageState = {
      pages: parsed.pages || {},
    };
    
    // Combine states
    const combinedState = {};
    if (workspaceState) {
      Object.assign(combinedState, workspaceState);
    }
    if (pageState) {
      Object.assign(combinedState, pageState);
    }
    
    // Return combined state or undefined if empty
    if (Object.keys(combinedState).length > 0) {
      return combinedState;
    }
    
    return undefined;
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// Save state to localStorage (only in browser)
const saveState = (state) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const stateToSave = {
      workspaces: state.workspaces?.workspaces || [],
      pages: state.pages?.pages || {},
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem('workspace-storage', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const preloadedState = loadState();

// Ensure pages state is always initialized with correct structure
if (preloadedState) {
  if (!preloadedState.pages) {
    preloadedState.pages = { pages: {} };
  } else if (!preloadedState.pages.pages) {
    preloadedState.pages = { pages: preloadedState.pages || {} };
  }
}

export const store = configureStore({
  reducer: {
    workspaces: workspaceReducer,
    pages: pageReducer,
  },
  preloadedState: preloadedState,
});

// Subscribe to store changes and save to localStorage (only in browser)
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    saveState(store.getState());
  });
}