'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon, 
  ChevronRightIcon,
  ChevronDownIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function PageItem({ 
  page, 
  isActive, 
  onClick, 
  onDelete,
  onCreateChild,
  level = 0 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const hasChildren = page.children && page.children.length > 0;

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(page.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${page.title}"?`)) {
      onDelete(page.id);
    }
  };

  const handleCreateChild = (e) => {
    e.stopPropagation();
    onCreateChild(page.id);
  };

  return (
    <div>
      <div
        className={`
          group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
          transition-colors
          ${isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'hover:bg-gray-100 text-gray-700'
          }
        `}
        style={{ paddingLeft: `${12 + level * 20}px` }}
        onClick={handleClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" /> // Spacer for alignment
        )}

        {/* Page Icon */}
        <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />

        {/* Page Title */}
        <span className="flex-1 text-sm truncate">
          {page.title || 'Untitled Page'}
        </span>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCreateChild}
              className="p-1 hover:bg-gray-200 rounded"
              title="Create sub-page"
            >
              <PlusIcon className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Delete page"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Render Children */}
      {hasChildren && isExpanded && (
        <div>
          {page.children.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              isActive={isActive}
              onClick={onClick}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}