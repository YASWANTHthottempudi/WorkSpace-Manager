'use client';

import { useState } from 'react';
import { PlusIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import PageTree from './PageTree';

export default function PageSidebar({ 
  pages = [],
  activePageId,
  workspaceTitle,
  onPageClick,
  onPageDelete,
  onCreatePage,
  onCreateChildPage
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(true);

  // Filter pages by search query
  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <DocumentTextIcon className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" />
                Pages
              </h3>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden ml-auto p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onCreatePage}
              className="flex items-center gap-1 px-2 py-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </div>

          {/* Workspace Title */}
          {workspaceTitle && (
            <p className="text-xs text-gray-500 mb-2 truncate">
              {workspaceTitle}
            </p>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Page Tree */}
        <div className="flex-1 overflow-y-auto">
          <PageTree
            pages={filteredPages}
            activePageId={activePageId}
            onPageClick={(pageId) => {
              onPageClick(pageId);
              setIsMobileOpen(false); // Close on mobile after selection
            }}
            onPageDelete={onPageDelete}
            onCreateChildPage={onCreateChildPage}
          />
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {pages.length} {pages.length === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}