'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updatePage,
  addPage,
  deletePage,
  initializeWorkspacePages,
} from '@/store/pageSlice';
import Sidebar from '@/components/shared/Sidebar';
import Topbar from '@/components/shared/Topbar';
import PageSidebar from '@/components/sidebar/PageSidebar';
import EditorToolbar from '@/components/editor/EditorToolbar';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import AIModal from '@/components/editor/AIModal';
import Input from '@/components/ui/Input';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  
  // Get workspace
  const workspaces = useAppSelector((state) => state.workspaces.workspaces || []);
  const workspace = workspaces.find((ws) => ws.id === workspaceId);
  
  // Get pages for this workspace
  const pages = useAppSelector((state) => 
    state.pages.pages?.[workspaceId] || []
  );
  
  const [currentPageId, setCurrentPageId] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [aiModalType, setAiModalType] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    if (workspaceId) {
      dispatch(initializeWorkspacePages({ workspaceId }));
    }
  }, [workspaceId, dispatch]);

  // Load first page or create new one
  useEffect(() => {
    if (!mounted || !workspaceId) return;
    
    if (pages.length > 0 && !currentPageId) {
      // Load first page
      const firstPage = pages[0];
      setCurrentPageId(firstPage.id);
      setPageTitle(firstPage.title);
      setPageContent(firstPage.content);
    } else if (pages.length === 0) {
      // Create a default page
      const newPageId = Date.now().toString();
      const newPage = {
        id: newPageId,
        title: 'Welcome Page',
        content: '# Welcome to Your Workspace\n\nThis is your first page. Start editing to add your content!',
        workspaceId,
        parentId: null,
        updatedBy: user?.email || 'current-user',
      };
      dispatch(addPage({ workspaceId, page: newPage }));
      // Set as current page immediately
      setCurrentPageId(newPageId);
      setPageTitle(newPage.title);
      setPageContent(newPage.content);
    }
  }, [mounted, workspaceId, pages.length, currentPageId, dispatch, user]);

  // Update current page when pageId changes or pages update
  useEffect(() => {
    if (currentPageId && pages.length > 0) {
      const page = pages.find((p) => p.id === currentPageId);
      if (page) {
        setPageTitle(page.title);
        setPageContent(page.content);
      } else {
        // Page not found, select first page
        if (pages.length > 0) {
          setCurrentPageId(pages[0].id);
        }
      }
    } else if (pages.length > 0 && !currentPageId) {
      // No current page but pages exist, select first one
      setCurrentPageId(pages[0].id);
    }
  }, [currentPageId, pages]);

  // Auto-save content after user stops typing
  useEffect(() => {
    if (!currentPageId || !pageContent) return;

    const timer = setTimeout(() => {
      if (currentPageId) {
        dispatch(
          updatePage({
            workspaceId,
            pageId: currentPageId,
            updates: { content: pageContent },
          })
        );
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [pageContent, currentPageId, workspaceId, dispatch]);

  const handleSave = () => {
    if (!currentPageId) return;
    
    setIsSaving(true);
    dispatch(
      updatePage({
        workspaceId,
        pageId: currentPageId,
        updates: {
          title: pageTitle,
          content: pageContent,
        },
      })
    );
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleSummarize = () => {
    setAiModalType('summarize');
    setAiModalOpen(true);
  };

  const handleAskAI = () => {
    setAiModalType('ask');
    setAiModalOpen(true);
  };

  const handleTitleChange = (e) => {
    setPageTitle(e.target.value);
    if (currentPageId) {
      dispatch(
        updatePage({
          workspaceId,
          pageId: currentPageId,
          updates: { title: e.target.value },
        })
      );
    }
  };

  // Handle page click from sidebar
  const handlePageClick = (pageId) => {
    setCurrentPageId(pageId);
  };

  // Handle create new page
  const handleCreatePage = () => {
    const newPageId = Date.now().toString();
    const newPage = {
      id: newPageId,
      title: 'Untitled Page',
      content: '# New Page\n\nStart writing...',
      workspaceId,
      parentId: null,
      updatedBy: user?.email || 'current-user',
    };
    dispatch(addPage({ workspaceId, page: newPage }));
    // Set the new page as active immediately
    setCurrentPageId(newPageId);
    setPageTitle(newPage.title);
    setPageContent(newPage.content);
  };

  // Handle create child page
  const handleCreateChildPage = (parentId) => {
    const newPage = {
      title: 'Untitled Page',
      content: '# New Page\n\nStart writing...',
      workspaceId,
      parentId: parentId,
      updatedBy: user?.email || 'current-user',
    };
    dispatch(addPage({ workspaceId, page: newPage }));
  };

  // Handle delete page
  const handleDeletePage = (pageId) => {
    if (pageId === currentPageId) {
      // If deleting current page, switch to first available page
      const remainingPages = pages.filter((p) => p.id !== pageId);
      if (remainingPages.length > 0) {
        setCurrentPageId(remainingPages[0].id);
      } else {
        setCurrentPageId(null);
        setPageTitle('');
        setPageContent('');
      }
    }
    dispatch(deletePage({ workspaceId, pageId }));
  };

  // Redirect if workspace not found
  useEffect(() => {
    if (mounted && !authLoading && workspaceId && !workspace) {
      router.push('/dashboard');
    }
  }, [mounted, authLoading, workspaceId, workspace, router]);

  if (!mounted || authLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="flex items-center justify-center flex-1">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main App Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        {/* Topbar - Always visible */}
        <Topbar />
        
        {/* Workspace Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Page Sidebar - Responsive */}
          <PageSidebar
            pages={pages}
            activePageId={currentPageId}
            workspaceTitle={workspace.title}
            onPageClick={handlePageClick}
            onPageDelete={handleDeletePage}
            onCreatePage={handleCreatePage}
            onCreateChildPage={handleCreateChildPage}
          />

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
            {/* Header - Responsive */}
            <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Input
                    value={pageTitle}
                    onChange={handleTitleChange}
                    placeholder="Page Title"
                    className="text-xl sm:text-2xl font-bold border-none p-0 focus:ring-0 w-full"
                  />
                </div>
                <div className="text-xs sm:text-sm text-gray-500 truncate">
                  {workspace.title}
                </div>
              </div>
            </div>

            {/* Toolbar - Responsive */}
            <EditorToolbar
              onSummarize={handleSummarize}
              onAskAI={handleAskAI}
              onSave={handleSave}
              isSaving={isSaving}
            />

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              {currentPageId ? (
                <MarkdownEditor
                  content={pageContent}
                  onChange={setPageContent}
                  placeholder="Start writing your markdown here..."
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 px-4 text-center">
                  Select a page from the sidebar to start editing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      <AIModal
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setAiModalType(null);
        }}
        type={aiModalType}
        content={pageContent}
      />
    </div>
  );
}