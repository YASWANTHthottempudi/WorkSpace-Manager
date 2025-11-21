'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchWorkspaces,
  createWorkspace,
  deleteWorkspace as deleteWorkspaceAction,
  updateWorkspace as updateWorkspaceAction,
} from '@/store/workspaceSlice';
import Layout from '@/components/shared/Layout';
import WorkspaceCard from '@/components/workspace/WorkspaceCard';
import EmptyWorkspace from '@/components/workspace/EmptyWorkspace';
import NewWorkspaceModal from '@/components/workspace/NewWorkspaceModal';
import Button from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const workspaces = useAppSelector((state) => {
    const ws = state.workspaces?.workspaces;
    return Array.isArray(ws) ? ws : [];
  });
  const workspacesLoading = useAppSelector((state) => state.workspaces?.loading || false);
  const error = useAppSelector((state) => state.workspaces?.error);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Handle client-side mounting - run only once
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage directly on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setLocalUser(parsedUser);
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
      
      setAuthChecked(true);
    } else {
      setAuthChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  // Only redirect if we've checked and there's no auth at all
  useEffect(() => {
    if (!mounted || !authChecked) return;
    
    // Wait a bit for auth context to load
    const timer = setTimeout(() => {
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');
      const hasUser = typeof window !== 'undefined' && localStorage.getItem('user');
      
      // Only redirect if we're sure there's no auth data
      if (!hasToken && !hasUser && !isAuthenticated && !authLoading) {
        router.push('/auth/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [mounted, authChecked, isAuthenticated, authLoading, router]);
  
  // Fetch workspaces from API
  useEffect(() => {
    if (mounted && isAuthenticated && !authLoading) {
      dispatch(fetchWorkspaces());
    }
  }, [mounted, isAuthenticated, authLoading, dispatch]);

  // Get user from context or local state
  const currentUser = user || localUser;

  const handleCreateWorkspace = async (formData) => {
    try {
      await dispatch(createWorkspace({
        title: formData.title,
        description: formData.description || '',
      })).unwrap();
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  const handleEditWorkspace = (workspace) => {
    setEditingWorkspace(workspace);
    setIsModalOpen(true);
  };

  const handleUpdateWorkspace = async (formData) => {
    if (editingWorkspace) {
      try {
        const id = editingWorkspace._id || editingWorkspace.id;
        await dispatch(updateWorkspaceAction({
          id,
          title: formData.title,
          description: formData.description || '',
        })).unwrap();
        setEditingWorkspace(null);
      } catch (err) {
        console.error('Failed to update workspace:', err);
      }
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      try {
        const workspaceId = typeof id === 'string' ? id : (id._id || id.id);
        await dispatch(deleteWorkspaceAction(workspaceId)).unwrap();
      } catch (err) {
        console.error('Failed to delete workspace:', err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingWorkspace(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingWorkspace) {
      handleUpdateWorkspace(formData);
    } else {
      handleCreateWorkspace(formData);
    }
    handleModalClose();
  };

  // Show loading only briefly while mounting
  if (!mounted) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Show dashboard - allow access if we have auth in storage or context
  // For development, we'll be lenient with auth checks
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Workspaces
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {currentUser?.name 
                ? `Welcome back, ${currentUser.name}!` 
                : currentUser?.email
                ? `Welcome back, ${currentUser.email}!`
                : 'Manage your workspaces'}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5" />
            New Workspace
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {workspacesLoading && workspaces.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading workspaces...</div>
          </div>
        )}

        {/* Workspaces Grid - Responsive */}
        {!workspacesLoading && workspaces.length === 0 ? (
          <EmptyWorkspace onCreateWorkspace={() => setIsModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id || workspace.id}
                workspace={workspace}
                onDelete={handleDeleteWorkspace}
                onEdit={handleEditWorkspace}
              />
            ))}
          </div>
        )}
      </div>

      {/* New/Edit Workspace Modal */}
      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        workspace={editingWorkspace}
      />
    </Layout>
  );
}