import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '../dashboard/page';
import workspaceReducer from '@/store/workspaceSlice';
import pageReducer from '@/store/pageSlice';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com', name: 'Test User' },
    isAuthenticated: true,
    loading: false,
  }),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      workspaces: workspaceReducer,
      pages: pageReducer,
    },
    preloadedState: initialState,
  });
};

describe('DashboardPage Integration', () => {
  it('renders dashboard with workspaces', async () => {
    const store = createMockStore({
      workspaces: {
        workspaces: [
          {
            id: '1',
            title: 'Test Workspace',
            description: 'Test description',
            members: [],
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('My Workspaces')).toBeInTheDocument();
      expect(screen.getByText('Test Workspace')).toBeInTheDocument();
    });
  });

  it('renders empty state when no workspaces', async () => {
    const store = createMockStore({
      workspaces: {
        workspaces: [],
      },
    });

    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('My Workspaces')).toBeInTheDocument();
    });
  });

  it('displays welcome message with user name', async () => {
    const store = createMockStore({
      workspaces: {
        workspaces: [],
      },
    });

    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test User!/i)).toBeInTheDocument();
    });
  });
});

