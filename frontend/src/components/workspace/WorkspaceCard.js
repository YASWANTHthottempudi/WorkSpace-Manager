'use client';

import Link from 'next/link';
import { 
  FolderIcon, 
  TrashIcon,
  PencilIcon 
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';

export default function WorkspaceCard({ workspace, onDelete, onEdit }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${workspace.title}"?`)) {
      onDelete(workspace.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(workspace);
  };

  return (
    <Link href={`/workspace/${workspace.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {workspace.title}
              </h3>
              {workspace.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {workspace.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span>{workspace.members?.length || 0} members</span>
                <span>•</span>
                <span>
                  {new Date(workspace.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit workspace"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete workspace"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}