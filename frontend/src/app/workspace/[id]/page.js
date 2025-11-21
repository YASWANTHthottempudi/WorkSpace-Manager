'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPages,
  createPage,
  updatePage,
  deletePage,
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
  const workspace = workspaces.find((ws) => (ws._id || ws.id) === workspaceId);
  
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

  // Initialize on mount and fetch pages
  useEffect(() => {
    setMounted(true);
    
    if (workspaceId && isAuthenticated && !authLoading) {
      dispatch(fetchPages(workspaceId));
    }
  }, [workspaceId, isAuthenticated, authLoading, dispatch]);

  // Load first page or create new one
  useEffect(() => {
    if (!mounted || !workspaceId || !isAuthenticated) return;
    
    if (pages.length > 0 && !currentPageId) {
      // Load first page
      const firstPage = pages[0];
      const pageId = firstPage._id || firstPage.id;
      setCurrentPageId(pageId);
      setPageTitle(firstPage.title);
      setPageContent(firstPage.content || '');
    } else if (pages.length === 0) {
      // Create a default page
      const createDefaultPage = async () => {
        try {
          const result = await dispatch(createPage({
            workspaceId,
            title: 'Welcome Page',
            content: '# Welcome to Your Workspace\n\nThis is your first page. Start editing to add your content!',
            parentId: null,
          })).unwrap();
          
          const pageId = result._id || result.id;
          setCurrentPageId(pageId);
          setPageTitle(result.title);
          setPageContent(result.content || '');
        } catch (err) {
          console.error('Failed to create default page:', err);
        }
      };
      
      createDefaultPage();
    }
  }, [mounted, workspaceId, pages.length, currentPageId, isAuthenticated, dispatch]);

  // Update current page when pageId changes or pages update
  useEffect(() => {
    if (currentPageId && pages.length > 0) {
      const page = pages.find((p) => (p._id || p.id) === currentPageId);
      if (page) {
        setPageTitle(page.title);
        setPageContent(page.content || '');
      } else {
        // Page not found, select first page
        if (pages.length > 0) {
          const firstPage = pages[0];
          const pageId = firstPage._id || firstPage.id;
          setCurrentPageId(pageId);
        }
      }
    } else if (pages.length > 0 && !currentPageId) {
      // No current page but pages exist, select first one
      const firstPage = pages[0];
      const pageId = firstPage._id || firstPage.id;
      setCurrentPageId(pageId);
    }
  }, [currentPageId, pages]);

  // Auto-save content after user stops typing
  useEffect(() => {
    if (!currentPageId || !pageContent || !pageTitle) return;

    const timer = setTimeout(() => {
      if (currentPageId) {
        dispatch(
          updatePage({
            id: currentPageId,
            title: pageTitle,
            content: pageContent,
          })
        ).catch((err) => {
          console.error('Failed to auto-save page:', err);
        });
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [pageContent, pageTitle, currentPageId, dispatch]);

  const handleSave = async () => {
    if (!currentPageId) return;
    
    setIsSaving(true);
    try {
      await dispatch(
        updatePage({
          id: currentPageId,
          title: pageTitle,
          content: pageContent,
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to save page:', err);
    } finally {
      setIsSaving(false);
    }
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
    // Title will be saved via auto-save or manual save
  };

  // Handle page click from sidebar
  const handlePageClick = (pageId) => {
    // Ensure we use the correct ID format (_id or id)
    const page = pages.find((p) => (p._id || p.id) === pageId);
    if (page) {
      const actualId = page._id || page.id;
      setCurrentPageId(actualId);
    }
  };

  // Handle create new page
  const handleCreatePage = async () => {
    try {
      const result = await dispatch(
        createPage({
          workspaceId,
          title: 'Untitled Page',
          content: '# New Page\n\nStart writing...',
          parentId: null,
        })
      ).unwrap();
      
      const pageId = result._id || result.id;
      setCurrentPageId(pageId);
      setPageTitle(result.title);
      setPageContent(result.content || '');
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  };

  // Handle create child page
  const handleCreateChildPage = async (parentId) => {
    try {
      const result = await dispatch(
        createPage({
          workspaceId,
          title: 'Untitled Page',
          content: '# New Page\n\nStart writing...',
          parentId: parentId,
        })
      ).unwrap();
      
      // Optionally switch to the new page
      const pageId = result._id || result.id;
      setCurrentPageId(pageId);
      setPageTitle(result.title);
      setPageContent(result.content || '');
    } catch (err) {
      console.error('Failed to create child page:', err);
    }
  };

  // Handle delete page
  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }
    
    try {
      // If deleting current page, switch to first available page
      if (pageId === currentPageId) {
        const remainingPages = pages.filter((p) => (p._id || p.id) !== pageId);
        if (remainingPages.length > 0) {
          const firstPage = remainingPages[0];
          const nextPageId = firstPage._id || firstPage.id;
          setCurrentPageId(nextPageId);
        } else {
          setCurrentPageId(null);
          setPageTitle('');
          setPageContent('');
        }
      }
      
      await dispatch(deletePage({ id: pageId, workspaceId })).unwrap();
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
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