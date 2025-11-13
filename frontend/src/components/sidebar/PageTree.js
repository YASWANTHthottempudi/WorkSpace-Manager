'use client';

import { useMemo } from 'react';
import PageItem from './PageItem';

export default function PageTree({ 
  pages, 
  activePageId, 
  onPageClick, 
  onPageDelete,
  onCreateChildPage 
}) {
  // Build nested tree structure from flat pages array
  const pageTree = useMemo(() => {
    if (!pages || pages.length === 0) return [];

    // Create a map for quick lookup
    const pageMap = new Map();
    const rootPages = [];

    // First pass: create all page objects
    pages.forEach((page) => {
      pageMap.set(page.id, {
        ...page,
        children: [],
      });
    });

    // Second pass: build tree structure
    pages.forEach((page) => {
      const pageObj = pageMap.get(page.id);
      
      if (page.parentId) {
        const parent = pageMap.get(page.parentId);
        if (parent) {
          parent.children.push(pageObj);
        } else {
          // Parent not found, treat as root
          rootPages.push(pageObj);
        }
      } else {
        rootPages.push(pageObj);
      }
    });

    // Sort by updatedAt (most recent first)
    const sortPages = (pageList) => {
      pageList.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      pageList.forEach((page) => {
        if (page.children.length > 0) {
          sortPages(page.children);
        }
      });
    };

    sortPages(rootPages);
    return rootPages;
  }, [pages]);

  if (pageTree.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500 text-sm">
        No pages yet. Create your first page!
      </div>
    );
  }

  return (
    <div className="py-2">
      {pageTree.map((page) => (
        <PageItem
          key={page.id}
          page={page}
          isActive={activePageId === page.id}
          onClick={onPageClick}
          onDelete={onPageDelete}
          onCreateChild={onCreateChildPage}
          level={0}
        />
      ))}
    </div>
  );
}