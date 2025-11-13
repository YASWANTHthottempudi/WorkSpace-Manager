'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { EyeIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function MarkdownEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing your markdown here...' 
}) {
  const [viewMode, setViewMode] = useState('edit'); // 'edit', 'preview', 'split'
  const [localContent, setLocalContent] = useState(content || '');

  useEffect(() => {
    setLocalContent(content || '');
  }, [content]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* View Mode Toggle - Responsive */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <button
          onClick={() => setViewMode('edit')}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded whitespace-nowrap ${
            viewMode === 'edit'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CodeBracketIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
          Edit
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded whitespace-nowrap ${
            viewMode === 'preview'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
          Preview
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded whitespace-nowrap hidden md:inline-flex ${
            viewMode === 'split'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Split
        </button>
      </div>

      {/* Editor/Preview Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'edit' && (
          <div className="h-full">
            <textarea
              value={localContent}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full h-full p-3 sm:p-4 border-none resize-none focus:outline-none text-gray-900 placeholder:text-gray-400 font-mono text-xs sm:text-sm"
            />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="h-full overflow-y-auto p-3 sm:p-4 prose prose-sm max-w-none">
            <ReactMarkdown>{localContent || '*Nothing to preview*'}</ReactMarkdown>
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex h-full">
            <div className="w-1/2 border-r border-gray-200">
              <textarea
                value={localContent}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full h-full p-3 sm:p-4 border-none resize-none focus:outline-none text-gray-900 placeholder:text-gray-400 font-mono text-xs sm:text-sm"
              />
            </div>
            <div className="w-1/2 overflow-y-auto p-3 sm:p-4 prose prose-sm max-w-none">
              <ReactMarkdown>{localContent || '*Nothing to preview*'}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}