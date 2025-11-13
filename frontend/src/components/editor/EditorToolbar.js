'use client';

import { 
  SparklesIcon, 
  DocumentTextIcon,
  PencilIcon 
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

export default function EditorToolbar({ 
  onSummarize, 
  onAskAI, 
  onSave,
  isSaving = false 
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-b border-gray-200 px-4 py-3 bg-white">
      <div className="flex items-center gap-2">
        <DocumentTextIcon className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-600">Markdown Editor</span>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onSummarize}
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <SparklesIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Summarize</span>
          <span className="sm:hidden">Sum</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAskAI}
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <SparklesIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="sm:hidden">AI</span>
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <PencilIcon className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}